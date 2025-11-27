import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { IOSHandler } from "@/components/ios-handler";
import { ShadcnBackground } from "@/components/shadcn-background";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f7f7f7"
};

export const metadata: Metadata = {
  title: "News Feed",
  description: "A sleek, AI-powered news feed delivering concise updates for busy readers.",
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.BASE_URL || 'https://epigram.news'),
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "News Feed",
  },
  openGraph: {
    title: "News Feed",
    description: "A sleek, AI-powered news feed delivering concise updates for busy readers.",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "News Feed",
    description: "A sleek, AI-powered news feed delivering concise updates for busy readers.",
    images: [],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icons/192x192_1.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/512x512_1.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/192x192_1.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/512x512_1.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-startup-image" href="/splash.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/192x192_1.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/512x512_1.png" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <IOSHandler />
          <ShadcnBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
