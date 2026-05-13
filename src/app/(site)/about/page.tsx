import type { ReactNode } from "react";

import { Cpu, Gauge, LifeBuoy, Shield, Wand2 } from "lucide-react";

import { prisma } from "@/lib/prisma";

import { PageIntro } from "@/components/marketing/page-intro";
import { Card, CardInner } from "@/components/ui/card";
import { AboutSkillsSection } from "@/features/about/about-skills-section";
import { RecommendationsSection } from "@/features/about/recommendations-section";
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

const sectionPanel = "marketing-shell";

const sectionGlow = "marketing-glow-tr";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let bio: string | null = null;
  let recommendations: Awaited<
    ReturnType<typeof prisma.testimonial.findMany>
  > = [];
  let skills: Awaited<ReturnType<typeof prisma.skill.findMany>> = [];

  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    bio = profile?.bio ?? null;
  } catch {
    /* optional DB */
  }

  try {
    recommendations = await prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }],
    });
  } catch {
    /* optional DB */
  }

  try {
    skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {
    /* optional DB */
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-14 lg:gap-[4.25rem]">
        <header className="scroll-mt-28">
          <PageIntro
            eyebrow="About"
            title="Ravi Chandola — Automation Architecture, Programatic GenAI and SAGE"
            description="At Litera I contribute to test architecture and Programatic GenAI. I also build SAGE — an autocode layer on Cursor that connects repos to Jira-grounded flows, plus a maintenance mode for high-pressure regressions when the UI and the clock are both moving."
          />
          <div className="page-rule" aria-hidden />
        </header>

        {bio ? (
          <section
            aria-labelledby="about-summary-heading"
            className="scroll-mt-28"
          >
            <div className="relative w-full">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/25 via-border to-transparent opacity-80"
              />
              <Card className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-20%,color-mix(in_oklch,var(--accent)_14%,transparent),transparent_55%)]" />
                <CardInner className="relative space-y-10 px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
                  <div className="border-b border-border pb-6">
                    <p
                      id="about-summary-heading"
                      className="text-sm font-semibold uppercase tracking-[0.18em] text-accent sm:text-base"
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
          <section
            aria-labelledby="about-missing-bio"
            className="scroll-mt-28 marketing-dash-callout"
          >
            <p
              id="about-missing-bio"
              className="max-w-prose text-base leading-relaxed text-muted-foreground"
            >
              Profile bio not found. Run{" "}
              <code className="surface-code-inline">
                npm run db:seed
              </code>{" "}
              to load the latest summary.
            </p>
          </section>
        )}

        <section
          aria-labelledby="about-focus-heading"
          className="scroll-mt-28"
        >
          <div className={sectionPanel}>
            <div className={sectionGlow} aria-hidden />
            <div className="marketing-blur-bl" aria-hidden />

            <header className="relative mb-10 space-y-4 sm:mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent sm:text-base">
                Focus areas
              </p>
              <h2
                id="about-focus-heading"
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Where the work shows up
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
                Architecture choices, SAGE, regulated domains, and how delivery
                actually lands — the signals behind the headline.
              </p>
            </header>

            <div className="relative grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
              {highlights.map((item) => (
                <Card
                  key={item.title}
                  className="border border-border bg-card/90 dark:bg-card/80"
                >
                  <CardInner className="space-y-5 sm:space-y-6 sm:p-8 md:p-9">
                    <div className="inline-flex items-center gap-2.5 text-accent [&_svg]:h-5 [&_svg]:w-5">
                      {item.icon}
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] sm:text-[13px]">
                        Signal
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground sm:text-[17px] sm:leading-[1.65]">
                      {item.body}
                    </p>
                  </CardInner>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <AboutSkillsSection skills={skills} />

        {recommendations.length > 0 ? (
          <div className={`scroll-mt-28 ${sectionPanel}`}>
            <div className={sectionGlow} aria-hidden />
            <div className="marketing-blur-br" aria-hidden />
            <RecommendationsSection items={recommendations} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
