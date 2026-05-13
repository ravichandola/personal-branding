import type { JSX } from "react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { HomeHero } from "@/features/home/home-hero";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Cpu,
  Landmark,
  Newspaper,
  Sparkles,
  UserRound,
  Waves,
} from "lucide-react";

export const dynamic = "force-dynamic";

export type SpotlightItem = {
  title: string;
  summary: string;
  narrative: string;
  projectSlug: string | null;
};

/** Served from `public/portrait.png` when CMS avatar URL is unset. */
const DEFAULT_HOME_PORTRAIT = "/portrait.png";

const sectionPanel = "marketing-shell";

const sectionGlow = "marketing-glow-tr";

/** Fallback when `HomeSpotlight` table is empty (matches seeded copy). */
const STATIC_SPOTLIGHTS: SpotlightItem[] = [
  {
    title: "Sage — Cursor autocode",
    summary:
      "Repo-aware drafts plus Jira-grounded flows; maintenance posture for brutal regression windows.",
    narrative:
      "Sage sits on Cursor as an autocode layer: it reads the repository, proposes concrete test flows tied to what changed, and pulls structured Jira context so engineers aren’t guessing acceptance criteria from memory. When timelines compress and UIs churn, the maintenance-oriented workflows prioritize risk, remap selectors, and refocus suites using impact signals — so teams keep signal instead of drowning in rewrite noise.",
    projectSlug: "sage",
  },
  {
    title: "Avengers — Unified automation",
    summary:
      "One Playwright-style surface across browser, desktop, mobile, and API testing.",
    narrative:
      "Avengers treats automation as one product: shared patterns and APIs whether you are driving a browser, desktop shell, mobile client, or HTTP contracts. The payoff is less bespoke glue per channel — consistent fixtures, shared reporting vocabulary, and engineers who can rotate across surfaces without re-learning entirely different frameworks.",
    projectSlug: "avengers",
  },
  {
    title: "Portfolio platform — this site",
    summary:
      "Next.js 15, Prisma CMS, auth, analytics — production-minded OSS scaffold.",
    narrative:
      "The personal-branding repo is the codebase behind this marketing site and admin console: App Router, Postgres-backed CMS patterns, JWT-protected admin routes, analytics beacons, Docker + CI that exercise migrations against real Postgres. It is the reference implementation for how portfolio content, projects, and ops docs stay versioned together.",
    projectSlug: "personal-branding",
  },
];

export default async function MarketingHomePage() {
  let portrait: string | undefined = DEFAULT_HOME_PORTRAIT;
  let heroTitles: string[] | undefined;
  let spotlight: SpotlightItem[] = STATIC_SPOTLIGHTS;

  try {
    const [profile, dbSpotlights] = await Promise.all([
      prisma.profile.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.homeSpotlight.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 3,
      }),
    ]);

    const avatarFromDb = profile?.avatarUrl?.trim();
    if (avatarFromDb) portrait = avatarFromDb;
    if (profile?.rotatingTitles?.length) {
      heroTitles = profile.rotatingTitles;
    }

    if (dbSpotlights.length > 0) {
      spotlight = dbSpotlights.map((s) => ({
        title: s.title,
        summary: s.summary,
        narrative: s.narrative,
        projectSlug: s.projectSlug,
      }));
    }
  } catch {
    /* optional DB */
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-10 sm:pb-14">
      <div className="flex flex-col gap-14 lg:gap-[4.25rem]">
        <header className="scroll-mt-28">
          <HomeHero portraitUrl={portrait} heroTitles={heroTitles} />
          <div
            className="page-rule"
            aria-hidden
          />
        </header>

        <Pillars />

        <ProjectSpotlight items={spotlight} />
      </div>
    </div>
  );
}

