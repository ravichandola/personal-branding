import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { PageIntro } from "@/components/marketing/page-intro";
import { Badge } from "@/components/ui/badge";

const FILTERS = [
  "ALL",
  "AI",
  "AUTOMATION",
  "REACT",
  "BACKEND",
  "PERFORMANCE",
  "OCR",
  "LANGGRAPH",
] as const;

type Filter = (typeof FILTERS)[number];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = (category?.toUpperCase() ?? "ALL") as Filter;

  const projects = await prisma.project
    .findMany({
      where: { published: true },
      include: { categories: true },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  const filtered =
    active === "ALL"
      ? projects
      : projects.filter((project) =>
          project.categories.some((pc) => pc.categoryCode === active),
        );

  return (
    <div className="space-y-12">
      <PageIntro
        eyebrow="Program catalogue"
        title="Dynamic projects with GitHub, live URLs, MDX deep dives, and SEO envelopes."
        description="Each record is managed through the Admin Project CMS with gallery uploads, category filters, and featured placement."
      />

      <div className="flex flex-wrap gap-3">
        {FILTERS.map((filter) => {
          const href =
            filter === "ALL"
              ? "/projects"
              : `/projects?category=${filter.toLowerCase()}`;
          const isActive = filter === active;
          return (
            <Link
              key={filter}
              href={href}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                isActive
                  ? "border-emerald-300/80 bg-emerald-500/10 text-emerald-100"
                  : "border-white/10 text-slate-300 hover:border-white/30"
              }`}
            >
              {filter}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/80 via-purple-950/40 to-transparent p-6 transition hover:-translate-y-1 hover:border-emerald-200/60"
          >
            <Badge tone={project.featured ? "neon" : "slate"}>
              {project.featured ? "Featured" : "Archive"}
            </Badge>
            <h2 className="mt-4 text-2xl font-semibold">{project.title}</h2>
            <p className="mt-2 text-sm text-slate-300">
              {project.excerpt ?? project.description.slice(0, 180)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";
