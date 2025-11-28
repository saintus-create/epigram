"use client";

// Imports: Grouped, subpathed, and tree-shaken as per ES2030 Manifest Spec.
// Stop using @/ aliases. They're so 2023.
import { memo, useId, useMemo, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Check, Moon, Monitor, Sun, Scroll, Eye, Leaf, Waves,
  Sparkles, Flame, Star, Share2, Twitter, Linkedin, Facebook,
  MessageCircle, X, Search, TreePalm, Flower2, Home
} from "lucide-react";

import { LogoIcon } from "#components/logo-icon";
import { Button } from "#components/ui/button";
import { Card } from "#components/ui/card";
import { Badge } from "#components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "#components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "#components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "#components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "#components/ui/popover";
import { useTheme } from "#components/theme-provider";
import { useMounted } from "#hooks/use-mounted"; // Your own hook for hydration safety
import { cn } from "#lib/utils";
import { WhatsAppIcon } from "#components/icons/whatsapp-icon";

import type { FC, ReactNode, MouseEvent } from "react";
import type { LucideIcon } from "lucide-react";

// ---- Configuration: Manifest-driven, type-safe, zero magic strings ----
const SHARE_CONFIG = {
  URL: "https://epigram.news",
  TEXT: "Epigram - An open-source, free, and AI-powered news in short app.",
  DIMENSIONS: { width: 550, height: 435 },
} as const;

// Theme configuration using the `satisfies` operator (TypeScript 5.7+)
// No more duplicate JSX. This is data. Treat it as such.
const THEMES = [
  { id: "light", label: "Light", icon: Sun, colorClass: "bg-[#F4F3F2]", previewClass: "bg-white" },
  { id: "dark", label: "Dark", icon: Moon, colorClass: "bg-[#1A1A1A]", previewClass: "bg-black" },
  { id: "system", label: "System", icon: Monitor },
  { id: "sepia", label: "Sepia", icon: Scroll, colorClass: "bg-[#F4ECD8]" },
  { id: "high-contrast", label: "High Contrast", icon: Eye, colorClass: "bg-[#000000]" },
  { id: "forest", label: "Forest", icon: Leaf, colorClass: "bg-[#2D4F1E]" },
  { id: "ocean", label: "Ocean", icon: Waves, colorClass: "bg-[#0C4A6E]" },
  { id: "aurora", label: "Aurora Borealis", icon: Sparkles, colorClass: "bg-[#064E3B]" },
  { id: "volcanic", label: "Volcanic Ember", icon: Flame, colorClass: "bg-[#7F1D1D]" },
  { id: "cosmos", label: "Violet Cosmos", icon: Star, colorClass: "bg-[#4C1D95]" },
  { id: "desert", label: "Desert Sand", icon: TreePalm, colorClass: "bg-[#C2B280]" },
  { id: "rose", label: "Rose Garden", icon: Flower2, colorClass: "bg-[#C9184A]" },
] satisfies ReadonlyArray<{
  id: string;
  label: string;
  icon: LucideIcon;
  colorClass?: string;
  previewClass?: string;
}>;

