import type { JSX } from "react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { HomeHero } from "@/features/home/home-hero";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardInner } from "@/components/ui/card";
import {
  ArrowUpRight,
  Cpu,
  Landmark,
  Newspaper,
  Sparkles,
  Waves,
} from "lucide-react";

export const dynamic = "force-dynamic";

export type SpotlightItem = {
  title: string;
  summary: string;
  narrative: string;
  projectSlug: string | null;
};

const STATIC_STATS = [
  { label: "Years Leading Automation", value: "7+" },
  { label: "Artifacts Shipped", value: "45+" },
  { label: "Articles & labs", value: "25+" },
  { label: "Automation Stacks", value: "12" },
  { label: "AI experiments", value: "18+" },
];

/** Fallback when `HomeSpotlight` table is empty (matches seeded copy). */
const STATIC_SPOTLIGHTS: SpotlightItem[] = [
  {
    title: "Playwright Fleet Control Plane",
    summary:
      "Tenant-aware estates, flaky auto-remediation loops, SLA-grade instrumentation.",
    narrative:
      "Multi-tenant Playwright estates need more than shared folders — they need identity per tenant, quota-aware runners, artifact retention policies, and dashboards that answer which estate is burning credits before leadership does. This control plane treats flaky tests as operational data: automatic quarantine, reruns with bounded blast radius, and remediation hooks that push failures back to owning teams with context. Instrumentation is SLA-grade: trace IDs from test start through artifact upload, budget alerts, and contract tests that fail the deploy if the fleet itself regresses.",
    projectSlug: "playwright-fleet-fabric",
  },
  {
    title: "RAG Legal Companion",
    summary:
      "Chunking precedent libraries with OCR-aware guardrails plus eval harness.",
    narrative:
      "Legal research RAG dies in the gap between slick demos and messy PDFs — scanned exhibits, redacted clauses, and citation rules that change by jurisdiction. This companion pairs OCR-aware ingestion with chunking that respects document structure, then layers eval harnesses: golden Q&A sets, refusal boundaries around privileged content, and human-in-the-loop review queues when confidence drops. Guardrails are explicit: source attribution on every answer, blocked paths for sealed or non-public corpora, and regression suites that run nightly against precedent drift.",
    projectSlug: "langgraph-citation-guard",
  },
  {
    title: "Performance Radar Suite",
    summary:
      "JMeter choreography, bottleneck overlays spanning prod-traffic hybrids.",
    narrative:
      "Performance testing only helps when it mimics reality without becoming impossible to maintain. This suite choreographs JMeter (and friends) against hybrid traffic models — replayed production shapes blended with synthetic edge cases — and renders bottleneck overlays that tie latency spikes to deploy windows, dependency versions, and fixture changes. The operator-facing goal is a single radar: reproducible scenarios, clear ownership, and a straight answer to whether a release slowed the system and where.",
    projectSlug: null,
  },
];

export default async function MarketingHomePage() {
  let portrait: string | undefined;
  let heroTitles: string[] | undefined;
  let stats = STATIC_STATS;
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

    portrait = profile?.avatarUrl ?? undefined;
    if (profile?.rotatingTitles?.length) {
      heroTitles = profile.rotatingTitles;
    }

    if (profile) {
      stats = [
        {
          label: "Years Leading Automation",
          value: formatStat(profile.statsYears, "7+"),
        },
        {
          label: "Artifacts Delivered",
          value: formatStat(profile.statsProjects, "45+"),
        },
        {
          label: "Articles published",
          value: formatStat(profile.statsArticles, "25"),
        },
        {
          label: "Automation fleets",
          value: formatStat(profile.statsAutomationRuns, "12"),
        },
        {
          label: "AI prototypes",
          value: formatStat(profile.statsAiExperiments, "18+"),
        },
      ];
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
    <div className="flex flex-col gap-16 pb-8 sm:gap-20 lg:gap-24">
      <HomeHero portraitUrl={portrait} heroTitles={heroTitles} />
      <MetricStrip metrics={stats} />
      <Pillars />
      <ProjectSpotlight items={spotlight} />
    </div>
  );
}

function formatStat(value?: number | null, fallback = "—") {
  if (value === undefined || value === null) return fallback;

  const suffix = value >= 100 ? "+" : "";

  return `${value}${suffix}`;
}

