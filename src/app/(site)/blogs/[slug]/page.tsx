import { notFound } from "next/navigation";

import { MdxArticle } from "@/features/blog/mdx-content";
import { MediumPostLayout } from "@/features/blog/medium-post-layout";
import { isMediumArticleUrl } from "@/lib/external-content";
import { prisma } from "@/lib/prisma";

/** Pre-render published posts at build; new slugs still work (`dynamicParams`). */
export async function generateStaticParams() {
  const slugs = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return slugs.map(({ slug }) => ({ slug }));
}

export const dynamicParams = true;

/** Fallback ISR if content changes without an admin `revalidatePath` (e.g. sync script). */
export const revalidate = 3600;

export default async function BlogDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) {
    notFound();
  }

  const canonical = post.canonicalUrl?.trim() ?? "";
  if (canonical && isMediumArticleUrl(canonical)) {
    return (
      <MediumPostLayout
        title={post.title}
        excerpt={post.excerpt}
        publishedAt={post.publishedAt}
        canonicalUrl={canonical}
        content={post.content}
      />
    );
  }

  return (
    <article className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          {post.readingTimeMinutes ?? 5} min read
        </p>
        <h1 className="mt-4 text-4xl font-semibold">{post.title}</h1>
        <p className="mt-4 text-lg text-slate-300">{post.excerpt}</p>
        {canonical ? (
          <p className="mt-4 text-sm text-slate-500">
            Originally published:{" "}
            <a
              href={canonical}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              {canonical}
            </a>
          </p>
        ) : null}
      </header>
      <MdxArticle source={post.content} />
    </article>
  );
}
