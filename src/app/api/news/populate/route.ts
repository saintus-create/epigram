/**
 *  This route is used to populate the news feed with the latest news articles. 
 *  It fetches the latest news articles from the mediastack API and stores them in Redis.
 *  Ideally, this route should be called by a cron job.
 */
import { NextRequest, NextResponse } from 'next/server';
import redis from '@/modules/redis';
import { NewsArticle } from '@/lib/validators/news';
import { getContents } from '@/modules/exa';

const topics = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
/**
 * There are some urls that we don't want to include in the news feed. These can be low quality content, job boards, etc.
 */
const URLS_TO_EXCLUDE = ['ycombinator.com', 'news.ycombinator.com', 'jobs.ashbyhq.com'];

export async function GET(req: NextRequest) {
    // Get cron secret from headers
    const cronSecret = req.headers.get(process.env.EPIGRAM_SECRET_HEADER_NAME!);
    if (cronSecret !== process.env.EPIGRAM_CRON_SECRET) {
        return new NextResponse("Cron secret doesn't match", {
            status: 400,
        });
    }
    for (const topic of topics) {
        const response = await fetch(
            `https://api.mediastack.com/v1/news?access_key=${process.env.MEDIASTACK_API_KEY}&languages=en&countries=us&categories=${topic}&limit=${process.env.PER_TOPIC_NEWS_LIMIT}`
        );
        const data = await response.json();

        // Remove urls that are in the exclusion list
        const articles = data.data.filter((entry: { url: string }) => !URLS_TO_EXCLUDE.includes(new URL(entry.url).hostname));

        const urls = articles.map((entry: { url: string }) => entry.url);

        const newsArticles = await getContents(urls);

        // copy published_at from original articles to the new articles
        // because when exa crawls the articles, it sometimes gets the first published date which can be very old
        newsArticles.forEach((article: NewsArticle) => {
            const originalArticle = articles.find((entry: NewsArticle) => entry.url === article.url);
            if (originalArticle) {
                article.publishedDate = originalArticle.published_at;
            }
        });

        await redis.set(`news:${topic}`, JSON.stringify(newsArticles));
    }

    return new NextResponse("Populated news successfully", {
        status: 200,
    });
}