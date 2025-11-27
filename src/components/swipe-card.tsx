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

const DEFAULT_IMAGE = '/static/images/default.png';

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
      <div className="w-full h-full">
        <Card className="w-full max-h-[84dvh] h-[550px] overflow-hidden flex flex-col bg-card shadow-xl mt-[env(safe-area-inset-top)]">
          {/* Image Section */}
          <div className="relative w-full h-[250px] bg-muted pt-[env(safe-area-inset-top)]">
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
                  // Keep object-cover for the default image so it fills the area
                  target.className = "absolute inset-0 w-full h-full object-cover z-0 opacity-50";
                }
              }}
            />

            {/* Updated gradient overlay with conditional intensity */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b pointer-events-none z-[1]",
                image === DEFAULT_IMAGE
                  ? "from-black/40 via-black/20 to-black/60" // lighter gradient for default image
                  : "from-black/80 via-black/40 to-black/90" // original gradient for normal images
              )}
            />

            {/* Source at the top */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 right-0 p-4 z-[3] flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="w-5 h-5">
                <AvatarImage src={googleFaviconUrl} alt={cleanHost} />
                <AvatarFallback className="text-[10px] bg-primary/10">
                  {cleanHost.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{cleanHost}</span>
            </a>

            <CardHeader className="absolute bottom-0 text-white pointer-events-none px-6 pb-6 z-[2] w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <h2
                className={cn(
                  getTitleSizeClass(title),
                  "font-semibold leading-snug",
                  "line-clamp-3"
                )}
              >
                {title}
              </h2>
            </CardHeader>
          </div>

          {/* Content Section */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <CardContent className="flex-grow py-6 px-6 relative -mt-2 overflow-y-auto pointer-events-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <p className="text-sm leading-normal text-gray-700 dark:text-gray-300 tracking-normal select-none">
                <time dateTime={date} className="font-medium">
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                &nbsp;&middot;&nbsp;
                {content}
              </p>
            </CardContent>

            <CardFooter className="mt-auto pt-2 flex items-center justify-between gap-2">
              {showBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBack?.();
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <StepBack className="w-4 h-4" />
                  Back
                </Button>
              )}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSheetOpen(true);
                  }}
                  className="ml-auto"
                >
                  AI Insights
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="[&>path]:stroke-[url(#ai-gradient)]"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <defs>
                      <linearGradient
                        id="ai-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" style={{ stopColor: "#FF3366" }} />
                        <stop offset="50%" style={{ stopColor: "#8B5CF6" }} />
                        <stop offset="100%" style={{ stopColor: "#0EA5E9" }} />
                      </linearGradient>
                    </defs>
                    <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z" />
                  </svg>
                </Button>
                <SheetContent
                  side="bottom"
                  className="h-[calc(92dvh-env(safe-area-inset-top))] sm:h-[calc(94dvh-env(safe-area-inset-top))] pb-safe overflow-y-auto"
                >
                  <SheetTitle className="sr-only">Article Details</SheetTitle>
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

                      <h1 className="text-3xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{title}</h1>

                      <div className="not-prose flex items-center gap-3 text-sm text-muted-foreground">
                        <time className="font-medium bg-secondary px-2 py-0.5 rounded-md">
                          {new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
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
                </SheetContent>
              </Sheet>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