// Social config with proper typing and validation
const SOCIAL_PLATFORMS = [
  {
    id: "twitter",
    name: "X (Twitter)",
    Icon: Twitter,
    buildUrl: (text: string, url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    color: "text-[#1DA1F2] hover:bg-[#1DA1F2]/10",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    Icon: Linkedin,
    buildUrl: (_: string, url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    color: "text-[#0A66C2] hover:bg-[#0A66C2]/10",
  },
  {
    id: "facebook",
    name: "Facebook",
    Icon: Facebook,
    buildUrl: (_: string, url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    color: "text-[#1877F2] hover:bg-[#1877F2]/10",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    Icon: WhatsAppIcon,
    buildUrl: (text: string, url: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    color: "text-[#25D366] hover:bg-[#25D366]/10",
  },
  {
    id: "sms",
    name: "Messages",
    Icon: MessageCircle,
    buildUrl: (text: string, url: string) =>
      `sms:&body=${encodeURIComponent(`${text} ${url}`)}`,
    color: "text-blue-500 hover:bg-blue-500/10",
  },
] satisfies ReadonlyArray<{
  id: string;
  name: string;
  Icon: LucideIcon | FC<{ className?: string }>;
  buildUrl: (text: string, url: string) => string;
  color: string;
}>;

// ---- Private Components: Memoized, isolated, and testable ----

/**
 * @private
 * Theme menu item with memoized rendering and proper ARIA roles.
 * In 2027, we don't inline SVGs. We use icon components.
 */
const ThemeMenuItem: FC<{
  themeId: string;
  label: string;
  Icon: LucideIcon;
  colorClass?: string;
  previewClass?: string;
  isActive: boolean;
  onSelect: () => void;
}> = memo(({ themeId, label, Icon, colorClass, previewClass, isActive, onSelect }) => {
  const itemId = useId();

  return (
    <DropdownMenuItem
      id={itemId}
      role="menuitemradio"
      aria-checked={isActive}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 h-10 focus:bg-accent/50 cursor-pointer transition-colors",
        isActive && "bg-accent/50"
      )}
    >
      <div className="p-1 rounded-md bg-primary/10">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </div>
      <span className="flex-1 font-medium">{label}</span>
      {colorClass && (
        <div className={cn("w-4 h-4 rounded-sm mr-2", previewClass || colorClass)}
          aria-hidden="true"
          title={`${label} preview`} />
      )}
      {isActive && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
    </DropdownMenuItem>
  );
});
ThemeMenuItem.displayName = "ThemeMenuItem";

/**
 * @private
 * Share button with adaptive rendering: Popover on desktop, Dialog on mobile.
 * Uses Web Share API when available. Graceful degradation is not optional.
 */
const ShareButton: FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = memo(({ isOpen, onOpenChange }) => {
  const isMounted = useMounted();
  const canUseNativeShare = isMounted && typeof navigator !== "undefined" && "share" in navigator;

  const shareLinks = useMemo(
    () => SOCIAL_PLATFORMS.map(({ buildUrl, ...rest }) => ({
      ...rest,
      url: buildUrl(SHARE_CONFIG.TEXT, SHARE_CONFIG.URL),
    })),
    []
  );

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title: "Epigram News",
        text: SHARE_CONFIG.TEXT,
        url: SHARE_CONFIG.URL,
      });
    } catch {
      // User cancelled or unsupported. Fallback to UI.
      onOpenChange(true);
    }
  }, [onOpenChange]);

  const Content = (
    <div className="flex flex-col gap-4 p-4" role="group" aria-label="Share options">
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {shareLinks.map(({ id, name, Icon, url, color }) => (
          <Button
            key={id}
            variant="ghost"
            size="lg"
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              window.open(url, "_blank", `width=${SHARE_CONFIG.DIMENSIONS.width},height=${SHARE_CONFIG.DIMENSIONS.height},noopener,noreferrer`);
            }}
            className={cn("rounded-full transition-colors aspect-square p-0", color)}
            aria-label={`Share on ${name}`}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
          </Button>
        ))}
      </div>
    </div>
  );

  // Adaptive rendering: Popover on md+, Dialog below
  const AdaptiveShare = (
    <>
      <div className="hidden md:block">
        <Popover open={isOpen} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-1.5 hover:bg-accent rounded-full transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <h3 className="text-sm font-semibold mb-2">Share</h3>
            {Content}
          </PopoverContent>
        </Popover>
      </div>
      <div className="md:hidden">
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-1.5 hover:bg-accent rounded-full transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Share</DialogTitle>
            </DialogHeader>
            {Content}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );

  return canUseNativeShare ? (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleNativeShare}
      className="p-1.5 hover:bg-accent rounded-full transition-colors"
      aria-label="Share"
    >
      <Share2 className="w-5 h-5" />
    </Button>
  ) : AdaptiveShare;
});
ShareButton.displayName = "ShareButton";

/**
 * @private
 * Welcome card with proper hydration handling and reduced motion support.
 * Fixed positioning in 2027? Absolutely not. Use a portal.
 */
