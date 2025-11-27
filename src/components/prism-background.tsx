"use client";

import { useEffect, useRef } from "react";

export function PrismBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050505]">
      {/* Deep Space Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />

      {/* Prism Gradients */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(255, 0, 128, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(66, 153, 225, 0.25) 0%, transparent 50%)
          `,
          filter: 'blur(60px)',
        }}
      />

      {/* Refraction Lines / Facets */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%),
            linear-gradient(245deg, transparent 40%, rgba(255,255,255,0.05) 45%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Animated Light Beam */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_40s_linear_infinite] opacity-30">
          <div className="absolute top-1/2 left-1/2 w-[100%] h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
        </div>
      </div>

      {/* Noise Grain for Texture */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
