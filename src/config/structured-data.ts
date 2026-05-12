import { SITE } from "@/config/site";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://ravi.dev";

export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: siteUrl,
  jobTitle: "Automation Architect & AI Engineer",
  sameAs: [
    SITE.urls.linkedin,
    SITE.urls.medium,
    SITE.urls.githubProfile,
    SITE.urls.githubRepos,
  ],
  knowsAbout: [
    "Playwright",
    "LangGraph",
    "Agentic AI",
    "Test Automation Architecture",
    "RAG Systems",
    "AWS",
  ],
  description: SITE.description,
};
