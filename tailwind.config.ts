import type { Config } from "tailwindcss";
import containerQueries from "@tailwindcss/container-queries";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

const config = {
	// ---- Critical: Force class-based dark mode for SSR safety ----
	darkMode: ["class"],

	// ---- Content: Deduplicated and performance-optimized ----
	// In 2027, we don't use wildcards that scan node_modules by accident
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
	],

	// ---- Theme: Design tokens as CSS variables ----
	// No more magic numbers. Everything is a token.
	theme: {
		// ---- Font Family: System stack with fallbacks ----
		fontFamily: {
			sans: [
				"Geist",
				"system-ui",
				"-apple-system",
				"BlinkMacSystemFont",
				"Segoe UI",
				"Roboto",
				"Helvetica Neue",
				"Arial",
				"sans-serif",
			],
			mono: [
				"Menlo",
				"Monaco",
				"Consolas",
				"Liberation Mono",
				"Courier New",
				"monospace",
			],
		},

		// ---- Container Queries: Component-level responsiveness ----
		// This is why we use @sm: syntax in the Grid component
		container: {
			center: true,
			padding: "var(--space-4)",
			screens: {
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1536px",
			},
		},

		// ---- Extend: Add CSS variable-based tokens ----
		extend: {
			// ---- Colors: Shadcn UI tokens (unchanged) ----
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
			},

			// ---- Border Radius: Shadcn tokens (unchanged) ----
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},

			// ---- Spacing: CSS custom properties ----
			// These are consumed by the Grid component via gap-[var(--space-*)]
			spacing: {
				"0": "var(--space-0)",
				"1": "var(--space-1)",
				"2": "var(--space-2)",
				"3": "var(--space-3)",
				"4": "var(--space-4)",
				"5": "var(--space-5)",
				"6": "var(--space-6)",
				"7": "var(--space-7)",
				"8": "var(--space-8)",
				"9": "var(--space-9)",
				"10": "var(--space-10)",
				"11": "var(--space-11)",
				"12": "var(--space-12)",
				"14": "var(--space-14)",
				"16": "var(--space-16)",
			},

			// ---- Layout Utilities: aspect ratios, container types ----
			aspectRatio: {
				auto: "auto",
				square: "1 / 1",
				video: "16 / 9",
				portrait: "3 / 4",
				ultrawide: "21 / 9",
			},
		},
	},

	// ---- Plugins: Container queries are REQUIRED for @sm: syntax ----
	// If you don't install this, the Grid component will throw
	plugins: [
		containerQueries, // https://github.com/tailwindlabs/tailwindcss-container-queries
		typography,
		animate,
	],
} satisfies Config;

export default config;
