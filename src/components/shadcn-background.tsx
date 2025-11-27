"use client";

import { cn } from "@/lib/utils";

export function ShadcnBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background">
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(to right, #8882 1px, transparent 1px), linear-gradient(to bottom, #8882 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
        }}
      />

      {/* "Prism" Glow - Spectral Gradient */}
      <div 
        className="absolute top-[-10%] left-[50%] w-[1000px] h-[500px] -translate-x-1/2 opacity-20 dark:opacity-30"
        style={{
          background: `
            conic-gradient(from 180deg at 50% 50%, 
              #ff0080 0deg, 
              #7928ca 60deg, 
              #4299e1 120deg, 
              #4299e1 240deg, 
              #7928ca 300deg, 
              #ff0080 360deg
            )
          `,
          filter: 'blur(80px)',
          borderRadius: '100%',
          transform: 'translateY(-50%) scale(1.5)',
        }}
      />

      {/* Secondary Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
}
