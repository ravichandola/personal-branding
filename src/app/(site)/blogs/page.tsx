import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Library,
  Search,
  Sparkles,
} from "lucide-react";

import { PageIntro } from "@/components/marketing/page-intro";
import { Button } from "@/components/ui/button";
import { isMediumArticleUrl } from "@/lib/external-content";
import { prisma } from "@/lib/prisma";
import {
  BLOGS_PAGE_SIZE,
  type BlogTopicSlug,
  blogListWhere,
  blogPostListSelect,
  parseBlogsListParams,
} from "@/lib/blogs-list";

function blogsListHref(opts: {
  q: string;
  topic: BlogTopicSlug | null;
  page?: number;
}): string {
  const p = new URLSearchParams();
  if (opts.q) p.set("q", opts.q);
  if (opts.topic) p.set("topic", opts.topic);
  if (opts.page && opts.page > 1) p.set("page", String(opts.page));
  const s = p.toString();
  return s ? `/blogs?${s}` : "/blogs";
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; topic?: string; page?: string }>;
}) {
  const raw = await searchParams;
  const { q, topic, page, searchIgnoredTooShort } =
    parseBlogsListParams(raw);
  const where = blogListWhere(q, topic);

  const total = await prisma.blogPost.count({ where }).catch(() => 0);
  const totalPages = Math.max(1, Math.ceil(total / BLOGS_PAGE_SIZE));
  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const skip = (pageSafe - 1) * BLOGS_PAGE_SIZE;

  const posts = await prisma.blogPost
      .findMany({
        where,
        select: blogPostListSelect,
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        skip,
        take: BLOGS_PAGE_SIZE,
      })
    .catch(() => []);

  const hasPrev = pageSafe > 1;
  const hasNext = pageSafe < totalPages;

  const filtersActive = topic !== null || q.length >= 2;
  const topicLabels: Record<BlogTopicSlug, string> = {
    "gen-ai": "Gen AI",
    java: "Java",
    javascript: "JavaScript",
    git: "Git",
    other: "Other",
  };

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 max-w-4xl bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(26,137,23,0.14),transparent_65%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(26,137,23,0.12),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-3xl space-y-10">
        <PageIntro
          eyebrow="Writing"
          title="Essays & notes"
          description="Editorial-style layout: calm type, clear hierarchy, and Medium pieces one click away—without leaving the rhythm of this site."
        >
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/60 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300">
              <Library className="size-3.5 opacity-70" aria-hidden />
              {filtersActive || page > 1
                ? `${total} result${total === 1 ? "" : "s"}`
                : `${total} article${total === 1 ? "" : "s"}`}
              {totalPages > 1 ? (
                <span className="text-zinc-500 dark:text-zinc-500">
                  · Page {pageSafe}/{totalPages}
                </span>
              ) : null}
            </span>
            {filtersActive || pageSafe > 1 ? (
              <Link
                href="/blogs"
                prefetch={false}
                className="text-xs font-medium text-orange-700 underline-offset-4 hover:underline dark:text-orange-400"
              >
                Clear filters
              </Link>
            ) : null}
          </div>
        </PageIntro>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { slug: null, label: "All" },
              { slug: "gen-ai", label: "Gen AI" },
              { slug: "java", label: "Java" },
              { slug: "javascript", label: "JavaScript" },
              { slug: "git", label: "Git" },
              { slug: "other", label: "Other" },
            ] as const
          ).map(({ slug, label }) => {
            const active =
              topic === slug || (slug === null && topic === null);
            const topicChanges =
              (slug ?? null) !== (topic ?? null);
            const href = blogsListHref({
              q,
              topic: slug ?? null,
              page: topicChanges ? 1 : pageSafe,
            });
            return (
              <Link
                key={label}
                href={href}
                prefetch={false}
                scroll={false}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98] ${
                  active
                    ? "border-[#1a8917]/50 bg-[#1a8917]/15 text-[#166534] dark:text-[#bbf7d0]"
                    : "border-zinc-200/90 bg-white/70 text-zinc-600 hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-400 dark:hover:border-white/20"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <form
          action="/blogs"
          method="get"
          className="fm-surface flex flex-col gap-2 rounded-2xl p-2 shadow-sm sm:flex-row sm:items-stretch"
        >
          {topic ? <input type="hidden" name="topic" value={topic} /> : null}
          <label className="relative min-h-11 flex-1">
            <span className="sr-only">Search articles</span>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
              aria-hidden
            />
            <input
              className="h-11 w-full rounded-xl border border-transparent bg-zinc-50/90 py-2 pl-10 pr-3 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-orange-500/35 focus:bg-white dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-orange-400/30 dark:focus:bg-zinc-950/80"
              defaultValue={raw.q?.trim() ?? ""}
              name="q"
              placeholder="Search titles & excerpts (2+ chars, words combine with AND)…"
              autoComplete="off"
              maxLength={200}
              enterKeyHint="search"
            />
          </label>
          <Button
            type="submit"
            variant="primary"
            className="h-11 shrink-0 rounded-xl px-6 sm:w-auto"
          >
            Search
          </Button>
        </form>

        {searchIgnoredTooShort ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Searches shorter than 2 characters are ignored so the list stays
            fast—type a few letters or a phrase (each word narrows results).
          </p>
        ) : null}

        {posts.length === 0 ? (
          <div className="fm-surface rounded-2xl px-8 py-16 text-center">
            <p className="font-serif text-xl text-zinc-800 dark:text-zinc-200">
              {filtersActive
                ? "No articles match these filters."
                : "No published articles yet."}
            </p>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              {filtersActive ? (
                <>
                  Try different keywords
                  {topic ? ` or another topic (currently ${topicLabels[topic]})` : ""}
                  , or{" "}
                  <Link
                    href="/blogs"
                    prefetch={false}
                    className="font-medium text-orange-700 underline-offset-4 hover:underline dark:text-orange-400"
                  >
                    reset filters
                  </Link>
                  .
                </>
              ) : (
                <>
                  Add posts via{" "}
                  <code className="rounded bg-zinc-100 px-1 text-[13px] dark:bg-zinc-800">
                    db:import-medium-export
                  </code>{" "}
                  or the admin blog console.
                </>
              )}
            </p>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-5">
              {posts.map((post) => {
                const onMedium =
                  !!post.canonicalUrl && isMediumArticleUrl(post.canonicalUrl);
                return (
                  <li key={post.id}>
                    <Link
                      href={`/blogs/${post.slug}`}
                      prefetch={false}
                      className="group relative block overflow-hidden rounded-2xl border border-zinc-200/90 bg-gradient-to-br from-white/95 via-white/88 to-zinc-50/90 p-6 shadow-[0_20px_50px_-28px_rgba(24,24,27,0.25)] transition duration-300 hover:-translate-y-0.5 hover:border-[#1a8917]/35 hover:shadow-[0_28px_60px_-24px_rgba(26,137,23,0.18)] dark:border-white/[0.09] dark:from-zinc-950/90 dark:via-zinc-950/75 dark:to-emerald-950/20 dark:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.65)] dark:hover:border-[#1a8917]/40"
                    >
                      <div
                        aria-hidden
                        className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#1a8917]/[0.07] blur-2xl transition duration-500 group-hover:bg-[#1a8917]/[0.12] dark:bg-[#1a8917]/10 dark:group-hover:bg-[#1a8917]/16"
                      />

                      <div className="relative flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {post.featured ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200/95">
                              <Sparkles className="size-3 opacity-80" aria-hidden />
                              Featured
                            </span>
                          ) : null}
                          {onMedium ? (
                            <span className="inline-flex items-center rounded-full border border-[#1a8917]/40 bg-[#1a8917]/10 px-2.5 py-0.5 font-semibold uppercase tracking-wide text-[#166534] dark:text-[#86efac]">
                              Medium
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100/80 px-2.5 py-0.5 font-semibold uppercase tracking-wide text-zinc-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                              On site
                            </span>
                          )}
                          {post.categories[0]?.category ? (
                            <span className="inline-flex items-center rounded-full border border-orange-500/25 bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.06em] text-orange-800 dark:text-orange-200/95">
                              {post.categories[0].category.name}
                            </span>
                          ) : null}
                          {post.publishedAt ? (
                            <span className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500">
                              <Calendar className="size-3.5 opacity-70" aria-hidden />
                              <time dateTime={post.publishedAt.toISOString()}>
                                {post.publishedAt.toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </time>
                            </span>
                          ) : null}
                          {post.readingTimeMinutes != null ? (
                            <span className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500">
                              <Clock className="size-3.5 opacity-70" aria-hidden />
                              <span className="normal-case">
                                {post.readingTimeMinutes} min read
                              </span>
                            </span>
                          ) : onMedium ? (
                            <span className="text-zinc-500 dark:text-zinc-500">
                              Full read on Medium
                            </span>
                          ) : null}
                        </div>

                        <div>
                          <h2 className="font-serif text-2xl font-normal leading-snug tracking-tight text-zinc-900 transition duration-300 group-hover:text-[#166534] dark:text-white dark:group-hover:text-[#bbf7d0] sm:text-[1.65rem] sm:leading-tight">
                            {post.title}
                          </h2>
                          <p className="mt-3 line-clamp-3 font-serif text-base font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-zinc-200/80 pt-4 dark:border-white/[0.08]">
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 dark:text-[#5bd37d]">
                            {onMedium ? "Open preview" : "Read article"}
                            <ArrowUpRight
                              className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              aria-hidden
                            />
                          </span>
                          <span className="text-xs text-zinc-400 dark:text-zinc-600">
                            {onMedium ? "Medium" : "MDX"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {totalPages > 1 ? (
              <nav
                aria-label="Blog list pagination"
                className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200/80 pt-8 dark:border-white/[0.08]"
              >
                <Link
                  href={blogsListHref({
                    q,
                    topic,
                    page: hasPrev ? pageSafe - 1 : pageSafe,
                  })}
                  prefetch={false}
                  scroll={false}
                  aria-disabled={!hasPrev}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    hasPrev
                      ? "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600"
                      : "pointer-events-none border-zinc-100 text-zinc-400 opacity-50 dark:border-zinc-800 dark:text-zinc-600"
                  }`}
                >
                  <ChevronLeft className="size-4" aria-hidden />
                  Previous
                </Link>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {skip + 1}–{Math.min(skip + posts.length, total)} of {total}
                </span>
                <Link
                  href={blogsListHref({
                    q,
                    topic,
                    page: hasNext ? pageSafe + 1 : pageSafe,
                  })}
                  prefetch={false}
                  scroll={false}
                  aria-disabled={!hasNext}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    hasNext
                      ? "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600"
                      : "pointer-events-none border-zinc-100 text-zinc-400 opacity-50 dark:border-zinc-800 dark:text-zinc-600"
                  }`}
                >
                  Next
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              </nav>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
