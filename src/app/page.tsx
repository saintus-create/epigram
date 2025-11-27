import NewsFeed from "@/components/news-feed";
import { NewsArticle } from "@/types/newsArticle";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Epigram: Open-Source, Free, and AI-Powered News in Short.",
  description:
    "An open-source, AI-powered news app for busy people. Stay updated with bite-sized news, real-time updates, and in-depth analysis. Experience balanced, trustworthy reporting tailored for fast-paced lifestyles in a sleek, user-friendly interface.",
  openGraph: {
    title: "Epigram: Open-Source, Free, and AI-Powered News in Short.",
    description:
      "An open-source, AI-powered news app for busy people. Stay updated with bite-sized news, real-time updates, and in-depth analysis. Experience balanced, trustworthy reporting tailored for fast-paced lifestyles in a sleek, user-friendly interface.",
    images: [{ url: "/static/images/epigram-og.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Epigram: Open-Source, Free, and AI-Powered News in Short.",
    description:
      "An open-source, AI-powered news app for busy people. Stay updated with bite-sized news, real-time updates, and in-depth analysis. Experience balanced, trustworthy reporting tailored for fast-paced lifestyles in a sleek, user-friendly interface.",
    images: ["/static/images/epigram-og.png"],
  },
};

export default async function Home() {
  // Fetch news from Google News RSS
  let newsArticles: NewsArticle[] = [];

  try {
    // Updated query to focus on political protests, specifically mentioning Italy and anti-monarchy/anti-government themes
    const response = await fetch('https://news.google.com/rss/search?q=political+protests+italy+anti-government+demonstration+world&hl=en-US&gl=US&ceid=US:en', { next: { revalidate: 3600 } });
    const text = await response.text();

    // Simple XML parsing with robust regex for <item> elements
    const items = text.match(/<item[^>]*>[\s\S]*?<\/item>/g) || [];

    newsArticles = items.slice(0, 10).map((item, index) => {
      const titleMatch = item.match(/<title>(.*?)<\/title>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      const descriptionMatch = item.match(/<description>(.*?)<\/description>/);
      const sourceMatch = item.match(/<source url=".*?">(.*?)<\/source>/);

      // Clean up title (remove source if present)
      let title = titleMatch ? titleMatch[1] : 'No Title';
      const source = sourceMatch ? sourceMatch[1] : 'News';
      title = title.replace(` - ${source}`, '');

      // Extract clean text from description (remove HTML)
      let summary = descriptionMatch ? descriptionMatch[1] : '';
      // Decode HTML entities
      summary = summary
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');

      // Remove all HTML tags
      const tempDiv = summary.replace(/<[^>]*>/g, '');
      // Remove URLs
      summary = tempDiv.replace(/https?:\/\/[^\s]+/g, '').trim();

      summary = summary || "Click to read more about this developing story.";

      // Images related to political protests
      const images = [
        "https://images.unsplash.com/photo-1575624773296-3392395a353d?w=800&q=80", // Protest crowd
        "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&q=80", // Smoke/Protest
        "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800&q=80", // Signs
        "https://images.unsplash.com/photo-1596562095627-c466472d2446?w=800&q=80", // Megaphone
        "https://images.unsplash.com/photo-1585128993273-047970f72bf6?w=800&q=80"  // Flag
      ];
      const image = images[index % images.length];

      const hostname = (() => {
        try {
          return linkMatch ? new URL(linkMatch[1]).hostname : 'google.com';
        } catch {
          return 'google.com';
        }
      })();
      const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
      const publishedDate = (() => {
        try {
          return pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();
        } catch {
          return new Date().toISOString();
        }
      })();
      return {
        id: `news-${index}`,
        title: title.replace("<![CDATA[", "").replace("]]>", ""),
        summary: summary.replace("<![CDATA[", "").replace("]]>", "").slice(0, 200) + "...",
        text: summary,
        url: linkMatch ? linkMatch[1] : '#',
        publishedDate: publishedDate,
        image: image,
        favicon: favicon,
      };
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    // Fallback data if fetch fails
    newsArticles = [
      {
        id: "1",
        title: "Mass Protests in Italy Against Government Reforms",
        summary: "Thousands gathered in Rome to protest against the new proposed constitutional reforms. Demonstrators argue the changes would undermine democratic checks and balances.",
        text: "Full article text...",
        url: "https://example.com/italy-protest",
        publishedDate: new Date().toISOString(),
        image: "https://images.unsplash.com/photo-1575624773296-3392395a353d?w=800&q=80",
        favicon: "https://example.com/favicon.ico"
      },
      {
        id: "2",
        title: "'Not My King': Anti-Monarchy Protests Erupt",
        summary: "Anti-monarchy groups have staged demonstrations calling for an elected head of state. The movement has gained momentum in recent weeks with coordinated rallies across major cities.",
        text: "Full article text...",
        url: "https://example.com/no-king-protest",
        publishedDate: new Date(Date.now() - 86400000).toISOString(),
        image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800&q=80",
        favicon: "https://example.com/favicon.ico"
      }
    ];
  }

  return (
    <main className="relative h-screen bg-transparent">
      <NewsFeed newsArticles={newsArticles} />
    </main>
  );
}