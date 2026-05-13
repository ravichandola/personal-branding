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
    <section className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-14 xl:gap-20">
      <div className="max-w-2xl space-y-7 lg:pt-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center gap-4 sm:gap-5"
        >
          <div className="pointer-events-none absolute -left-6 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-orange-500/[0.12] blur-3xl dark:bg-orange-400/[0.14]" aria-hidden />
          <div className="relative flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-500/[0.14] via-white/60 to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:border-orange-400/30 dark:from-orange-400/[0.12] dark:via-zinc-900/80 dark:to-transparent dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <Cpu
              aria-hidden
              className="h-[1.35rem] w-[1.35rem] text-orange-700 dark:text-orange-400"
              strokeWidth={1.75}
            />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400/45 dark:bg-orange-300/35" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-600 shadow-sm ring-2 ring-white dark:bg-orange-500 dark:ring-zinc-950" />
            </span>
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-[13px] font-semibold leading-snug tracking-tight text-zinc-900 dark:text-white sm:text-sm">
              Automation &amp; AI — built for production reality
            </p>
            <p className="text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-500 sm:text-[13px]">
              Litera · Remote-first · Sage, fleets &amp; guarded agents
            </p>
          </div>
        </motion.div>

        <div className="space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
            Staff engineer · Automation &amp; AI
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.07]">
            {SITE.name}
          </h1>

          <motion.div
            key={role}
            aria-live="polite"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="flex items-center gap-3 text-lg font-medium text-zinc-700 dark:text-zinc-300 sm:text-xl"
          >
            <span>{role}</span>
            <span
              className="hidden h-px w-12 bg-orange-600/65 sm:block dark:bg-orange-500/65"
              aria-hidden
            />
          </motion.div>

          <p className="max-w-xl text-[17px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Staff-level automation and AI systems: deterministic QA fleets,
            OCR-heavy platforms, LangGraph workflows, and infra that stays
            understandable under pressure.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              variant="primary"
              className="shadow-md shadow-orange-900/15 dark:shadow-orange-950/40"
            >
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
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-500">
            <Link
              prefetch
              href="/contact"
              className="inline-flex items-center gap-1.5 font-medium text-zinc-700 underline decoration-zinc-300 decoration-1 underline-offset-4 transition hover:text-orange-700 hover:decoration-orange-600/50 dark:text-zinc-300 dark:decoration-zinc-600 dark:hover:text-orange-400 dark:hover:decoration-orange-500/45"
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
        <div className="rounded-2xl bg-gradient-to-br from-orange-500/35 via-zinc-200/50 to-transparent p-[1px] shadow-lg shadow-zinc-900/[0.06] dark:from-orange-500/25 dark:via-zinc-700/35 dark:to-transparent dark:shadow-black/40">
          <div className="overflow-hidden rounded-[calc(1rem-1px)] border border-zinc-200/90 bg-white/70 shadow-inner shadow-white/40 ring-1 ring-zinc-900/[0.02] dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none dark:ring-white/[0.04]">
          <div className="relative aspect-[4/5] bg-zinc-200 dark:bg-zinc-900">
            {portraitUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`${SITE.name} portrait`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                src={portraitUrl}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-300 via-zinc-200 to-zinc-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-950" />
            )}
          </div>

          <div className="space-y-4 border-t border-zinc-200/90 bg-white/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-400">
                Focus areas
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Production-oriented automation: Playwright estates, CI
                instrumentation, guarded agent patterns, and AWS-shaped
                delivery.
              </p>
            </div>
            <Separator className="bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex flex-wrap gap-2">
              {FOCUS.map(({ label, icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
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