function Pillars() {
  const pillars: Array<{
    badge: string;
    title: string;
    body: string;
    icon: JSX.Element;
  }> = [
    {
      badge: "Test architecture",
      icon: <Cpu aria-hidden />,
      title: "Automation built like a product",
      body: "Clear boundaries between tests and services, versioned data, and telemetry that ties failures to commits and releases — so CI feedback is something teams can trust and fix, not noise.",
    },
    {
      badge: "AI & agents",
      icon: <Sparkles aria-hidden />,
      title: "Intelligence with guardrails",
      body: "Graph-style workflows where models accelerate work but don't replace accountability — sensible escalation, OCR and retrieval when documents are ugly, human review when risk is high, and checks so assistance never quietly bypasses truth.",
    },
    {
      badge: "Regulated stacks",
      icon: <Landmark aria-hidden />,
      title: "Confidence on sensitive surfaces",
      body: "Legal and financial products need more than demos: regressions that respect SLAs, disciplined handling of sensitive content, and evaluation loops so AI-assisted steps stay auditable alongside classical automation.",
    },
    {
      badge: "Writing & teaching",
      icon: <Newspaper aria-hidden />,
      title: "Narratives that shorten onboarding",
      body: "Articles, labs, and structured notes turn tough lessons into reusable context — so new teammates grasp not only what shipped, but why the architecture looks the way it does.",
    },
    {
      badge: "Production posture",
      icon: <Waves aria-hidden />,
      title: "Systems that bend without breaking",
      body: "Graceful degradation, bounded blast radius, phased rollouts, and on-call flows that respect humans — reliability as habit, not heroics when traffic spikes or the org reshapes the roadmap.",
    },
  ];

  return (
    <section className="scroll-mt-28" aria-labelledby="home-pillars-heading">
      <div className={sectionPanel}>
        <div className={sectionGlow} aria-hidden />
        <div
          className="marketing-blur-bl"
          aria-hidden
        />

        <div className="relative z-[1] flex flex-wrap items-end justify-between gap-6 pb-9 sm:pb-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent sm:text-base">
              How I work
            </p>
            <h2
              id="home-pillars-heading"
              className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-snug"
            >
              Automation and AI that stay understandable when production gets
              loud.
            </h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
              From large-scale OCR and legal-tech programs to QA leadership
              and independent labs, the thread is the same: operability —
              explicit hand-offs between people and systems, quality you can
              measure, and architectures that don&apos;t turn into folklore when
              load, scope, or headcount grow.
            </p>
          </div>
          <Button
            asChild
            variant="primary"
            className="shadow-md shadow-accent/15 dark:shadow-accent/25"
          >
            <Link href="/about" prefetch className="gap-1.5">
              About me
              <UserRound className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="relative z-[1] grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({
  badge,
  title,
  body,
  icon,
}: {
  badge: string;
  title: string;
  body: string;
  icon: JSX.Element;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card/90 p-6 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-md hover:shadow-foreground/[0.04] dark:bg-card/80 dark:hover:shadow-black/25">
      <Badge tone="muted">
        <span aria-hidden className="text-muted-foreground">
          {icon}
        </span>
        <span>{badge}</span>
      </Badge>

      <h3 className="mt-6 text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function ProjectSpotlight({ items }: { items: SpotlightItem[] }) {
  const cardClass =
    "group flex h-full flex-col rounded-2xl border border-border bg-card/90 shadow-sm outline-none transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-md hover:shadow-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-accent/50 dark:bg-card/80 dark:hover:shadow-black/25";

  return (
    <section
      className="scroll-mt-28 space-y-0"
      aria-labelledby="home-spotlight-heading"
    >
      <div className={sectionPanel}>
        <div className={sectionGlow} aria-hidden />
        <div
          className="marketing-blur-br"
          aria-hidden
        />

        <div className="relative z-[1] flex flex-wrap items-end justify-between gap-6 pb-9 sm:pb-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent sm:text-base">
              Selected work
            </p>
            <h2
              id="home-spotlight-heading"
              className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-snug"
            >
              Case studies shaped for auditors, infra, and on-call operators.
            </h2>
          </div>

          <Button asChild variant="outline">
            <Link href="/projects" prefetch>
              All projects
            </Link>
          </Button>
        </div>

        <div className="relative z-[1] grid gap-5 lg:grid-cols-3">
          {items.map((item, idx) => {
            const body = (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Featured {idx + 1}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-accent dark:group-hover:text-accent sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] font-medium leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-5">
                  {item.narrative}
                </p>
                {item.projectSlug ? (
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    Read case study
                    <ArrowUpRight
                      className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                ) : (
                  <span className="mt-5 text-xs font-medium text-muted-foreground">
                    Full write-up coming soon
                  </span>
                )}
              </>
            );

            if (item.projectSlug) {
              return (
                <Link
                  key={`${item.title}-${idx}`}
                  href={`/projects/${item.projectSlug}`}
                  prefetch
                  className={`${cardClass} block`}
                >
                  <div className="flex h-full flex-col p-6 text-left sm:p-7">
                    {body}
                  </div>
                </Link>
              );
            }

            return (
              <div key={`${item.title}-${idx}`} className={cardClass}>
                <div className="flex h-full flex-col p-6 text-left sm:p-7">
                  {body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
