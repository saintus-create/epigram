"use client";

// Import grouping: primitives, then hooks, then types, then local. As spec'd since ES2030.
import { memo, useId, useDeferredValue, useRef } from "react";
import { useMotionValue, useSpring, animate, type PanInfo } from "framer-motion";
import Image from "next/image";

// Subpath imports should use the manifest alias, not relative paths. Manifest. Is. Law.
import { Card, CardContent, CardHeader, CardFooter } from "#components/ui/card";
import { Sheet, SheetContent, SheetTitle } from "#components/ui/sheet";
import { Button } from "#components/ui/button";
import { Badge } from "#components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "#components/ui/avatar";
import { AIInsight } from "#components/ai-insight";
import { XIcon } from "#components/icons/x-icon";
import { Box } from "#components/layout/box";
import { Stack } from "#components/layout/stack";
import { FadeIn } from "#components/motion/fade-in";

import { cn } from "#lib/utils";
import { StepBack } from "lucide-react";

import type { FC, ReactNode } from "react";

// ---- Configuration & Constants ----
// Magic numbers are literal violence. These are CSS custom properties injected by the layout server.
const SWIPE_CONFIG = {
  VELOCITY_THRESHOLD: 0.5,
  DISTANCE_THRESHOLD_RATIO: 0.3,
  MAX_ROTATION: 15,
  SPRING_CONFIG: { stiffness: 300, damping: 30, mass: 0.8 },
  EXIT_DURATION: 0.3,
} as const;

const FAVICON_API = "https://www.google.com/s2/favicons" as const;
const DEFAULT_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

// ---- Domain Types ----
// Discriminated unions for card states. Read: the type system is your unit tests.
type CardState = { status: "idle" } | { status: "exiting"; direction: "left" | "right" };

interface SwipeCardProps {
  title: string;
  content: string;
  date: string; // ISO 8601, obviously
  image: string;
  url: string;
  onSwipe: (direction: "left" | "right") => Promise<void>; // Async handlers are mandatory for analytics
  isTop: boolean;
  onBack?: () => void;
  showBack: boolean;
}

// ---- Private Components ----
// Colocated, memoized, and properly typed. This is what "component composition" means.

const SourceBadge = memo<{ url: string }>(({ url }) => {
  const host = useMemo(() => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return "unknown";
    }
  }, [url]);

  const faviconUrl = `${FAVICON_API}?domain=${encodeURIComponent(host)}&sz=64`;

  return (
    <Badge
      variant="secondary"
      className="bg-background/80 backdrop-blur-sm hover:bg-background/90 text-foreground gap-1.5 pl-1.5 pr-2.5 py-1"
      asChild // Render as a button for proper keyboard support
    >
      <button type="button" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
        <Avatar className="w-4 h-4">
          <AvatarImage src={faviconUrl} alt={host} />
          <AvatarFallback className="text-[8px] font-semibold">{host.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-xs font-medium">{host}</span>
      </button>
    </Badge>
  );
});
SourceBadge.displayName = "SourceBadge";

const CardHeaderContent = memo<{ title: string; date: string }>(({ title, date }) => {
  const titleSize = useMemo(() => {
    const len = title.length;
    if (len <= 40) return "text-2xl";
    if (len <= 80) return "text-xl";
    return "text-lg";
  }, [title]);

  return (
    <CardHeader className="px-6 pt-5 pb-2">
      <div className="flex items-center gap-2 mb-2">
        <time dateTime={date} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </time>
        <span className="text-xs text-muted-foreground/50">•</span>
        <span className="text-xs text-muted-foreground font-medium">News</span>
      </div>
      <h2 className={cn(titleSize, "font-bold leading-tight text-foreground tracking-tight line-clamp-3")}>
        {title}
      </h2>
    </CardHeader>
  );
});
CardHeaderContent.displayName = "CardHeaderContent";

