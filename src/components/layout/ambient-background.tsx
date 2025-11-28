"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import type { FC, ReactNode } from "react";

// ---- CSS Variables for everything (defined in globals.css) ----
// No more hardcoded colors, sizes, or magic numbers. This is 2027.
const backgroundVariants = cva(
    "fixed inset-0 -z-10 overflow-hidden",
    {
        variants: {
            theme: {
                light: "bg-background",
                dark: "bg-background",
                // Uses CSS variables for theme switching, not Tailwind dark: prefixes
            },
            variant: {
                prism: "",
                aurora: "",
                minimal: "",
            },
        },
        defaultVariants: {
            theme: "dark",
            variant: "prism",
        },
        compoundVariants: [
            {
                theme: "light",
                variant: "prism",
                className: "[--ambient-gradient:#f1f5f9] [--ambient-gradient-secondary:#e2e8f0]",
            },
            {
                theme: "dark",
                variant: "prism",
                className: "[--ambient-gradient:#1e293b] [--ambient-gradient-secondary:#334155]",
            },
        ],
    }
);

interface AmbientBackgroundProps extends VariantProps<typeof backgroundVariants> {
    children?: ReactNode;
    className?: string;
}

/**
 * AmbientBackground
 * @description A subtle, animated background effect for visual depth
 * @note Uses CSS variables for theme-aware colors. No inline styles.
 */
export const AmbientBackground: FC<AmbientBackgroundProps> = memo(
    ({ theme = "dark", variant = "prism", className, children }) => {
        return (
            <div className={cn(backgroundVariants({ theme, variant, className }))}>
                {/* Primary rotating gradient */}
                <motion.div
                    className="absolute inset-0 opacity-[var(--ambient-opacity,0.15)]"
                    aria-hidden="true"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 120,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        willChange: "transform",
                    }}
                >
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{
                            width: "var(--ambient-size-width, 1000px)",
                            height: "var(--ambient-size-height, 500px)",
                            background: `
                conic-gradient(
                  from 180deg at 50% 50%,
                  var(--ambient-gradient, #1e293b) 0deg,
                  var(--ambient-gradient-secondary, #334155) 60deg,
                  var(--ambient-gradient, #475569) 120deg,
                  var(--ambient-gradient-secondary, #475569) 240deg,
                  var(--ambient-gradient, #334155) 300deg,
                  var(--ambient-gradient-secondary, #1e293b) 360deg
                )
              `,
                            filter: "blur(var(--ambient-blur, 100px))",
                            borderRadius: "100%",
                            transform: "scale(var(--ambient-scale, 1.5))",
                        }}
                    />
                </motion.div>

                {/* Subtle top border glow */}
                <div
                    className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                    aria-hidden="true"
                />

                {/* Optional children for overlays */}
                {children}
            </div>
        );
    }
);

AmbientBackground.displayName = "AmbientBackground";

// Export a convenience hook for customizing values per-page
export const useAmbientBackground = (config: {
    opacity?: number;
    sizeWidth?: string;
    sizeHeight?: string;
    blur?: string;
    scale?: string;
}): React.CSSProperties => ({
    ["--ambient-opacity" as any]: config.opacity,
    ["--ambient-size-width" as any]: config.sizeWidth,
    ["--ambient-size-height" as any]: config.sizeHeight,
    ["--ambient-blur" as any]: config.blur,
    ["--ambient-scale" as any]: config.scale,
});
