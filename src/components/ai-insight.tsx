"use client";

import Image from "next/image";
import { useCompletion } from "ai/react";
import { useEffect, useState } from "react";
import { marked } from "marked";
import { NewsArticle } from "@/lib/validators/news";
import { Skeleton } from "@/components/ui/skeleton";

export function AIInsight({ query }: { query: string }) {
  const [sources, setSources] = useState<NewsArticle[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(true);
  const { completion, complete } = useCompletion({
    api: `/api/news/ai-insights?query=${query}`,
    body: {
      sources
    }
  });

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/news/ai-insights/sources?query=${query}`);
      const data = await response.json();
      setSources(data.sources);
      setIsLoadingSources(false);
    })();
  }, [query]);

  useEffect(() => {
    if (sources.length > 0) {
      complete('');
    }
  }, [sources, complete]);

  const sourcesList = sources.map((source) => (
    <div className="flex items-center gap-2" key={source.url}>
      <Image
        src={`https://www.google.com/s2/favicons?domain=${new URL(source.url).hostname}&sz=64`}
        className="w-4 h-4"
        alt=""
        width={64}
        height={64}
      />
      <a
        href={source.url}
        className="hover:text-primary transition-colors"
      >
        {source.title}
      </a>
    </div>
  ))

  if (isLoadingSources && !completion) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: marked(completion) }}></div>
      <hr />
      {sources.length > 0 && <div className="not-prose space-y-3 text-sm text-muted-foreground">
        <p className="font-medium">Sources:</p>
        {sourcesList}
      </div>}
    </>
  );
}
