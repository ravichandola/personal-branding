/** Blog chips + import script share this catalog (slug + label). */

export const BLOG_TOPIC_SLUGS = [
  "gen-ai",
  "react",
  "testing",
  "java",
  "javascript",
  "git",
  "other",
] as const;

export type BlogTopicSlug = (typeof BLOG_TOPIC_SLUGS)[number];

export const BLOG_TOPIC_LABELS: Record<BlogTopicSlug, string> = {
  "gen-ai": "Gen AI",
  react: "React",
  testing: "Testing",
  java: "Java",
  javascript: "JavaScript",
  git: "Git",
  other: "Other",
};

/** Older seed / editorial category slugs → chip topic. */
const LEGACY_CATEGORY_SLUG_TO_TOPIC: Partial<Record<string, BlogTopicSlug>> = {
  "react-surfaces": "react",
  "playwright-labs": "testing",
  "performance-characterization": "testing",
  "langgraph-orchestration": "gen-ai",
  "ai-platforms": "gen-ai",
  "rag-systems": "gen-ai",
  "aws-automation-backbone": "other",
  "architecture-thought-leadership": "other",
};

export function isBlogTopicSlug(s: string): s is BlogTopicSlug {
  return (BLOG_TOPIC_SLUGS as readonly string[]).includes(s);
}

export function topicFromStoredCategorySlug(
  categorySlug: string,
): BlogTopicSlug | null {
  if (isBlogTopicSlug(categorySlug)) return categorySlug;
  return LEGACY_CATEGORY_SLUG_TO_TOPIC[categorySlug] ?? null;
}

/** DB `Category.slug` values that should match a chip topic filter. */
export function storedCategorySlugsMatchingTopic(topic: BlogTopicSlug): string[] {
  const out = new Set<string>([topic]);
  for (const [slug, mapped] of Object.entries(LEGACY_CATEGORY_SLUG_TO_TOPIC)) {
    if (mapped === topic) out.add(slug);
  }
  return [...out];
}

/**
 * Infer primary topic from title + excerpt (and optional plain body snippet).
 * Order: Gen AI → React → Testing → JavaScript → Java → Git → Other.
 */
export function inferBlogTopicSlug(
  title: string,
  excerpt: string,
  bodyPlainSnippet = "",
): BlogTopicSlug {
  const sample = `${title}\n${excerpt}\n${bodyPlainSnippet}`
    .toLowerCase()
    .slice(0, 12_000);

  const genAi =
    /\brag\b|langgraph|langchain|openai|generative ai|\bgenai\b|\bllm\b|evals|chatbot|foundation model|\bai agent|\bagentic\b|anthropic|vector embed|retrieval[- ]augmented|persona.*chatbot|prompt mastery|\btransformer\b|\bgpt\b|multimodal ai/.test(
      sample,
    );
  if (genAi) return "gen-ai";

  const react =
    /\breact\b|next\.js|\btsx\b|\bjsx\b|usestate|useeffect|redux|react native|tailwind.*react|\bvite\b.+react|\bswc\b|reactdom|\bchakra\b|\bmui\b|\bmaterial[\s-]ui\b/.test(
      sample,
    );
  if (react) return "react";

  const testing =
    /\bplaywright\b|\bcypress\b|\bvitest\b|\bjest\b|\bmocha\b|\bcucumber\b|\bselenium\b|webdriver|test\s+automation|\b(?:e2e|end[- ]to[- ]end)\b|\btestng\b|\bjunit\b|\bkarate\b|quality\s+assurance|manual\s+testing|\b(?:ISTQB|tdd|bdd)\b|cypress-io|fixture|test\s+suite|coverage\s+report|\b(?:regression|integration|functional)[\s-]+(?:test|testing)\b/.test(
      sample,
    );
  if (testing) return "testing";

  const javascript =
    /\bjavascript\b|\btypescript\b|node\.js|\bnodejs\b|\bnpm\b|arrow function|\bpnpm\b|\byarn\b|webpack|\bvite\b|\.js\b|esbuild|\btailwindcss\b|docker\s+run/.test(
      sample,
    );
  if (javascript) return "javascript";

  const java =
    /\bjava\b(?!script)|\bjvm\b|\bspring\b|\bmaven\b|\bgradle\b|multithread|thread\s+life|\bjdbc\b|\bhibernate\b/.test(
      sample,
    );
  if (java) return "java";

  const git =
    /\bgit\b|github|gitlab|\bcommits?\b|\bstash\b|merge\s+conflict|\.git\b|\bgit\s+repository|\bpull\s+request\b|pushing\s+code\s+to\s+git|two\s+github\s+accounts/.test(
      sample,
    );
  if (git) return "git";

  return "other";
}

export type MinimalPostCategories = {
  title: string;
  excerpt: string;
  categories: { category: { slug: string } }[];
};

/**
 * Topics a post participates in for /blogs chips:
 * mapped DB categories first; if none mapped, inferred from title + excerpt.
 */
export function effectiveTopicsForPost(p: MinimalPostCategories): BlogTopicSlug[] {
  const fromDb = p.categories
    .map((c) => topicFromStoredCategorySlug(c.category.slug))
    .filter((t): t is BlogTopicSlug => t != null);
  const unique = [...new Set(fromDb)];
  if (unique.length > 0) return unique;
  return [inferBlogTopicSlug(p.title, p.excerpt)];
}

export function blogPostMatchesTopicChip(
  p: MinimalPostCategories,
  topic: BlogTopicSlug | null,
): boolean {
  if (topic == null) return true;
  return effectiveTopicsForPost(p).includes(topic);
}
