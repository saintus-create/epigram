import NewsFeed from "@/components/news-feed";
import { NewsArticle } from "@/types/newsArticle";
import { cookies } from "next/headers";
import { getTopNewsUrl } from "@/modules/utils";
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
  // Mock data for development - replace with real API when ready
  const newsArticles: NewsArticle[] = [
    {
      id: "1",
      title: "AI Breakthrough: New Model Achieves Human-Level Performance",
      summary: "Researchers have developed a groundbreaking AI model that demonstrates human-level performance across multiple cognitive tasks. The model, trained on diverse datasets, shows remarkable capabilities in reasoning, problem-solving, and creative tasks. This advancement marks a significant milestone in artificial intelligence research.",
      text: "Full article text...",
      url: "https://techcrunch.com/ai-breakthrough",
      publishedDate: new Date().toISOString(),
      image: "https://picsum.photos/seed/ai/800/600",
      favicon: "https://techcrunch.com/favicon.ico"
    },
    {
      id: "2",
      title: "Climate Summit: World Leaders Commit to Bold New Targets",
      summary: "At the latest climate summit, world leaders have announced ambitious new carbon reduction targets. The agreement includes commitments to renewable energy expansion, forest conservation, and sustainable development initiatives. Scientists cautiously optimistic about the potential impact.",
      text: "Full article text...",
      url: "https://reuters.com/climate-summit",
      publishedDate: new Date(Date.now() - 86400000).toISOString(),
      image: "https://picsum.photos/seed/climate/800/600",
      favicon: "https://reuters.com/favicon.ico"
    },
    {
      id: "3",
      title: "Tech Giant Unveils Revolutionary Quantum Computer",
      summary: "A major technology company has revealed its latest quantum computing breakthrough, featuring unprecedented processing power and stability. The new system could revolutionize fields from drug discovery to cryptography, marking a new era in computational capabilities.",
      text: "Full article text...",
      url: "https://theverge.com/quantum-computer",
      publishedDate: new Date(Date.now() - 172800000).toISOString(),
      image: "https://picsum.photos/seed/quantum/800/600",
      favicon: "https://theverge.com/favicon.ico"
    },
    {
      id: "4",
      title: "Space Exploration: New Discovery on Mars Excites Scientists",
      summary: "NASA's latest Mars rover has made an exciting discovery that could provide new insights into the planet's geological history. The findings suggest the presence of ancient water systems, potentially supporting theories about past microbial life on Mars.",
      text: "Full article text...",
      url: "https://nasa.gov/mars-discovery",
      publishedDate: new Date(Date.now() - 259200000).toISOString(),
      image: "https://picsum.photos/seed/mars/800/600",
      favicon: "https://nasa.gov/favicon.ico"
    },
    {
      id: "5",
      title: "Medical Breakthrough: New Treatment Shows Promise",
      summary: "Researchers have developed a novel treatment approach that shows remarkable promise in early clinical trials. The therapy targets previously untreatable conditions and could benefit millions of patients worldwide. Further studies are underway to confirm efficacy.",
      text: "Full article text...",
      url: "https://nature.com/medical-breakthrough",
      publishedDate: new Date(Date.now() - 345600000).toISOString(),
      image: "https://picsum.photos/seed/medical/800/600",
      favicon: "https://nature.com/favicon.ico"
    }
  ];

  return (
    <main className="relative h-screen bg-transparent">
      <NewsFeed newsArticles={newsArticles} />
    </main>
  );
}