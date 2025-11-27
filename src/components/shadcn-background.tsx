"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ShadcnBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-black">


      {/* "Prism" Glow - Spectral Gradient */}
      <motion.div
        className="absolute top-[-10%] left-[50%] w-[1000px] h-[500px] -translate-x-1/2 opacity-20 dark:opacity-30"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `
            conic-gradient(from 180deg at 50% 50%, 
              #1e293b 0deg, 
              #334155 60deg, 
              #475569 120deg, 
              #475569 240deg, 
              #334155 300deg, 
              #1e293b 360deg
            )
          `,
          filter: 'blur(100px)',
          borderRadius: '100%',
          y: "-50%",
          scale: 1.5,
          opacity: 0.15,
        }}
      />

      {/* Secondary Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
}