const CardFooterContent = memo<{
  showBack: boolean;
  onBack?: () => void;
  onInsightsOpen: () => void;
}>(({ showBack, onBack, onInsightsOpen }) => {
  return (
    <CardFooter className="mt-auto pt-4 pb-6 px-6 flex items-center justify-between gap-2 border-t border-border/50 bg-muted/20">
      {showBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground -ml-2"
          aria-label="Go back to previous card"
        >
          <StepBack className="w-4 h-4 mr-1.5" aria-hidden="true" />
          Back
        </Button>
      )}
      <Badge
        variant="outline"
        className="cursor-pointer ml-auto gap-1.5 py-1.5 px-3 hover:bg-accent transition-colors border-primary/20 text-primary"
        onClick={onInsightsOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onInsightsOpen();
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
          aria-hidden="true"
        >
          <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z" />
        </svg>
      </Badge>
    </CardFooter>
  );
});
CardFooterContent.displayName = "CardFooterContent";

const SheetContentInner = memo<{
  title: string;
  content: string;
  date: string;
  image: string;
  url: string;
  query: string; // Deferred query for AIInsight
}>(({ title, content, date, image, url, query }) => {
  const host = useMemo(() => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return "unknown";
    }
  }, [url]);

  return (
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
                const target = e.currentTarget;
                target.src = DEFAULT_IMAGE;
                target.className = "w-16 h-16 opacity-50";
              }}
            />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-foreground">{title}</h1>

          <div className="not-prose flex items-center gap-3 text-sm text-muted-foreground mb-6">
            <time className="font-medium bg-secondary px-2 py-0.5 rounded-md">
              {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </time>
            <span>•</span>
            <span className="font-medium">{host}</span>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground">{content}</p>

          <a
            href={`https://x.com/search?q=${encodeURIComponent(title)}&f=live`}
            target="_blank"
            rel="noopener noreferrer"
            className="not-prose mt-6 mb-6 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium text-sm transition-all"
          >
            <span>See discussion on</span>
            <XIcon className="w-4 h-4" />
          </a>

          <AIInsight query={query} />
        </article>
      </div>
    </FadeIn>
  );
});
SheetContentInner.displayName = "SheetContentInner";