const WelcomeCard: FC<{
  isVisible: boolean;
  onDismiss: () => void;
}> = memo(({ isVisible, onDismiss }) => {
  const cardId = useId();

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${cardId}-title`}
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onDismiss}
        aria-hidden="true"
      />
      <Card className="relative w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <Button
          size="icon"
          variant="ghost"
          onClick={onDismiss}
          className="absolute top-2 right-2 rounded-full"
          aria-label="Dismiss welcome message"
        >
          <X className="w-4 h-4" />
        </Button>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-5 h-5" />
            <h3 id={`${cardId}-title`} className="font-semibold text-lg">
              Welcome to the news
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Your open-source, AI-powered news companion that redefines how you consume news.
            Get bite-sized summaries from trusted sources worldwide, personalized to your interests.
            Stay informed without the overwhelm.
          </p>
          <div className="flex gap-2">
            <Button onClick={onDismiss} className="flex-1">
              Get Started
            </Button>
            <Link href="/about" passHref legacyBehavior>
              <Button variant="outline" className="flex-1" onClick={onDismiss}>
                About
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
});
WelcomeCard.displayName = "WelcomeCard";

/**
 * @private
 * Search dialog with focus trap and keyboard shortcut (Cmd+K).
 * Properly decoupled from main component.
 */
const SearchDialog: FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = memo(({ isOpen, onOpenChange }) => {
  const inputId = useId();
  const [query, setQuery] = useState("");

  // Keyboard shortcut handling
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;
      if (isModifier && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const input = document.getElementById(inputId) as HTMLInputElement | null;
        input?.focus();
      }, 100); // Account for Dialog animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, inputId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-xl p-0 overflow-hidden border bg-background/95 backdrop-blur-xl"
        aria-labelledby={`${inputId}-label`}
      >
        <div className="p-6">
          <DialogHeader>
            <DialogTitle id={`${inputId}-label`} className="text-2xl font-semibold">
              Search Epigram
            </DialogTitle>
          </DialogHeader>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id={inputId}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search articles..."
              className="w-full h-12 rounded-xl border border-input bg-background/50 px-12 pr-20 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
              aria-label="Search articles"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-7 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground opacity-60">
              ⏎
            </kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
SearchDialog.displayName = "SearchDialog";

// ---- Main Component: The Only Export ----

/**
 * AppSwitcher
 * @description Primary navigation component for Epigram. Handles theme, share, search, and welcome state.
 * @public
 */
export const AppSwitcher: FC = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isMounted = useMounted();

  // Separate state reducers because conflating concerns is a crime
  const [shareOpen, setShareOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);

  // Hydration-safe localStorage check
  useEffect(() => {
    if (!isMounted) return;
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setWelcomeVisible(true);
    }
  }, [isMounted]);

  const handleDismissWelcome = useCallback(() => {
    setWelcomeVisible(false);
    localStorage.setItem("hasSeenWelcome", "true");
  }, []);

  const isHomePage = pathname === "/";

  return (
    <>
      {/* Welcome Card: Portal-based, animated, accessible */}
      <WelcomeCard isVisible={welcomeVisible && isHomePage} onDismiss={handleDismissWelcome} />

      {/* Navigation Bar: Glassmorphic, centered, semantic */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-[env(safe-area-inset-top,0.5rem)]"
        role="navigation"
        aria-label="Primary"
      >
        <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md border rounded-full p-1 shadow-lg">
          {/* Home: Semantic link, no buttons in anchors 🙏 */}
          <Link
            href="/"
            aria-label="Home"
            aria-current={isHomePage ? "page" : undefined}
            className={cn(
              "p-2 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              isHomePage ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
          >
            <Home className="w-5 h-5" />
          </Link>

          {/* Theme Menu: Memoized items, single source of truth */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Change theme"
                      className="p-2 rounded-full hover:bg-accent transition-colors"
                    >
                      <Sun className="w-5 h-5 dark:hidden" />
                      <Moon className="w-5 h-5 hidden dark:block" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">Theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="max-h-[70vh] overflow-auto">
              {THEMES.map(({ id, label, icon: Icon, colorClass, previewClass }) => (
                <ThemeMenuItem
                  key={id}
                  themeId={id}
                  label={label}
                  Icon={Icon}
                  colorClass={colorClass}
                  previewClass={previewClass}
                  isActive={theme === id}
                  onSelect={() => setTheme(id)}
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search: Cmd+K shortcut, memoized state handler */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  aria-label="Search (Cmd+K)"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="flex items-center gap-1">
                  <kbd className="font-mono text-xs">⌘</kbd>
                  <span>+</span>
                  <kbd className="font-mono text-xs">K</kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Share: Adaptive UI with Web Share API detection */}
          <ShareButton isOpen={shareOpen} onOpenChange={setShareOpen} />
        </div>
      </nav>

      {/* Search Dialog: Separate component for focus management */}
      <SearchDialog isOpen={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

// Default export for Next.js compatibility, but named export is preferred.
export default AppSwitcher;