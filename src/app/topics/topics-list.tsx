'use client';

import { useState, useEffect } from "react";
import { CircleCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOPICS = [
  "General",
  "News",
  "Business",
  "Entertainment",
  "Health",
  "Science",
  "Sports",
  "Technology",
];

const COOKIE_NAME = "followedTopics";
const COOKIE_MAX_AGE = 31536000; // 1 year in seconds

const TopicsList = () => {
  const [followedTopics, setFollowedTopics] = useState<Set<string>>(new Set());

  // Load initial followed topics from cookies
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const followedTopicsCookie = cookies.find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));
    if (followedTopicsCookie) {
      const topics = JSON.parse(decodeURIComponent(followedTopicsCookie.split("=")[1]));
      setFollowedTopics(new Set(topics));
    }
  }, []);

  // Handle follow/unfollow logic
  const handleToggleFollow = (topic: string) => {
    setFollowedTopics((prev) => {
      const newTopics = new Set(prev);
      if (newTopics.has(topic)) {
        newTopics.delete(topic);
      } else {
        newTopics.add(topic);
      }

      // Save to cookies
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify(Array.from(newTopics))
      )}; path=/; max-age=${COOKIE_MAX_AGE}`;

      return newTopics;
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Topics</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Choose the news topics you&apos;re interested in. We&apos;ll personalize your feed based on your selections.
        </p>
      </div>

      <div className="h-[calc(100%-48px)] overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => {
            const isFollowed = followedTopics.has(topic);
            return (
              <Button
                key={topic}
                onClick={() => handleToggleFollow(topic)}
                variant={isFollowed ? "default" : "outline"}
                size="sm"
                className="gap-3"
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  {topic}
                </span>
                {isFollowed ? (
                  <CircleCheck className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TopicsList;