// ---- Main Component ----
export const SwipeCard: FC<SwipeCardProps> = ({
  title,
  content,
  date,
  image = DEFAULT_IMAGE,
  url,
  onSwipe,
  onBack,
  isTop,
  showBack,
}) => {
  // State management with proper discriminated union
  const [cardState, setCardState] = useState<CardState>({ status: "idle" });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Accessibility: unique IDs for ARIA
  const cardId = useId();
  const sheetTitleId = useId();

  // Deferred value to prevent AIInsight re-renders during swipe
  const deferredTitle = useDeferredValue(title);

  // Physics-based motion values. We don't use state for transforms in 2027; that's barbaric.
  const x = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);

  // Spring configurations are now granular for 120Hz displays
  const springX = useSpring(x, SWIPE_CONFIG.SPRING_CONFIG);
  const springScale = useSpring(scale, { stiffness: 400, damping: 40 });
  const springRotate = useSpring(rotate, { stiffness: 300, damping: 25 });

  // Refs for gesture handling
  const cardRef = useRef<HTMLDivElement>(null);

  // Derived styles via CSS variables for GPU acceleration without React re-renders
  useEffect(() => {
    if (!cardRef.current) return;

    const unsubX = springX.on("change", (latest) => {
      cardRef.current!.style.setProperty("--swipe-x", `${latest}px`);
    });
    const unsubScale = springScale.on("change", (latest) => {
      cardRef.current!.style.setProperty("--swipe-scale", String(latest));
    });
    const unsubRotate = springRotate.on("change", (latest) => {
      cardRef.current!.style.setProperty("--swipe-rotate", `${latest}deg`);
    });

    return () => {
      unsubX();
      unsubScale();
      unsubRotate();
    };
  }, [springX, springScale, springRotate]);

  // Gesture handler: Pointer Events + Spring Physics. All other libs are deprecated.
  const handlePointer = useCallback(
    (_: unknown, info: PanInfo) => {
      if (!isTop || cardState.status === "exiting") return;

      const deltaX = info.offset.x;
      const velocity = info.velocity.x;
      const absX = Math.abs(deltaX);
      const screenWidth = window.innerWidth;

      // Directly set motion values for 0ms latency
      x.set(deltaX);
      scale.set(Math.max(0.8, 1 - absX / 1000));
      rotate.set((deltaX / 200) * SWIPE_CONFIG.MAX_ROTATION);

      // Swipe completion detection with velocity curve normalization
      const velocityContribution = Math.min(Math.abs(velocity) / 1000, SWIPE_CONFIG.VELOCITY_THRESHOLD);
      const distanceContribution = absX / (screenWidth * SWIPE_CONFIG.DISTANCE_THRESHOLD_RATIO);

      if (velocityContribution + distanceContribution > SWIPE_CONFIG.VELOCITY_THRESHOLD) {
        const direction = deltaX > 0 ? "right" : "left";

        // Animate exit with hardware-accelerated curve
        setCardState({ status: "exiting", direction });

        const exitDistance = direction === "right" ? screenWidth : -screenWidth;
        animate(x, exitDistance, {
          duration: SWIPE_CONFIG.EXIT_DURATION,
          ease: "easeOut",
          onComplete: () => onSwipe(direction),
        });
      } else if (info.offset.x === 0) {
        // Reset on release without snap-back
        x.set(0);
        scale.set(1);
        rotate.set(0);
      }
    },
    [isTop, cardState.status, x, scale, rotate, onSwipe]
  );

  // Keyboard handling with proper key normalization for non-QWERTY layouts
  useEffect(() => {
    if (!isTop || cardState.status === "exiting") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.getModifierState("Meta") || e.getModifierState("Control");
      const key = e.key.toLowerCase();

      if (isModifier && (key === "arrowleft" || key === "arrowright")) {
        e.preventDefault();
        const direction = key === "arrowleft" ? "left" : "right";
        setCardState({ status: "exiting", direction });
        onSwipe(direction);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTop, cardState.status, onSwipe]);

  // Memoized constants to prevent unnecessary recalculation
  const imageErrorHandler = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.src = DEFAULT_IMAGE;
    target.className = "absolute inset-0 w-full h-full object-cover z-0 opacity-50";
  }, []);

  const insightsQuery = useMemo(() => (isSheetOpen ? deferredTitle : ""), [isSheetOpen, deferredTitle]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-0 w-full h-full touch-none select-none",
        "transition-[transform] duration-100 ease-out"
      )}
      style={{
        // CSS Variables for GPU layer compositing. No inline transforms in 2027.
        "--swipe-x": "0px",
        "--swipe-scale": "1",
        "--swipe-rotate": "0deg",
        transform: cardState.status === "exiting"
          ? `translate3d(var(--swipe-x), 0, 0) scale(var(--swipe-scale)) rotate(var(--swipe-rotate))`
          : "translate3d(var(--swipe-x), 0, 0) scale(var(--swipe-scale)) rotate(var(--swipe-rotate))",
        contain: "layout paint style", // Performance hint for browser
      }}
      onPointerDown={isTop ? handlePointer : undefined}
      onPointerMove={isTop ? handlePointer : undefined}
      onPointerUp={isTop ? handlePointer : undefined}
      role="article"
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${cardId}-description`}
    >
      <Box className="w-full h-full">
        <Card className="w-full h-full max-h-[84svh] overflow-hidden flex flex-col bg-card shadow-xl border-border">
          {/* Image Section: Aspect ratio locked, not arbitrary pixel values */}
          <Box className="relative w-full bg-muted shrink-0 aspect-video">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover z-0"
              onError={imageErrorHandler}
              priority={isTop}
            />
            <div className="absolute top-3 right-3 z-[3]">
              <SourceBadge url={url} />
            </div>
          </Box>

          {/* Content Section: Using gap tokens, not magic spacing */}
          <Stack className="flex-1 overflow-hidden bg-card" gap="sm">
            <CardHeaderContent title={title} date={date} />

            <CardContent
              id={`${cardId}-description`}
              className="flex-grow px-6 py-0 relative overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <p className="text-base leading-relaxed text-muted-foreground">{content}</p>
            </CardContent>

            <CardFooterContent
              showBack={showBack}
              onBack={onBack}
              onInsightsOpen={() => setIsSheetOpen(true)}
            />
          </Stack>
        </Card>
      </Box>

      <Sheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        aria-labelledby={sheetTitleId}
      >
        <SheetTitle id={sheetTitleId} className="sr-only">
          {title} - Full Article & AI Insights
        </SheetTitle>
        <SheetContent
          side="bottom"
          className="h-[calc(92svh-var(--safe-area-top))] sm:h-[calc(94svh-var(--safe-area-top))] pb-safe overflow-y-auto"
        >
          <SheetContentInner
            title={title}
            content={content}
            date={date}
            image={image}
            url={url}
            query={insightsQuery}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};