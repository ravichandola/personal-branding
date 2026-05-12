import type { JSX } from "react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { HomeHero } from "@/features/home/home-hero";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardInner } from "@/components/ui/card";
import {
  Cpu,
  Landmark,
  Newspaper,
  Sparkles,
  Waves,
} from "lucide-react";

export const dynamic = "force-dynamic";

const STATIC_STATS = [
  { label: "Years Leading Automation", value: "7+" },
  { label: "Artifacts Shipped", value: "45+" },
  { label: "Articles & labs", value: "25+" },
  { label: "Automation Stacks", value: "12" },
  { label: "AI experiments", value: "18+" },
];

const STATIC_PROJECTS = [
  {
    slug: "enterprise-playwright-fleet",
    title: "Playwright Fleet Control Plane",
    excerpt:
      "Tenant-aware estates, flaky auto-remediation loops, SLA-grade instrumentation.",
  },
  {
    slug: "rag-legal-companion",
    title: "RAG Legal Companion",
    excerpt:
      "Chunking precedent libraries with OCR-aware guardrails plus eval harness.",
  },
  {
    slug: "performance-radar-suite",
    title: "Performance Radar Suite",
    excerpt:
      "JMeter choreography, bottleneck overlays spanning prod-traffic hybrids.",
  },
];

export default async function MarketingHomePage() {
  let portrait: string | undefined;
  let stats = STATIC_STATS;
  let spotlight = STATIC_PROJECTS;

  try {
    const [profile, projects] = await Promise.all([
      prisma.profile.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.project.findMany({
        where: { published: true },
        orderBy: { updatedAt: "desc" },
        take: 3,
      }),
    ]);

    portrait = profile?.avatarUrl ?? undefined;

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

    if (projects.length > 0) {
      spotlight = projects.map((project) => ({
        slug: project.slug,
        title: project.title,
        excerpt:
          project.excerpt ??
          `${project.description.slice(0, 160).trim()}${project.description.length > 160 ? "…" : ""}`,
      }));
    }
  } catch {
    /* optional DB */
  }

  return (
    <div className="flex flex-col gap-20 pb-8 sm:gap-24">
      <HomeHero portraitUrl={portrait} />
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
    <Card>
      <CardInner className="grid divide-y divide-zinc-200 dark:divide-zinc-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-3 px-6 py-6 sm:py-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              {metric.label}
            </p>
            <p className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
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
    <section className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl space-y-4">
          <Badge tone="muted">How I think about delivery</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Serious automation craft for teams that cannot afford mystery in production.
          </h2>
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            From hyperscale OCR programs to QA leadership and independent labs — the
            through-line is operability: clear contracts, measurable quality, and
            systems that stay legible when scale shows up.
          </p>
        </div>
        <Button asChild variant="primary">
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
    <div className="group rounded-xl border border-zinc-200 bg-white/80 p-6 transition-colors hover:border-orange-600/35 dark:border-zinc-800 dark:bg-zinc-900/35 dark:hover:border-orange-500/40">
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

function ProjectSpotlight({
  items,
}: {
  items: Array<{ slug: string; title: string; excerpt: string }>;
}) {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-4">
          <Badge tone="muted">Selected work</Badge>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
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
        {items.map((item, idx) => (
          <Link
            key={item.slug}
            href={`/projects/${item.slug}`}
            prefetch
            className="group block rounded-xl border border-zinc-200 bg-white/80 outline-none transition-colors hover:border-orange-600/40 focus-visible:ring-2 focus-visible:ring-orange-600/50 dark:border-zinc-800 dark:bg-zinc-900/35 dark:hover:border-orange-500/45"
          >
            <div className="h-full p-6 text-left sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-400">
                Featured {idx + 1}
              </p>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 group-hover:text-orange-800 dark:text-white dark:group-hover:text-orange-300 sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
