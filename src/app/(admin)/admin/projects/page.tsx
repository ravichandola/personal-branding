import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ProjectsAdminPanel } from "@/features/admin/projects-admin";
import { prisma } from "@/lib/prisma";
import type { ProjectCategoryCode } from "@/generated/prisma";

export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const projects = await prisma.project
    .findMany({
      include: { categories: true },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  const rows = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    excerpt: p.excerpt,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    markdown: p.markdown,
    tech: p.tech,
    featured: p.featured,
    published: p.published,
    categories: p.categories.map((c) => c.categoryCode) as ProjectCategoryCode[],
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Projects</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Link each entry to GitHub (repo or profile). The public project page
          puts GitHub front and center, with optional live demo URL.
        </p>
      </div>
      <ProjectsAdminPanel projects={rows} />
    </div>
  );
}
