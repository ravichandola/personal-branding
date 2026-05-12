import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  Library,
  Search,
  Sparkles,
} from "lucide-react";

import { PageIntro } from "@/components/marketing/page-intro";
import { Button } from "@/components/ui/button";
import { isMediumArticleUrl } from "@/lib/external-content";
import { prisma } from "@/lib/prisma";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const posts = await prisma.blogPost
    .findMany({
      where: {
        published: true,
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { excerpt: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    })
    .catch(() => []);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 max-w-4xl bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(26,137,23,0.14),transparent_65%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(26,137,23,0.12),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-3xl space-y-12">
        <PageIntro
          eyebrow="Writing"
          title="Essays & notes"
          description="Editorial-style layout: calm type, clear hierarchy, and Medium pieces one click away—without leaving the rhythm of this site."
        >
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/60 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300">
              <Library className="size-3.5 opacity-70" aria-hidden />
              {query
                ? `${posts.length} result${posts.length === 1 ? "" : "s"}`
                : `${posts.length} article${posts.length === 1 ? "" : "s"}`}
            </span>
            {query ? (
              <Link
                href="/blogs"
                className="text-xs font-medium text-orange-700 underline-offset-4 hover:underline dark:text-orange-400"
              >
                Clear search
              </Link>
            ) : null}
          </div>
        </PageIntro>

        <form
          action="/blogs"
          method="get"
          className="fm-surface flex flex-col gap-2 rounded-2xl p-2 shadow-sm sm:flex-row sm:items-stretch"
        >
          <label className="relative min-h-11 flex-1">
            <span className="sr-only">Search articles</span>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
              aria-hidden
            />
            <input
              className="h-11 w-full rounded-xl border border-transparent bg-zinc-50/90 py-2 pl-10 pr-3 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-orange-500/35 focus:bg-white dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-orange-400/30 dark:focus:bg-zinc-950/80"
              defaultValue={query}
              name="q"
              placeholder="Search titles and excerpts…"
              autoComplete="off"
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

        {posts.length === 0 ? (
          <div className="fm-surface rounded-2xl px-8 py-16 text-center">
            <p className="font-serif text-xl text-zinc-800 dark:text-zinc-200">
              {query ? "No articles match that search." : "No published articles yet."}
            </p>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              {query ? (
                <>
                  Try another phrase or{" "}
                  <Link
                    href="/blogs"
                    className="font-medium text-orange-700 underline-offset-4 hover:underline dark:text-orange-400"
                  >
                    browse everything
                  </Link>
                  .
                </>
              ) : (
                "Add a post from the admin blog console when you are ready."
              )}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-5">
            {posts.map((post) => {
              const onMedium =
                !!post.canonicalUrl && isMediumArticleUrl(post.canonicalUrl);
              return (
                <li key={post.id}>
                  <Link
                    href={`/blogs/${post.slug}`}
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
        )}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
