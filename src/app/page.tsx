import NewsFeed from "@/components/news-feed";
import { NewsArticle } from "@/types/newsArticle";
import Exa from "exa-js";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News Feed",
  description: "A sleek, AI-powered news feed delivering concise updates for busy readers.",
  openGraph: {
    title: "News Feed",
    description: "A sleek, AI-powered news feed delivering concise updates for busy readers.",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "News Feed",
    description: "A sleek, AI-powered news feed delivering concise updates for busy readers.",
    images: [],
  },
};

export default async function Home() {
  let newsArticles: NewsArticle[] = [];

  try {
    const exa = new Exa(process.env.EXASEARCH_API_KEY);

    // Calculate date 2 days ago for recent news
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const result = await exa.searchAndContents(
      "latest important global news stories political technology science",
      {
        type: "neural",
        useAutoprompt: true,
        numResults: 15,
        text: true,
        startPublishedDate: twoDaysAgo.toISOString(),
        category: "news"
      }
    );

    newsArticles = result.results.map((item, index) => {
      // Use a placeholder only if absolutely necessary, but preferably empty to trigger the gradient fallback
      const image = '';

      // Extract hostname for favicon
      const hostname = (() => {
        try {
          return item.url ? new URL(item.url).hostname : 'google.com';
        } catch {
          return 'google.com';
        }
      })();

      const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

      return {
        id: item.id || `news-${index}`,
        title: item.title || "Untitled News",
        summary: item.text ? item.text.slice(0, 200) + "..." : "Click to read more...",
        text: item.text || "No content available.",
        url: item.url || '#',
        publishedDate: item.publishedDate || new Date().toISOString(),
        image: image,
        favicon: favicon,
      };
    });

  } catch (error) {
    console.error("Error fetching news from Exa:", error);
    // Fallback only if API fails, but strictly NO stock images
    newsArticles = [
      {
        id: "error-1",
        title: "Unable to load latest news",
        summary: "Please check your connection or API configuration.",
        text: "We encountered an issue fetching the latest stories. Please try again later.",
        url: "#",
        publishedDate: new Date().toISOString(),
        image: "", // No stock image
        favicon: ""
      }
    ];
  }

  return (
    <main className="relative h-screen bg-transparent">
      <NewsFeed newsArticles={newsArticles} />
    </main>
  );
}