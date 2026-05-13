import type { Prisma } from "@/generated/prisma";

export const BLOG_TOPIC_SLUGS = [
  "gen-ai",
  "java",
  "javascript",
  "git",
  "other",
] as const;

export type BlogTopicSlug = (typeof BLOG_TOPIC_SLUGS)[number];

export const BLOGS_PAGE_SIZE = 18;

/** Max length for raw search input; extra trimmed. */
const SEARCH_MAX = 160;
/** Minimum characters before search applies (avoids huge result sets for "a"). */
export const BLOG_SEARCH_MIN_CHARS = 2;
/** Max words (tokens) for instant search on /blogs. */
const SEARCH_MAX_TOKENS = 6;

export type ParsedBlogsListParams = {
  /** Normalized search string (may be empty). */
  q: string;
  /** Active topic filter or null. */
  topic: BlogTopicSlug | null;
  /** 1-based page index, clamped. */
  page: number;
  /** True when `q` had length but was ignored (e.g. single character). */
  searchIgnoredTooShort: boolean;
};

export function parseBlogsListParams(raw: {
  q?: string;
  topic?: string;
  page?: string;
}): ParsedBlogsListParams {
  const rawQ = raw.q?.trim() ?? "";
  const q =
    rawQ.length > SEARCH_MAX ? rawQ.slice(0, SEARCH_MAX).trim() : rawQ;

  const topicParam = raw.topic?.trim().toLowerCase() ?? "";
  const topic = (BLOG_TOPIC_SLUGS as readonly string[]).includes(topicParam)
    ? (topicParam as BlogTopicSlug)
    : null;

  const parsedPage = Number.parseInt(raw.page ?? "1", 10);
  const page = Number.isFinite(parsedPage)
    ? Math.max(1, Math.min(parsedPage, 500))
    : 1;

  const searchIgnoredTooShort =
    q.length > 0 && q.length < BLOG_SEARCH_MIN_CHARS;

  return { q, topic, page, searchIgnoredTooShort };
}

/**
 * Tokens used for full-text search (AND). Empty if query too short or only noise.
 */
export function blogSearchTokens(q: string): string[] {
  if (q.length < BLOG_SEARCH_MIN_CHARS) return [];
  return q
    .split(/\s+/u)
    .map((t) => t.trim())
    .filter((t) => t.length >= BLOG_SEARCH_MIN_CHARS)
    .slice(0, SEARCH_MAX_TOKENS);
}

/**
 * Build Prisma where clause: published, optional topic, optional multi-token search (AND).
 */
export function blogListWhere(
  q: string,
  topic: BlogTopicSlug | null,
): Prisma.BlogPostWhereInput {
  const where: Prisma.BlogPostWhereInput = { published: true };

  if (topic) {
    where.categories = { some: { category: { slug: topic } } };
  }

  const tokens = blogSearchTokens(q);
  if (tokens.length > 0) {
    where.AND = tokens.map((token) => ({
      OR: [
        { title: { contains: token, mode: "insensitive" as const } },
        { excerpt: { contains: token, mode: "insensitive" as const } },
      ],
    }));
  }

  return where;
}

export const blogPostListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  featured: true,
  publishedAt: true,
  readingTimeMinutes: true,
  canonicalUrl: true,
  categories: {
    select: {
      category: { select: { slug: true, name: true } },
    },
  },
} satisfies Prisma.BlogPostSelect;

export type BlogPostListRow = Prisma.BlogPostGetPayload<{
  select: typeof blogPostListSelect;
}>;

/** Tokens for live client filter (any length ≥1; space-separated AND). */
export function blogInstantSearchTokens(q: string): string[] {
  const t = q.trim();
  if (!t) return [];
  return t
    .split(/\s+/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, SEARCH_MAX_TOKENS);
}

/** Client-side match: topic (any category) + word AND across title/excerpt (substring, case-insensitive). */
export function blogPostMatchesFilters(
  post: BlogPostListRow,
  q: string,
  topic: BlogTopicSlug | null,
): boolean {
  if (topic) {
    const ok = post.categories.some((c) => c.category.slug === topic);
    if (!ok) return false;
  }
  const tokens = blogInstantSearchTokens(q);
  if (tokens.length === 0) return true;
  const title = post.title.toLowerCase();
  const excerpt = post.excerpt.toLowerCase();
  return tokens.every(
    (tok) =>
      title.includes(tok.toLowerCase()) || excerpt.includes(tok.toLowerCase()),
  );
}
