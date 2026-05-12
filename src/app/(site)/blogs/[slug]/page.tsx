import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { MdxArticle } from "@/features/blog/mdx-content";

export default async function BlogDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          {post.readingTimeMinutes ?? 5} min read
        </p>
        <h1 className="mt-4 text-4xl font-semibold">{post.title}</h1>
        <p className="mt-4 text-lg text-slate-300">{post.excerpt}</p>
      </header>
      <MdxArticle source={post.content} />
    </article>
  );
}

export const dynamic = "force-dynamic";
