import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.startsWith('https://')
    ? process.env.UPSTASH_REDIS_REST_URL
    : "https://example.com";

const redis = new Redis({
    url: redisUrl,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "example_token",
});

export default redis;