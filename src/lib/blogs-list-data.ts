import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  blogPostListSelect,
  type BlogPostListRow,
} from "@/lib/blogs-list";

/** Invalidate via `revalidateTag(BLOGS_LIST_CACHE_TAG)` when posts change. */
export const BLOGS_LIST_CACHE_TAG = "blogs-list";

function normalizeBlogListRows(posts: BlogPostListRow[]): BlogPostListRow[] {
  return posts.map((p) => ({
    ...p,
    publishedAt:
      p.publishedAt == null
        ? null
        : p.publishedAt instanceof Date
          ? p.publishedAt
          : new Date(p.publishedAt as string),
  }));
}

/**
 * All published posts for /blogs (card fields only). Used for instant client-side search/filter.
 * Cache invalidates on admin blog mutations via `revalidateTag(BLOGS_LIST_CACHE_TAG)`.
 */
export async function getAllPublishedBlogCards(): Promise<BlogPostListRow[]> {
  const fetcher = unstable_cache(
    async () => {
      return prisma.blogPost.findMany({
        where: { published: true },
        select: blogPostListSelect,
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      });
    },
    ["blogs-all-cards", "v1"],
    {
      revalidate: 300,
      tags: [BLOGS_LIST_CACHE_TAG],
    },
  );
  return normalizeBlogListRows(await fetcher());
}
