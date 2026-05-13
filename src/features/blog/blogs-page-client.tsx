"use client";

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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { PageIntro } from "@/components/marketing/page-intro";
import { Button } from "@/components/ui/button";
import { isMediumArticleUrl } from "@/lib/external-content";
import {
  BLOGS_PAGE_SIZE,
  BLOG_TOPIC_LABELS,
  BLOG_TOPIC_SLUGS,
  type BlogPostListRow,
  type BlogTopicSlug,
  blogInstantSearchTokens,
  blogPostMatchesFilters,
} from "@/lib/blogs-list";

const TOPIC_CHIPS: ReadonlyArray<{
  slug: BlogTopicSlug | null;
  label: string;
}> = [
  { slug: null, label: "All" },
  ...BLOG_TOPIC_SLUGS.map((slug) => ({
    slug,
    label: BLOG_TOPIC_LABELS[slug],
  })),
];

function formatPostDate(value: BlogPostListRow["publishedAt"]): Date | null {
  if (value == null) return null;
  return value instanceof Date ? value : new Date(value as string);
}

type BlogsPageClientProps = {
  initialQ: string;
  initialTopic: BlogTopicSlug | null;
  initialPage: number;
  allPosts: BlogPostListRow[];
};

export function BlogsPageClient({
  initialQ,
  initialTopic,
  initialPage,
  allPosts,
}: BlogsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const urlDebounceRef = useRef<number | null>(null);

  const [q, setQ] = useState(initialQ);
  const [topic, setTopic] = useState<BlogTopicSlug | null>(initialTopic);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setQ(initialQ);
    setTopic(initialTopic);
    setPage(initialPage);
  }, [initialQ, initialTopic, initialPage]);

  const filtered = useMemo(
    () => allPosts.filter((p) => blogPostMatchesFilters(p, q, topic)),
    [allPosts, q, topic],
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / BLOGS_PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pageSafe = Math.min(Math.max(1, page), totalPages);
  const skip = (pageSafe - 1) * BLOGS_PAGE_SIZE;
  const posts = filtered.slice(skip, skip + BLOGS_PAGE_SIZE);

  const hasPrev = pageSafe > 1;
  const hasNext = pageSafe < totalPages;

  const filtersActive =
    topic !== null || blogInstantSearchTokens(q).length > 0;

  const flushListUrl = () => {
    if (urlDebounceRef.current) {
      clearTimeout(urlDebounceRef.current);
      urlDebounceRef.current = null;
    }
    const params = new URLSearchParams();
    const trimmed = q.trim();
    if (trimmed) params.set("q", trimmed);
    if (topic) params.set("topic", topic);
    if (pageSafe > 1) params.set("page", String(pageSafe));
    const qs = params.toString();
    const next = qs ? `${pathname}?${qs}` : pathname;
    router.replace(next, { scroll: false });
  };

  useEffect(() => {
    if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current);
    urlDebounceRef.current = window.setTimeout(() => {
      urlDebounceRef.current = null;
      const params = new URLSearchParams();
      const trimmed = q.trim();
      if (trimmed) params.set("q", trimmed);
      if (topic) params.set("topic", topic);
      if (pageSafe > 1) params.set("page", String(pageSafe));
      const qs = params.toString();
      const next = qs ? `${pathname}?${qs}` : pathname;
      router.replace(next, { scroll: false });
    }, 480);
    return () => {
      if (urlDebounceRef.current) {
        clearTimeout(urlDebounceRef.current);
        urlDebounceRef.current = null;
      }
    };
  }, [q, topic, pageSafe, pathname, router]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    flushListUrl();
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      document
        .getElementById("blog-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <PageIntroWithMeta
        total={total}
        totalPages={totalPages}
        pageSafe={pageSafe}
        filtersActive={filtersActive}
        onClear={() => {
          setQ("");
          setTopic(null);
          setPage(1);
          if (urlDebounceRef.current) {
            clearTimeout(urlDebounceRef.current);
            urlDebounceRef.current = null;
          }
          router.replace(pathname, { scroll: false });
        }}
      />

      <div className="flex flex-wrap gap-2">
        {TOPIC_CHIPS.map(({ slug, label }) => {
          const active = topic === slug || (slug === null && topic === null);
          return (
            <button
              key={label}
              type="button"
              onClick={() => {
                setTopic(slug ?? null);
                setPage(1);
              }}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98] ${
                active
                  ? "border-[#1a8917]/50 bg-[#1a8917]/15 text-[#166534] dark:text-[#bbf7d0]"
                  : "border-border bg-card/80 text-muted-foreground hover:border-accent/35 dark:bg-card/50 dark:text-muted-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <form
        className="fm-surface flex flex-col gap-2 rounded-2xl p-2 shadow-sm sm:flex-row sm:items-stretch"
        onSubmit={handleSearchSubmit}
      >
        <label className="relative min-h-11 flex-1" htmlFor="blog-search-input">
          <span className="sr-only">Search articles</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id="blog-search-input"
            ref={searchInputRef}
            className="h-11 w-full rounded-xl border border-transparent bg-muted/80 py-2 pl-10 pr-3 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:border-accent/35 focus:bg-background dark:bg-muted/45 dark:text-foreground dark:focus:border-accent/30 dark:focus:bg-card/90"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by title or excerpt as you type…"
            autoComplete="off"
            maxLength={200}
            enterKeyHint="search"
            aria-controls="blog-results"
          />
        </label>
        <div className="flex shrink-0 gap-2 sm:flex-row">
          <Button
            type="submit"
            variant="primary"
            className="h-11 flex-1 rounded-xl px-6 sm:flex-initial sm:px-7"
          >
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-xl px-5 sm:flex-initial"
            onClick={() => {
              setQ("");
              setPage(1);
              searchInputRef.current?.focus();
            }}
          >
            Clear
          </Button>
        </div>
      </form>

      <p id="blog-search-hint" className="text-sm text-muted-foreground">
        Results update as you type.{" "}
        <strong className="font-medium text-foreground">Search</strong>{" "}
        syncs the address bar and scrolls to the list. Space separates words (each must match
        title or excerpt).
      </p>

      {posts.length === 0 ? (
        <div className="fm-surface rounded-2xl px-8 py-16 text-center">
          <p className="font-serif text-xl text-foreground">
            {allPosts.length === 0
              ? "No published articles yet."
              : "No articles match these filters."}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {allPosts.length === 0 ? (
              <>
                Add posts via{" "}
                <code className="surface-code-inline">
                  db:import-medium-export
                </code>{" "}
                or the admin blog console.
              </>
            ) : (
              <>
                Try different keywords
                {topic ? ` or another topic (currently ${BLOG_TOPIC_LABELS[topic]})` : ""}
                , or{" "}
                <button
                  type="button"
                  className="font-medium text-accent underline-offset-4 hover:underline"
                  onClick={() => {
                    setQ("");
                    setTopic(null);
                    setPage(1);
                    if (urlDebounceRef.current) {
                      clearTimeout(urlDebounceRef.current);
                      urlDebounceRef.current = null;
                    }
                    router.replace(pathname, { scroll: false });
                    searchInputRef.current?.focus();
                  }}
                >
                  reset filters
                </button>
                .
              </>
            )}
          </p>
        </div>
      ) : (
        <>
          <ul
            id="blog-results"
            className="flex flex-col gap-5"
            role="list"
            aria-live="polite"
            aria-relevant="additions removals"
            aria-label={`${total} matching articles`}
          >
            {posts.map((post) => {
              const onMedium =
                !!post.canonicalUrl && isMediumArticleUrl(post.canonicalUrl);
              const cat = [...post.categories].sort((a, b) =>
                a.category.name.localeCompare(b.category.name),
              )[0];
              const pub = formatPostDate(post.publishedAt);
              return (
                <li key={post.id}>
                  <Link
                    href={`/blogs/${post.slug}`}
                    prefetch={false}
                    className="group relative block overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-background to-muted/40 p-6 shadow-[0_20px_50px_-28px_rgba(24,24,27,0.25)] transition duration-300 hover:-translate-y-0.5 hover:border-[#1a8917]/35 hover:shadow-[0_28px_60px_-24px_rgba(26,137,23,0.18)] dark:border-white/[0.09] dark:from-card dark:via-card/80 dark:to-emerald-950/20 dark:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.65)] dark:hover:border-[#1a8917]/40"
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
                          <span className="inline-flex items-center rounded-full border border-border bg-muted/90 px-2.5 py-0.5 font-semibold uppercase tracking-wide text-muted-foreground dark:border-white/10 dark:bg-white/[0.06]">
                            On site
                          </span>
                        )}
                        {cat?.category ? (
                          <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.06em] text-foreground">
                            {cat.category.name}
                          </span>
                        ) : null}
                        {pub ? (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="size-3.5 opacity-70" aria-hidden />
                            <time dateTime={pub.toISOString()}>
                              {pub.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </time>
                          </span>
                        ) : null}
                        {post.readingTimeMinutes != null ? (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="size-3.5 opacity-70" aria-hidden />
                            <span className="normal-case">
                              {post.readingTimeMinutes} min read
                            </span>
                          </span>
                        ) : onMedium ? (
                          <span className="text-muted-foreground">
                            Full read on Medium
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="font-serif text-2xl font-normal leading-snug tracking-tight text-foreground transition duration-300 group-hover:text-[#166534] dark:group-hover:text-[#bbf7d0] sm:text-[1.65rem] sm:leading-tight">
                          {post.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 font-serif text-base font-light leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-border pt-4 dark:border-white/[0.08]">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent dark:text-[#5bd37d]">
                          {onMedium ? "Open preview" : "Read article"}
                          <ArrowUpRight
                            className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden
                          />
                        </span>
                        <span className="text-xs text-muted-foreground">
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
              className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 dark:border-white/[0.08]"
            >
              <button
                type="button"
                aria-disabled={!hasPrev}
                onClick={() => hasPrev && setPage((p) => p - 1)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  hasPrev
                    ? "border-border bg-card text-foreground hover:border-accent/40 dark:bg-card/90"
                    : "pointer-events-none border-muted text-muted-foreground opacity-50"
                }`}
              >
                <ChevronLeft className="size-4" aria-hidden />
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                {skip + 1}–{Math.min(skip + posts.length, total)} of {total}
              </span>
              <button
                type="button"
                aria-disabled={!hasNext}
                onClick={() => hasNext && setPage((p) => p + 1)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  hasNext
                    ? "border-border bg-card text-foreground hover:border-accent/40 dark:bg-card/90"
                    : "pointer-events-none border-muted text-muted-foreground opacity-50"
                }`}
              >
                Next
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </nav>
          ) : null}
        </>
      )}
    </>
  );
}

function PageIntroWithMeta(props: {
  total: number;
  totalPages: number;
  pageSafe: number;
  filtersActive: boolean;
  onClear: () => void;
}) {
  const { total, totalPages, pageSafe, filtersActive, onClear } = props;
  return (
    <PageIntro
      eyebrow="Writing"
      title="From the builder’s desk"
      description="Long-form notes on engineering, systems, and ideas that stick—set in unhurried type and open space. Pieces that began on Medium still read beautifully here; the full story is always one click away when you want it."
    >
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground dark:border-white/10 dark:bg-white/[0.06] dark:text-muted-foreground">
          <Library className="size-3.5 opacity-70" aria-hidden />
          {filtersActive || pageSafe > 1
            ? `${total} result${total === 1 ? "" : "s"}`
            : `${total} article${total === 1 ? "" : "s"}`}
          {totalPages > 1 ? (
            <span className="text-muted-foreground">
              · Page {pageSafe}/{totalPages}
            </span>
          ) : null}
        </span>
        {filtersActive || pageSafe > 1 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-accent underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </PageIntro>
  );
}
