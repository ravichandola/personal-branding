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
  { label: "Test architecture", icon: <Cpu aria-hidden className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.6} /> },
  { label: "LangGraph", icon: <Orbit aria-hidden className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.6} /> },
  { label: "Playwright", icon: <Workflow aria-hidden className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.6} /> },
  { label: "GenAI + OCR", icon: <Sparkles aria-hidden className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.6} /> },
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
      <div className="max-w-2xl space-y-7">
        <Badge tone="accent">
          <Cpu aria-hidden className="h-3.5 w-3.5" />
          Portfolio
        </Badge>

        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:text-sm sm:tracking-[0.2em]">
            Architecture · GenAI · Development
          </p>
          <h1 className="text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-zinc-900 dark:text-white sm:text-5xl sm:leading-[1.06] lg:text-[3.5rem] lg:leading-[1.05]">
            {SITE.name}
          </h1>

          <motion.div
            key={role}
            aria-live="polite"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="flex items-center gap-3 text-xl font-medium text-zinc-700 dark:text-zinc-300 sm:text-2xl"
          >
            <span>{role}</span>
            <span
              className="hidden h-px w-12 bg-orange-600/65 sm:block dark:bg-orange-500/65"
              aria-hidden
            />
          </motion.div>

          <p className="max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl sm:leading-[1.65]">
            I contribute to automation architecture and GenAI at Litera (remote):
            Playwright/TypeScript estates and contracts-first testing. I also build
            Sage — autocode on Cursor that reads the repo, aligns flows with Jira,
            and includes a maintenance mode for brutal regressions (e.g. full UI
            rewrites on tight timelines). Long arc in legal tech, lending,
            insurance, and GSTN-scale testing — plus writing on Medium.
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
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-zinc-600 dark:text-zinc-400">
            <Link
              prefetch
              href="/resume"
              className="inline-flex items-center gap-1.5 font-medium text-zinc-700 underline decoration-zinc-300 decoration-1 underline-offset-4 transition hover:text-orange-700 hover:decoration-orange-600/50 dark:text-zinc-300 dark:decoration-zinc-600 dark:hover:text-orange-400 dark:hover:decoration-orange-500/45"
            >
              <FileDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              Résumé
            </Link>
            <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
              ·
            </span>
            <Link
              prefetch
              href="/contact"
              className="inline-flex items-center gap-1.5 font-medium text-zinc-700 underline decoration-zinc-300 decoration-1 underline-offset-4 transition hover:text-orange-700 hover:decoration-orange-600/50 dark:text-zinc-300 dark:decoration-zinc-600 dark:hover:text-orange-400 dark:hover:decoration-orange-500/45"
            >
              Contact
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
            </Link>
          </p>
        </div>
      </div>

      <div className="w-full max-w-md lg:max-w-[400px] lg:shrink-0 xl:max-w-[420px]">
        <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/60 shadow-lg shadow-zinc-900/[0.04] ring-1 ring-zinc-900/[0.03] dark:border-zinc-800 dark:bg-zinc-900/40 dark:shadow-black/30 dark:ring-white/[0.06]">
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

          <div className="space-y-4 border-t border-zinc-200/90 bg-white/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/50 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-400 sm:text-sm sm:tracking-[0.2em]">
                Focus areas
              </p>
              <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-[17px] sm:leading-[1.65]">
                Platform-shaped automation, regulated GenAI adjacent to OCR/PDF,
                and the same engineering discipline as production services.
              </p>
            </div>
            <Separator className="bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex flex-wrap gap-2">
              {FOCUS.map(({ label, icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 sm:px-4 sm:text-[15px]"
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
