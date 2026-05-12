import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { SITE } from "@/config/site";

import { SocialIcons } from "@/components/layout/social-icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-zinc-200 bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-400">
              Let&apos;s build something solid
            </p>
            <h2 className="max-w-lg text-balance text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Automation architecture, QA at scale, and pragmatic AI for real
              production systems.
            </h2>
            <p className="max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              {SITE.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-orange-700 bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-800 dark:border-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500"
              >
                Contact
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-200/80 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800/80"
              >
                View work
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Elsewhere
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Writing, code, and professional updates.
              </p>
              <div className="mt-5">
                <SocialIcons />
              </div>
            </div>
            <dl className="grid gap-3 text-sm">
              <div className="rounded-lg border border-zinc-200 bg-white/60 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/30">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  How I work
                </dt>
                <dd className="mt-1.5 text-zinc-800 dark:text-zinc-200">
                  Async-first, clear written specs, tight review loops.
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-zinc-200 pt-8 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500 sm:flex-row sm:items-center">
          <p>© {year} Ravi Chandola. All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 font-medium text-zinc-600 dark:text-zinc-400">
            <Link className="hover:text-zinc-900 dark:hover:text-white" href="/architecture">
              Architecture
            </Link>
            <Link className="hover:text-zinc-900 dark:hover:text-white" href="/playground">
              Playground
            </Link>
            <Link className="hover:text-zinc-900 dark:hover:text-white" href="/assistant">
              Assistant
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
