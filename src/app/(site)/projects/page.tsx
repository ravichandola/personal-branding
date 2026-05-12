import Link from "next/link";

import { GithubMark } from "@/components/icons/github-mark";
import { prisma } from "@/lib/prisma";
import { PageIntro } from "@/components/marketing/page-intro";
import { Badge } from "@/components/ui/badge";
import { githubPathLabel } from "@/lib/external-content";

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
        title="Projects with first-class GitHub links."
        description="Each card opens a project page with repo context and a one-click path to GitHub—whether that is a repository, org, or your profile."
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
            <div className="flex flex-wrap items-start justify-between gap-3">
              <Badge tone={project.featured ? "neon" : "slate"}>
                {project.featured ? "Featured" : "Archive"}
              </Badge>
              {project.githubUrl ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-slate-200">
                  <GithubMark className="size-3.5 shrink-0 opacity-80" />
                  {githubPathLabel(project.githubUrl)}
                </span>
              ) : null}
            </div>
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
