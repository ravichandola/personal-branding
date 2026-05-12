import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { BlogsAdminPanel } from "@/features/admin/blogs-admin";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const posts = await prisma.blogPost
    .findMany({ orderBy: { updatedAt: "desc" } })
    .catch(() => []);

  const rows = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    canonicalUrl: p.canonicalUrl,
    published: p.published,
    featured: p.featured,
    publishedAt: p.publishedAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Blog posts</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Add a Medium article URL, title, and excerpt. The public site shows a
          Medium-style preview with a clear button to read the full story on
          Medium.
        </p>
      </div>
      <BlogsAdminPanel posts={rows} />
    </div>
  );
}
