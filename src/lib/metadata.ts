import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export function createMetadata({
  title,
  description,
  path,
  images,
}: {
  title?: string;
  description?: string;
  path?: string;
  images?: string[];
}): Metadata {
  const fullTitle =
    title == null ? "Ravi Chandola • Automation Technical Lead" : `${title} • Ravi`;

  const canonical = `${siteUrl}${path ?? ""}`;

  return {
    title: fullTitle,
    description:
      description ??
      "Test architecture, GenAI with guardrails (LangGraph), and Playwright/TypeScript delivery — legal tech, enterprise QA, and public-sector scale.",

    metadataBase: new URL(siteUrl),

    alternates: { canonical },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      siteName: "Ravi Chandola",
      locale: "en_US",
      type: "website",
      url: canonical,
      title: fullTitle,
      description:
        description ??
        "Automation Architect • AI Engineer • Playwright Expert • LangGraph Developer",
      ...(images?.length ? { images } : {}),
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description:
        description ??
        "Automation Architect • AI Engineer • LangGraph Developer",
      ...(images?.[0]
        ? { images: [{ url: images[0], width: 1200, height: 630 }] }
        : {}),
    },
    category: "technology",
    applicationName: "Ravi Chandola Platform",
    authors: [{ name: "Ravi Chandola", url: siteUrl }],
  };
}

export const siteOpenGraphFallback = `${siteUrl}/og.svg`;
