"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { useSwipeable, SwipeEventData } from "react-swipeable";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { StepBack } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AIInsight } from "./ai-insight";
import { XIcon } from "@/components/icons/x-icon";
import { Box } from "@/components/layout/box";
import { Stack } from "@/components/layout/stack";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";

interface SwipeCardProps {
  title: string;
  content: string;
  onSwipe: (direction: "left" | "right") => void;
  date: string;
  image?: string;
  favicon?: string;
  url: string;
  isTop?: boolean;
  onBack?: () => void;
  showBack?: boolean;
}

function getTitleSizeClass(title: string): string {
  if (title.length <= 40) {
    return "text-2xl"; // Single size for short titles
  } else if (title.length <= 80) {
    return "text-xl"; // Medium size for medium titles
  } else {
    return "text-lg"; // Smaller size for long titles
  }
}

const DEFAULT_IMAGE = '';

export function SwipeCard({
  title,
  content,
  date,
  image = DEFAULT_IMAGE,
  url,
  onSwipe,
  onBack,
  isTop = false,
  showBack = false,
}: SwipeCardProps) {
  const [exitX, setExitX] = useState<number>(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [transform, setTransform] = useState({ x: 0, scale: 1, rotate: 0 });

  const handleSwipe = useCallback((direction: "left" | "right") => {
    const screenWidth = window.innerWidth;
    setExitX(direction === "right" ? screenWidth : -screenWidth);
    onSwipe(direction);
  }, [onSwipe]);

  const handlers = useSwipeable({
    onSwiping: (e: SwipeEventData) => {
      if (!isTop) return;

      const deltaX = e.deltaX;
      const absX = Math.abs(deltaX);

      // Calculate scale and rotation based on swipe distance
      const scale = Math.max(0.8, 1 - absX / 1000);
      const rotate = (deltaX / 200) * 15; // Max rotation of 15 degrees

      setTransform({
        x: deltaX,
        scale,
        rotate,
      });
    },
    onSwiped: (e: SwipeEventData) => {
      if (!isTop) return;

      const threshold = 0.4;
      const velocity = Math.abs(e.velocity);
      const deltaX = Math.abs(e.deltaX);
      const screenWidth = window.innerWidth;
      const swipePercentage = deltaX / (screenWidth * 0.4);

      const velocityContribution = Math.min(velocity / 2, threshold * 1.2);
      const distanceContribution = swipePercentage;
      const swipeComplete = velocityContribution + distanceContribution > threshold;

      if (swipeComplete) {
        const direction = e.deltaX > 0 ? "right" : "left";
        handleSwipe(direction);
      } else {
        // Reset card position
        setTransform({ x: 0, scale: 1, rotate: 0 });
      }
    },
    trackMouse: true,
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 10,
  });

  // Update keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const modifierPressed = isMac ? e.metaKey : e.ctrlKey;

      if (isTop && modifierPressed && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        const direction = e.key === "ArrowLeft" ? "left" : "right";
        handleSwipe(direction);
      }
    };

    if (isTop) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isTop, handleSwipe]);

  const host = new URL(url).hostname;
  const cleanHost = host.replace(/^www\./, "");
  const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${host}&sz=64`;

  const cardStyle = {
    transform: `translate3d(${exitX || transform.x}px, 0, 0) scale(${transform.scale}) rotate(${transform.rotate}deg)`,
    transition: exitX ? 'transform 0.3s ease-out' : 'transform 0.1s ease-out',
    position: 'absolute',
    width: '100%',
    height: '100%',
    touchAction: isTop ? 'none' : 'auto',
  } as const;

  return (
    <div
      style={cardStyle}
      {...(isTop ? handlers : {})}
      aria-label="News card"
      role="article"
    >
      <Box className="w-full h-full">
        <Card className="w-full max-h-[84dvh] h-[550px] overflow-hidden flex flex-col bg-card shadow-xl mt-[env(safe-area-inset-top)] border-border">
          {/* Image Section - Reduced height ratio (approx 40%) */}
          <Box className="relative w-full h-[200px] bg-muted shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover z-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== DEFAULT_IMAGE) {
                  target.src = DEFAULT_IMAGE;
                  target.className = "absolute inset-0 w-full h-full object-cover z-0 opacity-50";
                }
              }}
            />

            {/* Removed dark gradient overlay for clarity */}

            {/* Source badge moved to top-right, distinct from image content */}
            <div className="absolute top-3 right-3 z-[3]">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm hover:bg-background/90 text-foreground gap-1.5 pl-1.5 pr-2.5 py-1">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={googleFaviconUrl} alt={cleanHost} />
                  <AvatarFallback className="text-[8px]">
                    {cleanHost.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{cleanHost}</span>
              </Badge>
            </div>
          </Box>

          {/* Content Section - Increased space for text (approx 60%) */}
          <Stack className="flex-1 overflow-hidden bg-card" gap="sm">
            <CardHeader className="px-6 pt-5 pb-2">
              {/* Date moved above title for context/timeline establishment */}
              <div className="flex items-center gap-2 mb-2">
                <time dateTime={date} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </time>
                <span className="text-xs text-muted-foreground/50">•</span>
                <span className="text-xs text-muted-foreground font-medium">News</span>
              </div>

              <h2
                className={cn(
                  getTitleSizeClass(title),
                  "font-bold leading-tight text-foreground tracking-tight",
                  "line-clamp-3"
                )}
              >
                {title}
              </h2>
            </CardHeader>

            <CardContent className="flex-grow px-6 py-0 relative overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <p className="text-base leading-relaxed text-muted-foreground">
                {content}
              </p>
            </CardContent>

            <CardFooter className="mt-auto pt-4 pb-6 px-6 flex items-center justify-between gap-2 border-t border-border/50 bg-muted/20">
              {showBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBack?.();
                  }}
                  className="text-muted-foreground hover:text-foreground -ml-2"
                >
                  <StepBack className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
              )}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <Badge
                  variant="outline"
                  className="cursor-pointer ml-auto gap-1.5 py-1.5 px-3 hover:bg-accent transition-colors border-primary/20 text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSheetOpen(true);
                  }}
                >
                  <span className="font-medium">AI Insights</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="stroke-primary"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  >
                    <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z" />
                  </svg>
                </Badge>
                <SheetContent
                  side="bottom"
                  className="h-[calc(92dvh-env(safe-area-inset-top))] sm:h-[calc(94dvh-env(safe-area-inset-top))] pb-safe overflow-y-auto"
                >
                  <SheetTitle className="sr-only">Article Details</SheetTitle>
                  <FadeIn duration={0.4}>
                    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
                      <article className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-p:text-base prose-img:rounded-lg max-w-none">
                        <div className="not-prose relative w-full aspect-[2/1] mb-6 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={image}
                            alt={title}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = DEFAULT_IMAGE;
                              target.className = "w-16 h-16 opacity-50";
                            }}
                          />
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-foreground">{title}</h1>

                        <div className="not-prose flex items-center gap-3 text-sm text-muted-foreground mb-6">
                          <time className="font-medium bg-secondary px-2 py-0.5 rounded-md">
                            {new Date(date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </time>
                          <span>•</span>
                          <span className="font-medium">{cleanHost}</span>
                        </div>

                        <a
                          href={`https://x.com/search?q=${encodeURIComponent(
                            title
                          )}&f=live`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="not-prose mt-4 mb-6 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium text-sm transition-all"
                        >
                          <span>See discussion on</span>
                          <XIcon className="w-4 h-4" />
                        </a>

                        {sheetOpen && <AIInsight query={title} />}
                      </article>
                    </div>
                  </FadeIn>
                </SheetContent>
              </Sheet>
            </CardFooter>
          </Stack>
        </Card>
      </Box>
    </div>
  );
}
