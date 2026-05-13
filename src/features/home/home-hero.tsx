"use client";

import * as React from "react";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Cpu,
  NotebookPen,
  Orbit,
  Radar,
  Sparkles,
  Workflow,
} from "lucide-react";

import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { SocialIcons } from "@/components/layout/social-icons";
import { Separator } from "@/components/ui/separator";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const FOCUS: Array<{ label: string; icon: JSX.Element }> = [
  {
    label: "LangGraph",
    icon: <Orbit aria-hidden className="h-4 w-4" strokeWidth={1.6} />,
  },
  {
    label: "Playwright",
    icon: <Workflow aria-hidden className="h-4 w-4" strokeWidth={1.6} />,
  },
  {
    label: "Agent QA",
    icon: <Radar aria-hidden className="h-4 w-4" strokeWidth={1.6} />,
  },
  {
    label: "RAG + OCR",
    icon: <Sparkles aria-hidden className="h-4 w-4" strokeWidth={1.6} />,
  },
];

export function HomeHero({
  portraitUrl,
  heroTitles,
}: {
  portraitUrl?: string;
  heroTitles?: string[];
}) {
  const titles =
    heroTitles && heroTitles.length > 0 ? heroTitles : SITE.heroRotatingTitles;

  const [titleIdx, setTitleIdx] = React.useState(0);

  const titlesKey = titles.join("\n");

  React.useEffect(() => {
    setTitleIdx(0);
  }, [titlesKey]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setTitleIdx((previous) => (previous + 1) % titles.length);
    }, 4200);

    return () => window.clearInterval(id);
  }, [titles.length, titlesKey]);

  const role = titles[titleIdx] ?? titles[0] ?? "";

  return (
    <section className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
      <div className="max-w-2xl space-y-7 lg:pt-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center gap-4 sm:gap-5"
        >
          <div
            className="pointer-events-none absolute -left-6 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl dark:bg-accent/8"
            aria-hidden
          />
          <div className="relative flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-2xl border border-accent/35 bg-muted/80 shadow-[inset_0_1px_0_color-mix(in_oklch,var(--foreground)_8%,transparent)] dark:border-accent/30 dark:bg-card dark:shadow-[inset_0_1px_0_color-mix(in_oklch,var(--foreground)_6%,transparent)]">
            <Cpu
              aria-hidden
              className="h-[1.35rem] w-[1.35rem] text-accent"
              strokeWidth={1.75}
            />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-[13px] font-medium leading-snug tracking-tight text-foreground/90 sm:text-sm">
              Automation &amp; AI — built for production reality
            </p>
            <p className="text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]">
              Litera · Remote-first · Sage, fleets &amp; guarded agents
            </p>
          </div>
        </motion.div>

        <div className="space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Staff engineer · Automation &amp; AI
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.06] xl:text-[3.4rem]">
            {SITE.name}
          </h1>

          <motion.div
            key={role}
            aria-live="polite"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="flex items-center gap-3 text-lg font-medium text-foreground sm:text-xl"
          >
            <span>{role}</span>
            <span
              className="hidden h-px w-12 bg-accent/80 sm:block"
              aria-hidden
            />
          </motion.div>

          <p className="max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            Staff-level automation and AI systems: deterministic QA fleets,
            OCR-heavy platforms, LangGraph workflows, and infra that stays
            understandable under pressure.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="primary">
              <Link prefetch href="/projects">
                Browse projects
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link prefetch href="/blogs">
                Articles
                <NotebookPen className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <Link
              prefetch
              href="/contact"
              className="inline-flex items-center gap-1.5 font-medium text-foreground/90 underline decoration-border decoration-1 underline-offset-4 transition hover:text-accent hover:decoration-accent/50"
            >
              Contact
              <ArrowUpRight
                className="h-3.5 w-3.5 shrink-0 opacity-80"
                aria-hidden
              />
            </Link>
          </p>
        </div>
      </div>

      <div className="w-full max-w-md lg:max-w-[400px] lg:shrink-0 xl:max-w-[420px]">
        <div
          className={cn(
            "rounded-2xl shadow-lg shadow-foreground/[0.04]",
            "bg-gradient-to-br from-accent/35 via-muted/70 to-transparent p-px dark:from-accent/22 dark:to-transparent dark:via-transparent",
          )}
        >
          <div className="overflow-hidden rounded-[calc(1rem-1px)] border border-card-border bg-card/95 backdrop-blur-sm dark:bg-card/90">
          <div className="relative aspect-[4/5] bg-muted">
            {portraitUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`${SITE.name} portrait`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                src={portraitUrl}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted to-background" />
            )}
          </div>

          <div className="space-y-4 border-t border-card-border bg-card p-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Focus areas
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Production-oriented automation: Playwright estates, CI
                instrumentation, guarded agent patterns, and AWS-shaped
                delivery.
              </p>
            </div>
            <Separator className="bg-border" />
            <div className="flex flex-wrap gap-2">
              {FOCUS.map(({ label, icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-card-foreground backdrop-blur-sm dark:bg-muted/40"
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </div>
          </div>
        </div>

        <div className="mt-6">
          <SocialIcons align="left" />
        </div>
      </div>
    </section>
  );
}
