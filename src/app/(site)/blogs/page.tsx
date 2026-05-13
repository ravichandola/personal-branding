import { BlogsPageClient } from "@/features/blog/blogs-page-client";
import { getAllPublishedBlogCards } from "@/lib/blogs-list-data";
import { parseBlogsListParams } from "@/lib/blogs-list";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; topic?: string; page?: string }>;
}) {
  const raw = await searchParams;
  const parsed = parseBlogsListParams(raw);
  const allPosts = await getAllPublishedBlogCards();

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 max-w-4xl bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(26,137,23,0.14),transparent_65%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(26,137,23,0.12),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-3xl space-y-10">
        <BlogsPageClient
          initialQ={parsed.q}
          initialTopic={parsed.topic}
          initialPage={parsed.searchIgnoredTooShort ? 1 : parsed.page}
          allPosts={allPosts}
        />
      </div>
    </div>
  );
}

/** Cached payload for all cards; tag revalidated from admin. */
export const revalidate = 300;
