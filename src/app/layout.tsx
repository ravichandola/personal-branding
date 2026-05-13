import type { Metadata } from "next";

import type { ReactNode } from "react";

import { headers } from "next/headers";

import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";

import { SpeedInsights } from "@vercel/speed-insights/next";

import { JsonLd } from "@/components/seo/json-ld";

import { AppProviders } from "@/providers/app-providers";

import { personStructuredData } from "@/config/structured-data";

import { SITE } from "@/config/site";

import { createMetadata } from "@/lib/metadata";

import "./globals.css";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans-variable",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-variable",
  display: "swap",
});

/** Resolve icons/canonical against the actual request host (fixes dev on non-default ports like :3001). */
export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const metadataBase = new URL(`${proto}://${host}`);

  return {
    ...createMetadata({
      path: "/",
      title: "Ravi Chandola",
      description: SITE.description,
    }),
    metadataBase,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "1024x1024" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "1024x1024" }],
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${space.variable} ${mono.variable} min-h-dvh font-sans antialiased`}
      >
        <JsonLd data={personStructuredData} />

        <AppProviders>{children}</AppProviders>

        <Analytics />

        <SpeedInsights />
      </body>
    </html>
  );
}
