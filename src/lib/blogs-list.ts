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
const SEARCH_MIN = 2;
/** Max words (tokens) processed from the query. */
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
    q.length > 0 && q.length < SEARCH_MIN;

  return { q, topic, page, searchIgnoredTooShort };
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

  if (q.length >= SEARCH_MIN) {
    const tokens = q
      .split(/\s+/u)
      .map((t) => t.trim())
      .filter((t) => t.length >= SEARCH_MIN)
      .slice(0, SEARCH_MAX_TOKENS);

    if (tokens.length > 0) {
      where.AND = tokens.map((token) => ({
        OR: [
          { title: { contains: token, mode: "insensitive" as const } },
          { excerpt: { contains: token, mode: "insensitive" as const } },
        ],
      }));
    }
  }

  return where;
}

/** Fields loaded for /blogs cards only — never `content`. */
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
    take: 1,
    select: {
      category: { select: { slug: true, name: true } },
    },
  },
} satisfies Prisma.BlogPostSelect;

export type BlogPostListRow = Prisma.BlogPostGetPayload<{
  select: typeof blogPostListSelect;
}>;
