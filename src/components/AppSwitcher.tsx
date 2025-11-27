'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Check, Moon, Monitor, Sun, Scroll, Eye, Leaf, Waves,
  Sparkles, Flame, Star,

  Share2,
  Twitter, Linkedin, Facebook, MessageCircle,
  X, Search,
  TreePalm,
  Flower2,
  Home
} from 'lucide-react';
import { LogoIcon } from '@/components/logo-icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SHARE_URL = 'https://epigram.news';
const SHARE_TEXT = "Epigram - An open-source, free, and AI-powered news in short app.";

const SOCIAL_CONFIGS = [
  {
    name: 'X (Twitter)',
    icon: <Twitter className="w-5 h-5" />,
    urlTemplate: (text: string, url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    color: 'hover:bg-[#1DA1F2]/10 group-hover:text-[#1DA1F2]'
  },
  {
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    urlTemplate: (_: string, url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    color: 'hover:bg-[#0A66C2]/10 group-hover:text-[#0A66C2]'
  },
  {
    name: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
    urlTemplate: (_: string, url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    color: 'hover:bg-[#1877F2]/10 group-hover:text-[#1877F2]'
  },
  {
    name: 'WhatsApp',
    icon: <WhatsAppIcon className="w-5 h-5" />,
    urlTemplate: (text: string, url: string) =>
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    color: 'hover:bg-[#25D366]/10 group-hover:text-[#25D366]'
  },
  {
    name: 'Messages',
    icon: <MessageCircle className="w-5 h-5" />,
    urlTemplate: (text: string, url: string) =>
      `sms:&body=${encodeURIComponent(text + ' ' + url)}`,
    color: 'hover:bg-blue-500/10 group-hover:text-blue-500'
  }
] as const;

const AppSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isHomePage = pathname === '/';


  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the welcome card before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const shareLinks = useMemo(() =>
    SOCIAL_CONFIGS.map(config => ({
      ...config,
      url: config.urlTemplate(SHARE_TEXT, SHARE_URL)
    })),
    []
  );

  return (
    <>
      {showWelcome && isHomePage && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10"
            onClick={dismissWelcome}
            aria-hidden="true"
          />
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 w-full max-w-[400px] px-4">
            <div className="animate-in fade-in duration-300 slide-in-from-bottom">
              <Card className="relative p-4 shadow-lg">
                <button
                  onClick={dismissWelcome}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Dismiss welcome message"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <LogoIcon className="w-5 h-5" />
                    <h3 className="font-semibold">Welcome to the news</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your open-source, AI-powered news companion that redefines
                    how you consume news. Get bite-sized summaries from trusted
                    sources worldwide, personalized to your interests. Stay
                    informed without the overwhelm.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={dismissWelcome}
                      className="flex-1 py-1 px-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
                    >
                      Get Started
                    </button>
                    <Link href="/about">
                      <button
                        onClick={dismissWelcome}
                        className="flex-1 py-1 px-3 bg-secondary text-secondary-foreground rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                      >
                        About Epigram
                      </button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
        <nav
          className="bg-transparent"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-6">



            {/* Home button */}
            <Link href="/">
              <button
                className={cn(
                  "p-1.5 rounded-full transition-colors flex items-center",
                  isHomePage && "bg-primary text-primary-foreground",
                  !isHomePage && "hover:bg-gray-100 dark:hover:bg-muted"
                )}
                aria-label="Home"
                aria-current={isHomePage ? "page" : undefined}
              >
                <Home className="w-5 h-5" />
              </button>
            </Link>


            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-muted rounded-full transition-colors"
                        aria-label="Change theme"
                      >
                        <Sun className="w-5 h-5 dark:hidden" />
                        <Moon className="w-5 h-5 hidden dark:block" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56"
                      role="menu"
                      aria-label="Theme options"
                    >
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-3 h-10 focus:bg-accent/50 cursor-pointer transition-colors",
                          theme === "light" && "bg-accent/50"
                        )}
                        onClick={() => setTheme("light")}
                        role="menuitemradio"
                        aria-checked={theme === "light"}
                      >
                        <div className="p-1 rounded-md bg-primary/10">
                          <Sun className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <span className="flex-1 font-medium">Light</span>
                        {theme === "light" && (
                          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-3 h-10 focus:bg-accent/50 cursor-pointer transition-colors",
                          theme === "dark" && "bg-accent/50"
                        )}
                        onClick={() => setTheme("dark")}
                        role="menuitemradio"
                        aria-checked={theme === "dark"}
                      >
                        <div className="p-1 rounded-md bg-primary/10">
                          <Moon className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <span className="flex-1 font-medium">Dark</span>
                        {theme === "dark" && (
                          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center gap-3 h-10 focus:bg-accent/50 cursor-pointer transition-colors",
                          theme === "system" && "bg-accent/50"
                        )}
                        onClick={() => setTheme("system")}
                        role="menuitemradio"
                        aria-checked={theme === "system"}
                      >
                        <div className="p-1 rounded-md bg-primary/10">
                          <Monitor className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <span className="flex-1 font-medium">System</span>
                        {theme === "system" && (
                          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <div className="h-px bg-border my-1" />
                      <DropdownMenuItem
                        className={cn(
                          "h-9 focus:bg-accent cursor-pointer",
                          theme === "sepia" && "bg-accent"
                        )}
                        onClick={() => setTheme("sepia")}
                        role="menuitemradio"
                        aria-checked={theme === "sepia"}
                      >
                        <Scroll className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span className="flex-1">Sepia</span>
                        <div className="w-4 h-4 rounded-sm mr-2 bg-[#F4ECD8]" />
                        {theme === "sepia" && (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "h-9 focus:bg-accent cursor-pointer",
                          theme === "high-contrast" && "bg-accent"
                        )}
                        onClick={() => setTheme("high-contrast")}
                        role="menuitemradio"
                        aria-checked={theme === "high-contrast"}
                      >
                        <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span className="flex-1">High Contrast</span>
                        <div className="w-4 h-4 rounded-sm mr-2 bg-[#000000]" />
                        {theme === "high-contrast" && (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "h-9 focus:bg-accent cursor-pointer",
                          theme === "forest" && "bg-accent"
                        )}
                        onClick={() => setTheme("forest")}
                        role="menuitemradio"
                        aria-checked={theme === "forest"}
                      >
                        <Leaf className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span className="flex-1">Forest</span>
                        <div className="w-4 h-4 rounded-sm mr-2 bg-[#2D4F1E]" />
                        {theme === "forest" && (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "h-9 focus:bg-accent cursor-pointer",
                          theme === "ocean" && "bg-accent"
                        )}
                        onClick={() => setTheme("ocean")}
                        role="menuitemradio"
                        aria-checked={theme === "ocean"}
                      >
                        <Waves className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span className="flex-1">Ocean</span>
                        <div className="w-4 h-4 rounded-sm mr-2 bg-[#0C4A6E]" />
                        {theme === "ocean" && (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "h-9 focus:bg-accent cursor-pointer",
                          theme === "aurora" && "bg-accent"
                        )}
                        onClick={() => setTheme("aurora")}
                        role="menuitemradio"
                        aria-checked={theme === "aurora"}
                      >
                        <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span className="flex-1">Aurora Borealis</span>
                        <div className="w-4 h-4 rounded-sm mr-2 bg-[#064E3B]" />
                        {theme === "aurora" && (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "h-9 focus:bg-accent cursor-pointer",
                          theme === "volcanic" && "bg-accent"
                        )}
                        onClick={() => setTheme("volcanic")}
                        role="menuitemradio"
                        aria-checked={theme === "volcanic"}
                      >
                        <Flame className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span className="flex-1">Volcanic Ember</span>
                        <div className="w-4 h-4 rounded-sm mr-2 bg-[#7F1D1D]" />
                        {theme === "volcanic" && (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "h-9 focus:bg-accent cursor-pointer",
                          theme === "cosmos" && "bg-accent"
                        )}
                        onClick={() => setTheme("cosmos")}
                        role="menuitemradio"
                        aria-checked={theme === "cosmos"}
                      >
                        <Star className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span className="flex-1">Violet Cosmos</span>
                        <div className="w-4 h-4 rounded-sm mr-2 bg-[#4C1D95]" />
                        {theme === "cosmos" && (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "h-9 focus:bg-accent cursor-pointer",
                          theme === "desert" && "bg-accent"
                        )}
                        onClick={() => setTheme("desert")}
                        role="menuitemradio"
                        aria-checked={theme === "desert"}
                      >
                        <TreePalm className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span className="flex-1">Desert Sand</span>
                        <div className="w-4 h-4 rounded-sm mr-2 bg-[#C2B280]" />
                        {theme === "desert" && (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "h-9 focus:bg-accent cursor-pointer",
                          theme === "rose" && "bg-accent"
                        )}
                        onClick={() => setTheme("rose")}
                        role="menuitemradio"
                        aria-checked={theme === "rose"}
                      >
                        <Flower2 className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span className="flex-1">Rose Garden</span>
                        <div className="w-4 h-4 rounded-sm mr-2 bg-[#C9184A]" />
                        {theme === "rose" && (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent side="top">Theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-muted rounded-full transition-colors"
                    onClick={() => setIsShareOpen(true)}
                    aria-label="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </nav>
      </div>

      <Drawer open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DrawerContent>
          <div className="mx-auto max-w-lg w-full">
            <DrawerHeader>
              <DrawerTitle className="text-center">Share</DrawerTitle>
              <DrawerDescription className="text-center">
                Share with your friends and colleagues
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex justify-center gap-4 p-4">
              {shareLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(link.url, "_blank", "width=550,height=435");
                  }}
                  className={cn("rounded-full transition-colors", link.color)}
                  aria-label={link.name}
                >
                  {typeof link.icon === "string" ? (
                    <span className="text-2xl">{link.icon}</span>
                  ) : (
                    link.icon
                  )}
                </Button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px] left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] -mt-24 w-[calc(100%-2rem)] p-0 bg-background/80 backdrop-blur-xl border shadow-lg rounded-xl overflow-hidden absolute">
          <div className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight">
                Search Epigram
              </DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Type to search articles..."
                className="w-full h-12 rounded-xl border border-input bg-background/50 px-12 pr-20 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-7 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground opacity-60">
                ⏎
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppSwitcher; 