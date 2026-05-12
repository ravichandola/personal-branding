import { SITE } from "@/config/site";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://ravi.dev";

export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: siteUrl,
  jobTitle: "Automation Technical Lead — Architecture & GenAI",
  sameAs: [
    SITE.urls.linkedin,
    SITE.urls.medium,
    SITE.urls.githubProfile,
    SITE.urls.githubRepos,
  ],
  knowsAbout: [
    "Sage",
    "Cursor IDE",
    "Test automation architecture",
    "Playwright",
    "TypeScript",
    "Generative AI",
    "LangGraph",
    "Jira",
    "Legal technology",
    "Software engineering",
    "AWS",
  ],
  description: SITE.description,
};
