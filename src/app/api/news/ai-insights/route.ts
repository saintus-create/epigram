import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { formatDataStreamPart, streamText } from 'ai';
import { NewsArticle } from '@/lib/validators/news';
import redis from '@/modules/redis';
import { Ratelimit } from '@upstash/ratelimit';

export const maxDuration = 30;

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, '60s'),
});

export async function POST(req: NextRequest) {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'Unknown IP';
    const { success } = await ratelimit.limit(`ai-insight:${ip}`);

    if (!success) {
        return new Response('Ratelimited!', { status: 429 });
    }

    const { sources }: { sources: NewsArticle[] } = await req.json();

    const sourceUrls = sources.map((source) => source.url);
    const cacheKey = `ai-insights:${sourceUrls.join(',')}`;
    const cached = await redis.get(cacheKey) as string;
    if (cached) {
        return new Response(formatDataStreamPart('text', cached), {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
        });
    }

    const prompt = `As an expert journalist and storyteller, analyze these articles and create a clear, structured summary in the following format:

    KEY TAKEAWAYS:
    • List 3-4 main points from across all articles
    • Each point should be 1-2 sentences

    MAIN STORY:
    • Break down the story into 4-5 short paragraphs
    • Each paragraph should be 2-3 sentences maximum
    • Use simple, clear language

    KEY FACTS:
    • List 2-3 notable statistics or facts
    • Include sources where relevant

    WHAT'S NEXT:
    • 2-3 bullet points about potential future implications
    • Keep predictions grounded in the source material

    Please maintain journalistic integrity while making the content accessible and easy to scan.

    Source Articles:
    ${sources.map((source) => `URL: ${source.url}\nContent: ${source.text}`).join('\n\n')}`;

    const model = process.env.OPENAI_MODEL_NAME || 'gpt-4o-mini';
    const result = await streamText({
        model: openai(model),
        prompt,
        async onFinish({ text }) {
            await redis.set(cacheKey, text);
            await redis.expire(cacheKey, 60 * 60 * 24);
        },
    });
    return result.toDataStreamResponse();
}