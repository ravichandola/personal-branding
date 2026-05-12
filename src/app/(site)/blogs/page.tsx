import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { PageIntro } from "@/components/marketing/page-intro";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const posts = await prisma.blogPost
    .findMany({
      where: {
        published: true,
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { excerpt: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { publishedAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="MDX publishing"
        title="Category-aware blog engine with TOC, OG images, pagination, reading time."
        description="Powered by Postgres + MDX pipelines. CMS supports drafts, featured posts, tagging, canonical URLs."
      />

      <form className="max-w-xl" action="/blogs" method="get">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Search corpus
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm"
            defaultValue={q ?? ""}
            name="q"
            placeholder="Search Playwright, LangGraph, OCR..."
          />
        </label>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blogs/${post.slug}`}
            className="rounded-3xl border border-white/10 bg-black/40 p-6 hover:border-emerald-200/60"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
              {post.readingTimeMinutes ?? 5} min read
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
