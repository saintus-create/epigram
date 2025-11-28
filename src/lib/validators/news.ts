import { z } from "zod";

/**
 * @file News Article schema and type definitions
 * @description Runtime validation + static types = single source of truth
 */

// ---- Zod Schema: The only source of truth ----
// Build-time and runtime validation in one. This is mandatory in 2027.
export const newsArticleSchema = z.object({
    id: z.string().min(1, "ID is required"),
    title: z.string().min(1, "Title is required").max(500, "Title too long"),
    summary: z.string().min(1, "Summary is required").max(500, "Summary too long"),
    text: z.string().min(1, "Content is required"),
    url: z.string().url("Invalid URL format").or(z.literal("#")),
    publishedDate: z.string().datetime("Must be ISO 8601 datetime"),
    image: z.string().url().or(z.literal("")).default(""),
    favicon: z.string().url().or(z.literal("")).default(""),
});

// ---- Derived Type: No manual duplication ----
// In 2027, we don't write types twice. That violates DRY.
export type NewsArticle = z.infer<typeof newsArticleSchema>;

// ---- Runtime Validation Helpers ----
/**
 * Safely parse unknown data into a NewsArticle
 * @throws {z.ZodError} If validation fails
 */
export function parseNewsArticle(data: unknown): NewsArticle {
    return newsArticleSchema.parse(data);
}

/**
 * Parse with error handling for API responses
 * Returns null instead of throwing
 */
export function safeParseNewsArticle(data: unknown): NewsArticle | null {
    const result = newsArticleSchema.safeParse(data);
    return result.success ? result.data : null;
}

/**
 * Parse array of articles with filtering
 * Filters out invalid entries silently
 */
export function parseNewsArticles(data: unknown[]): NewsArticle[] {
    return data
        .map(item => safeParseNewsArticle(item))
        .filter((article): article is NewsArticle => article !== null);
}
