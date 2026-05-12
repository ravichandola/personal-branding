"use client";

import * as React from "react";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Cpu,
  FileDown,
  NotebookPen,
  Orbit,
  Radar,
  Sparkles,
  Workflow,
} from "lucide-react";

import type { JSX } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialIcons } from "@/components/layout/social-icons";
import { Separator } from "@/components/ui/separator";
import { SITE } from "@/config/site";

const FOCUS: Array<{ label: string; icon: JSX.Element }> = [
  { label: "LangGraph", icon: <Orbit aria-hidden className="h-4 w-4" strokeWidth={1.6} /> },
  { label: "Playwright", icon: <Workflow aria-hidden className="h-4 w-4" strokeWidth={1.6} /> },
  { label: "Agent QA", icon: <Radar aria-hidden className="h-4 w-4" strokeWidth={1.6} /> },
  { label: "RAG + OCR", icon: <Sparkles aria-hidden className="h-4 w-4" strokeWidth={1.6} /> },
];

export function HomeHero({ portraitUrl }: { portraitUrl?: string }) {
  const [titleIdx, setTitleIdx] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setTitleIdx(
        (previous) => (previous + 1) % SITE.heroRotatingTitles.length,
      );
    }, 4200);

    return () => window.clearInterval(id);
  }, []);

  const role =
    SITE.heroRotatingTitles[titleIdx] ?? SITE.heroRotatingTitles[0] ?? "";

  return (
    <section className="flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
      <div className="max-w-2xl space-y-8">
        <Badge tone="accent">
          <Cpu aria-hidden className="h-3.5 w-3.5" />
          Portfolio
        </Badge>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            {SITE.name}
          </h1>

          <motion.div
            key={role}
            aria-live="polite"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="flex items-center gap-3 text-lg font-semibold text-zinc-700 dark:text-zinc-300 sm:text-xl"
          >
            <span>{role}</span>
            <span
              className="hidden h-px w-10 bg-orange-600/70 sm:block dark:bg-orange-500/70"
              aria-hidden
            />
          </motion.div>

          <p className="max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Staff-level automation and AI systems: deterministic QA fleets,
            OCR-heavy platforms, LangGraph workflows, and infra that stays
            understandable under pressure.
          </p>
        </div>

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
          <Button asChild variant="ghost" size="lg">
            <Link prefetch href="/resume">
              Résumé
              <FileDown className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link prefetch href="/contact">
              Contact
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md lg:max-w-[420px] lg:shrink-0">
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50">
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

          <div className="space-y-4 border-t border-zinc-200 p-6 dark:border-zinc-800">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-400">
                Focus areas
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Production-oriented automation: Playwright estates, CI
                instrumentation, guarded agent patterns, and AWS-shaped delivery.
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

        <div className="mt-6">
          <SocialIcons align="left" />
        </div>
      </div>
    </section>
  );
}
