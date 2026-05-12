import type { ReactNode } from "react";

import { Cpu, Gauge, LifeBuoy, Shield, Wand2 } from "lucide-react";

import { prisma } from "@/lib/prisma";

import { PageIntro } from "@/components/marketing/page-intro";
import { Card, CardInner } from "@/components/ui/card";
import { SummaryTypewriter } from "@/features/about/summary-typewriter";

const highlights: Array<{ title: string; body: string; icon: ReactNode }> = [
  {
    title: "Contributing to architecture & GenAI",
    body: "Hands-on with test platform design, contracts, CI/CD signal, and observability — not slideware. GenAI where it earns its place (Langchain/LangGraph-style flows) with deterministic gates, evals, and human-in-the-loop when regulated or high-risk.",
    icon: <Cpu aria-hidden />,
  },
  {
    title: "SAGE — autocode on Cursor",
    body: "SAGE is an autocode-generation layer on Cursor: it reads the repo, drafts exact test flows for the product under change, and pulls context from Jira (stories, ACs, links) so coverage maps to real work — engineers can contribute without memorizing every domain edge on day one.",
    icon: <Wand2 aria-hidden />,
  },
  {
    title: "SAGE — maintenance & crisis regressions",
    body: "A maintenance mode for when everything moves at once — e.g. a three-day regression window after a full UI overhaul. Reprioritize risk, remap selectors, regroup suites, and use Jira impact to focus effort so teams aren’t blind when the UI rewrites underneath them.",
    icon: <LifeBuoy aria-hidden />,
  },
  {
    title: "Legal tech, lending, public sector",
    body: "Litera Litigate and PDF/OCR work, GSTN-scale integration, ABFL Digital, AQM Digital Lending and insurance grids — API-first, high-volume, sensitive domains.",
    icon: <Shield aria-hidden />,
  },
  {
    title: "Performance & full-stack delivery",
    body: "JMeter + Elastic Stack, Angular/React-era stacks, Jenkins, ISTQB habits — automation that reflects load and real integration seams, not only happy-path UI.",
    icon: <Gauge aria-hidden />,
  },
];

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let bio: string | null = null;

  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    bio = profile?.bio ?? null;
  } catch {
    /* optional DB */
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      <PageIntro
        eyebrow="About"
        title="Ravi Chandola — Automation Architecture, Programatic GenAI and SAGE"
        description="At Litera I contribute to test architecture and Programatic GenAI. I also build SAGE — an autocode layer on Cursor that connects repos to Jira-grounded flows, plus a maintenance mode for high-pressure regressions when the UI and the clock are both moving."
      />

      {bio ? (
        <section aria-labelledby="about-summary-heading">
          <div className="relative mx-auto max-w-4xl">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-orange-500/25 via-zinc-200/40 to-transparent opacity-80 dark:from-orange-500/20 dark:via-zinc-600/25 dark:to-transparent"
            />
            <Card className="relative overflow-hidden rounded-2xl border-zinc-200/80 bg-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)] dark:border-zinc-700/80 dark:bg-zinc-950 dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-20%,rgba(234,88,12,0.07),transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(234,88,12,0.12),transparent_50%)]" />
              <CardInner className="relative space-y-10 px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
                <div className="border-b border-zinc-200/90 pb-6 dark:border-zinc-800/90">
                  <p
                    id="about-summary-heading"
                    className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-400 sm:text-base"
                  >
                    Summary
                  </p>
                </div>
                <SummaryTypewriter bio={bio} />
              </CardInner>
            </Card>
          </div>
        </section>
      ) : (
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Profile bio not found. Run{" "}
          <code className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[13px] dark:border-zinc-700 dark:bg-zinc-900">
            npm run db:seed
          </code>{" "}
          to load the latest summary.
        </p>
      )}

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {highlights.map((item) => (
          <Card
            key={item.title}
            className="border-zinc-200/95 bg-white/90 dark:border-zinc-800 dark:bg-zinc-950/80"
          >
            <CardInner className="space-y-5 sm:space-y-6 sm:p-8 md:p-9">
              <div className="inline-flex items-center gap-2.5 text-orange-700 dark:text-orange-400 [&_svg]:h-5 [&_svg]:w-5">
                {item.icon}
                <span className="text-xs font-semibold uppercase tracking-[0.16em] sm:text-[13px]">
                  Signal
                </span>
              </div>
              <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                {item.title}
              </h2>
              <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-[17px] sm:leading-[1.65]">
                {item.body}
              </p>
            </CardInner>
          </Card>
        ))}
      </div>
    </div>
  );
}