function MetricStrip({
  metrics,
}: {
  metrics: Array<{ label: string; value: string }>;
}) {
  return (
    <Card glow className="shadow-sm">
      <CardInner className="grid divide-y divide-zinc-200/90 dark:divide-zinc-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="space-y-2.5 px-5 py-5 sm:px-6 sm:py-7"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
              {metric.label}
            </p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {metric.value}
            </p>
          </div>
        ))}
      </CardInner>
    </Card>
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
      badge: "Architecture spine",
      icon: <Cpu aria-hidden />,
      title: "Composable automation rails",
      body: "Treat harnesses like products — contracts, versioning, telemetry, infra-as-fixtures baked in.",
    },
    {
      badge: "LangGraph fleets",
      icon: <Sparkles aria-hidden />,
      title: "Agents with deterministic guardrails",
      body: "Graphs orchestrate escalation, OCR fallbacks, human approvals, pragmatic memory strategies.",
    },
    {
      badge: "Legal tech realism",
      icon: <Landmark aria-hidden />,
      title: "OCR-heavy confidence loops",
      body: "Regulated datasets, SLA-sensitive regressions, redaction choreography, deterministic evaluators.",
    },
    {
      badge: "Story engine",
      icon: <Newspaper aria-hidden />,
      title: "Publishing as compass",
      body: "Architectural war stories become labs, playgrounds, MDX curricula for teams onboarding.",
    },
    {
      badge: "Distributed posture",
      icon: <Waves aria-hidden />,
      title: "Systems thinking defaults",
      body: "Graceful degradation, blast radius calculus, phased rollouts, humane on-call ergonomics.",
    },
  ];

  return (
    <section className="flex flex-col gap-9">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl space-y-4">
          <Badge tone="muted">How I think about delivery</Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Serious automation craft for teams that cannot afford mystery in production.
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            From hyperscale OCR programs to QA leadership and independent labs — the
            through-line is operability: clear contracts, measurable quality, and
            systems that stay legible when scale shows up.
          </p>
        </div>
        <Button asChild variant="primary" className="shadow-md shadow-orange-900/15 dark:shadow-orange-950/40">
          <Link href="/about" prefetch>
            About
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {pillars.map((pillar) => (
          <PillarCard key={pillar.title} {...pillar} />
        ))}
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
    <div className="group rounded-2xl border border-zinc-200/90 bg-white/80 p-6 shadow-sm transition-[border-color,box-shadow] hover:border-orange-600/35 hover:shadow-md hover:shadow-zinc-900/[0.03] dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-orange-500/40 dark:hover:shadow-black/25">
      <Badge tone="muted">
        <span aria-hidden className="text-zinc-600 dark:text-zinc-400">
          {icon}
        </span>
        <span>{badge}</span>
      </Badge>

      <h3 className="mt-6 text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
        {body}
      </p>
    </div>
  );
}

function ProjectSpotlight({ items }: { items: SpotlightItem[] }) {
  const cardClass =
    "group flex h-full flex-col rounded-2xl border border-zinc-200/90 bg-white/75 shadow-sm outline-none transition-[border-color,box-shadow] hover:border-orange-600/45 hover:shadow-md hover:shadow-zinc-900/[0.04] focus-visible:ring-2 focus-visible:ring-orange-600/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-orange-500/45 dark:hover:shadow-black/25";

  return (
    <section className="space-y-9">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-4">
          <Badge tone="muted">Selected work</Badge>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Case studies shaped for auditors, infra, and on-call operators.
          </h2>
        </div>

        <Button asChild variant="outline">
          <Link href="/projects" prefetch>
            All projects
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item, idx) => {
          const body = (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-400">
                Featured {idx + 1}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-zinc-900 group-hover:text-orange-800 dark:text-white dark:group-hover:text-orange-300 sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
                {item.summary}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-5">
                {item.narrative}
              </p>
              {item.projectSlug ? (
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-orange-700 dark:text-orange-400">
                  Read case study
                  <ArrowUpRight
                    className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              ) : (
                <span className="mt-5 text-xs font-medium text-zinc-500 dark:text-zinc-500">
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
                <div className="flex h-full flex-col p-6 text-left sm:p-7">{body}</div>
              </Link>
            );
          }

          return (
            <div key={`${item.title}-${idx}`} className={cardClass}>
              <div className="flex h-full flex-col p-6 text-left sm:p-7">{body}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
