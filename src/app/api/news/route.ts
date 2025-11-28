import { NextRequest } from 'next/server';
import redis from '@/modules/redis';
import { NewsArticle } from '@/lib/validators/news';

const getUniqueArticlesBy = <K extends keyof NewsArticle>(arr: NewsArticle[], key: K) => {
    return arr.filter(
        (article: NewsArticle, index: number, self: NewsArticle[]) =>
            index === self.findIndex((t) => t[key] === article[key])
    );
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const categories = searchParams.get("categories") || "general,technology,science,health";
    const categoryList = categories.split(',');

    const newsArticles: NewsArticle[] = [];

    // Fetch JSON strings from Redis for each category
    for (const category of categoryList) {
        const articles = await redis.get(`news:${category}`) as NewsArticle[];
        if (!articles) {
            continue;
        }
        newsArticles.push(...articles);
    }

    // Remove duplicates based on title
    const uniqueArticles = getUniqueArticlesBy(newsArticles, 'title');

    // Sort articles by publishedDate
    uniqueArticles.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

    // Get top 100 results
    const topArticles = uniqueArticles.slice(0, 100);

    return new Response(JSON.stringify(topArticles), {
        headers: { "Content-Type": "application/json", "Cache-Control": "public, s-maxage=300" },
    });
}