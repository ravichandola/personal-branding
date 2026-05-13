import type { Metadata } from "next";

import type { ReactNode } from "react";

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

export const metadata: Metadata = createMetadata({
  path: "/",
  title: "Architecture · GenAI · Legal tech",
  description: SITE.description,
});

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
