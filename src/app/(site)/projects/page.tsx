import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { GithubMark } from "@/components/icons/github-mark";
import { prisma } from "@/lib/prisma";
import { PageIntro } from "@/components/marketing/page-intro";
import { Badge } from "@/components/ui/badge";
import { Card, CardInner } from "@/components/ui/card";
import { githubPathLabel } from "@/lib/external-content";
import { cn } from "@/lib/utils";

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

const sectionPanel =
  "relative overflow-hidden rounded-[1.75rem] border border-zinc-200/90 bg-gradient-to-b from-zinc-50/95 via-white/92 to-zinc-100/80 p-8 shadow-sm ring-1 ring-black/[0.03] dark:border-zinc-800/90 dark:from-zinc-950/95 dark:via-zinc-950/75 dark:to-black/50 dark:ring-white/[0.04] sm:p-10 lg:p-12";

const sectionGlow =
  "pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-orange-400/18 blur-3xl dark:bg-orange-500/22";

function excerptSnippet(project: {
  excerpt: string | null;
  description: string;
}) {
  const raw = project.excerpt ?? project.description;
  const trimmed =
    raw.length > 220 ? `${raw.slice(0, 217).trimEnd()}…` : raw;
  return trimmed;
}

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
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-14 lg:gap-[4.25rem]">
        <header className="scroll-mt-28">
          <PageIntro
            eyebrow="Program catalogue"
            title="Projects with first-class GitHub links."
            description="Each card opens a project page with repo context and a one-click path to GitHub — whether that is a repository, org, or your profile."
          />
          <div
            className="mx-auto mt-12 h-px max-w-xs bg-gradient-to-r from-transparent via-orange-500/40 to-transparent dark:via-orange-400/35 lg:mt-16"
            aria-hidden
          />
        </header>

        <section
          aria-labelledby="projects-catalog-heading"
          className="scroll-mt-28"
        >
          <div className={sectionPanel}>
            <div className={sectionGlow} aria-hidden />
            <div
              className="pointer-events-none absolute -bottom-32 left-1/4 h-48 w-48 rounded-full bg-orange-600/10 blur-3xl dark:bg-orange-600/15"
              aria-hidden
            />

            <header className="relative z-[1] mb-8 space-y-4 sm:mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-400 sm:text-base">
                Browse
              </p>
              <h2
                id="projects-catalog-heading"
                className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl"
              >
                Catalogue & filters
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg sm:leading-[1.65]">
                Tap a tag to narrow the list. Cards respect your admin sort and
                publication flags.
              </p>
            </header>

            <div className="relative z-[1] flex flex-wrap gap-2 sm:gap-2.5">
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
                    scroll={false}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors sm:px-4 sm:text-xs sm:tracking-wide",
                      isActive
                        ? "border-orange-500/55 bg-orange-500/12 text-orange-900 shadow-sm shadow-orange-500/10 dark:border-orange-400/45 dark:bg-orange-500/15 dark:text-orange-100"
                        : "border-zinc-300/95 bg-white/90 text-zinc-600 hover:border-orange-400/45 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-400 dark:hover:border-orange-500/35 dark:hover:text-zinc-200",
                    )}
                  >
                    {filter}
                  </Link>
                );
              })}
            </div>

            {filtered.length === 0 ? (
              <div className="relative z-[1] mt-10 rounded-2xl border border-dashed border-zinc-300/90 bg-white/70 px-6 py-10 dark:border-zinc-700 dark:bg-zinc-950/45 sm:px-8">
                <p className="max-w-prose text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {projects.length === 0 ? (
                    <>
                      No published projects yet. Add some in the admin portal or
                      run{" "}
                      <code className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[13px] dark:border-zinc-700 dark:bg-zinc-900">
                        npm run db:seed
                      </code>
                      .
                    </>
                  ) : (
                    <>
                      Nothing tagged{" "}
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {active}
                      </span>
                      .{" "}
                      <Link
                        href="/projects"
                        className="font-semibold text-orange-700 underline-offset-4 hover:underline dark:text-orange-400"
                      >
                        Clear filter
                      </Link>{" "}
                      to see all {projects.length} project
                      {projects.length === 1 ? "" : "s"}.
                    </>
                  )}
                </p>
              </div>
            ) : (
              <div className="relative z-[1] mt-10 grid gap-6 sm:gap-7 md:grid-cols-2">
                {filtered.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-orange-500/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fm-bg)] dark:focus-visible:ring-orange-400/50 dark:focus-visible:ring-offset-zinc-950"
                  >
                    <Card
                      glow={project.featured}
                      className={cn(
                        "flex h-full flex-col rounded-2xl border-zinc-200/95 bg-white/95 shadow-sm ring-1 ring-black/[0.03] transition-[transform,box-shadow] duration-300 dark:border-zinc-800 dark:bg-zinc-950/90 dark:ring-white/[0.04]",
                        "group-hover:-translate-y-1 group-hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,0.18)] group-hover:ring-orange-500/14 dark:group-hover:shadow-[0_28px_56px_-26px_rgba(0,0,0,0.55)] dark:group-hover:ring-orange-400/18",
                      )}
                    >
                      <div className="flex min-h-0 flex-1 gap-0">
                        <div
                          className={cn(
                            "w-1 shrink-0 rounded-l-[inherit] bg-gradient-to-b from-orange-500 via-orange-400/70 to-orange-600/45 opacity-90 dark:from-orange-400 dark:via-orange-500/55 dark:to-orange-600/40",
                            !project.featured &&
                              "from-zinc-400 via-zinc-300/60 to-zinc-500/45 dark:from-zinc-600 dark:via-zinc-600/50 dark:to-zinc-700/50",
                          )}
                          aria-hidden
                        />
                        <CardInner className="flex flex-1 flex-col space-y-4 p-6 sm:space-y-5 sm:p-7">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                tone={project.featured ? "neon" : "slate"}
                              >
                                {project.featured ? "Featured" : "Archive"}
                              </Badge>
                              <ArrowUpRight
                                className="h-4 w-4 shrink-0 text-zinc-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 dark:text-zinc-500"
                                aria-hidden
                              />
                            </div>
                            {project.githubUrl ? (
                              <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-zinc-200/95 bg-zinc-50/95 px-3 py-1 text-[11px] font-medium tabular-nums text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 sm:text-xs">
                                <GithubMark className="size-3.5 shrink-0 opacity-80" />
                                <span className="truncate">
                                  {githubPathLabel(project.githubUrl)}
                                </span>
                              </span>
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-[1.35rem]">
                              {project.title}
                            </h3>
                            <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-[15px] sm:leading-relaxed">
                              {excerptSnippet(project)}
                            </p>
                          </div>
                        </CardInner>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";
