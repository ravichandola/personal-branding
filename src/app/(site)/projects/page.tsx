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

const sectionPanel = "marketing-shell";

const sectionGlow = "marketing-glow-tr";

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
            title="Selected engineering work with GitHub context."
            description="Each card opens a project page with repo context and a one-click path to GitHub — whether that is a repository, org, or your profile."
          />
          <div className="page-rule" aria-hidden />
        </header>

        <section
          aria-labelledby="projects-catalog-heading"
          className="scroll-mt-28"
        >
          <div className={sectionPanel}>
            <div className={sectionGlow} aria-hidden />
            <div className="marketing-blur-bl" aria-hidden />

            <header className="relative z-[1] mb-8 space-y-4 sm:mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent sm:text-base">
                Browse
              </p>
              <h2
                id="projects-catalog-heading"
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Catalogue & filters
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
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
                        ? "border-accent/55 bg-accent/12 text-foreground shadow-sm shadow-accent/10"
                        : "border-border bg-card/90 text-muted-foreground hover:border-accent/45 hover:text-foreground dark:bg-card/70",
                    )}
                  >
                    {filter}
                  </Link>
                );
              })}
            </div>

            {filtered.length === 0 ? (
              <div className="relative z-[1] mt-10 marketing-dash-callout">
                <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
                  {projects.length === 0 ? (
                    <>
                      No published projects yet. Add some in the admin portal or
                      run{" "}
                      <code className="surface-code-inline">
                        npm run db:seed
                      </code>
                      .
                    </>
                  ) : (
                    <>
                      Nothing tagged{" "}
                      <span className="font-semibold text-foreground">
                        {active}
                      </span>
                      .{" "}
                      <Link
                        href="/projects"
                        className="font-semibold text-accent underline-offset-4 hover:underline"
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
                    className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Card
                      glow={project.featured}
                      className={cn(
                        "flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/[0.03] transition-[transform,box-shadow] duration-300 dark:ring-white/[0.04]",
                        "group-hover:-translate-y-1 group-hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,0.18)] group-hover:ring-accent/14 dark:group-hover:shadow-[0_28px_56px_-26px_rgba(0,0,0,0.55)] dark:group-hover:ring-accent/18",
                      )}
                    >
                      <div className="flex min-h-0 flex-1 gap-0">
                        <div
                          className={cn(
                            "w-1 shrink-0 rounded-l-[inherit] bg-gradient-to-b from-accent via-accent/70 to-accent-hover opacity-90",
                            !project.featured &&
                              "from-muted-foreground/50 via-muted-foreground/35 to-muted-foreground/45",
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
                                className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                                aria-hidden
                              />
                            </div>
                            {project.githubUrl ? (
                              <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-medium tabular-nums text-foreground sm:text-xs">
                                <GithubMark className="size-3.5 shrink-0 opacity-80" />
                                <span className="truncate">
                                  {githubPathLabel(project.githubUrl)}
                                </span>
                              </span>
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-[1.35rem]">
                              {project.title}
                            </h3>
                            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px] sm:leading-relaxed">
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
