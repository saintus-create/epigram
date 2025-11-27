"use client";

import { SwipeCard } from "@/components/swipe-card";
import { useState, useEffect } from "react";
import AppSwitcher from "@/components/AppSwitcher";
import { NewsArticle } from "@/types/newsArticle";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function NewsFeed({ newsArticles }: { newsArticles: NewsArticle[] }) {
  const [cards, setCards] = useState(newsArticles);
  const [dismissedCards, setDismissedCards] = useState<NewsArticle[]>([]);
  const [showTip, setShowTip] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const hasSeenTip = localStorage.getItem('hasSeenSwipeTip');
    if (!hasSeenTip) {
      setShowTip(true);
      localStorage.setItem('hasSeenSwipeTip', 'true');
    }
  }, []);

  const handleSwipe = (id: string) => {
    const dismissedCard = cards.find(card => card.id === id);
    setCards((cards) => cards.filter((card) => card.id !== id));
    if (dismissedCard) {
      setDismissedCards(prev => [dismissedCard, ...prev]);
    }
    // Start fade out animation
    setIsFading(true);
    // Hide tip after fade animation completes
    setTimeout(() => {
      setShowTip(false);
      localStorage.setItem('hasSeenSwipeTip', 'true');
    }, 500);
  };

  const handleUndo = () => {
    if (dismissedCards.length > 0) {
      const [lastDismissed, ...remainingDismissed] = dismissedCards;
      setDismissedCards(remainingDismissed);
      setCards(prev => [lastDismissed, ...prev]);
    }
  };

  return (
    <>
      <div className="fixed inset-0 pt-24 pb-10 px-4">
        <div className="relative w-full max-w-[400px] mx-auto h-full perspective-1000">
          {/* Swipe tip */}
          {showTip && cards.length > 0 && (
            <div className={cn(
              "absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
              "text-foreground px-5 py-3 rounded-xl",
              "flex flex-col items-center gap-1.5",
              "shadow-lg ring-1 ring-foreground/10",
              "transition-all duration-500",
              "animate-[float_8s_ease-in-out_infinite]",
              "bg-background/40 backdrop-blur-xl",
              isFading && "opacity-0"
            )}>
              <div className="animate-[float-slow_32s_linear_infinite] icon-container flex items-center justify-center">
                <ArrowLeftRight className="w-7 h-7 text-foreground/70" />
              </div>
              <span className="text-sm text-center font-medium text-foreground/90">Swipe cards to explore</span>
              <style jsx global>{`
                @keyframes float {
                  0% { transform: translate(calc(-50% - 4px), -50%); }
                  50% { transform: translate(calc(-50% + 4px), -50%); }
                  100% { transform: translate(calc(-50% - 4px), -50%); }
                }
                @keyframes float-slow {
                  0% { transform: translateX(-12px); }
                  50% { transform: translateX(12px); }
                  100% { transform: translateX(-12px); }
                }
              `}</style>
            </div>
          )}

          {cards.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-6 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">You have caught up with all news for now.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {cards.slice(0, 3).map((card, index) => (
                <motion.div
                  key={card.id}
                  className="absolute inset-0"
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{
                    scale: 1 - index * 0.05,
                    y: index * 15,
                    zIndex: 3 - index,
                    opacity: 1 - index * 0.2,
                  }}
                  exit={{
                    x: -300,
                    opacity: 0,
                    rotate: -20,
                    transition: { duration: 0.4, ease: "easeInOut" }
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    width: `${100 - (index * 5)}%`,
                    margin: '0 auto',
                    left: 0,
                    right: 0,
                  }}
                >
                  <SwipeCard
                    title={card.title}
                    content={card.summary}
                    date={card.publishedDate}
                    image={card.image}
                    favicon={card.favicon}
                    url={card.url}
                    isTop={index === 0}
                    onSwipe={() => handleSwipe(card.id)}
                    onBack={handleUndo}
                    showBack={index === 0 && dismissedCards.length > 0}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <AppSwitcher />
    </>
  );
}
