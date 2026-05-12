"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { navLinks } from "@/components/layout/site-navbar";
import { SocialIcons } from "@/components/layout/social-icons";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

/** Bottom bar — avoid duplicating primary CTAs already in the nav. */
const FOOTER_QUICK = [
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const onContact = pathname === "/contact";

  const allPages = navLinks.filter((l) => l.href !== "/");
  const mid = Math.ceil(allPages.length / 2);
  const navColA = allPages.slice(0, mid);
  const navColB = allPages.slice(mid);

  return (
    <footer
      className={cn(
        "relative mt-24 overflow-hidden border-t border-zinc-200/90",
        "bg-gradient-to-b from-zinc-50 via-zinc-100/80 to-zinc-100",
        "dark:border-white/[0.07] dark:from-[#0c0d10] dark:via-zinc-950/95 dark:to-[#08090b]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/45 to-transparent dark:via-orange-400/35"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-orange-500/[0.06] blur-3xl dark:bg-orange-500/[0.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-40 h-64 w-64 rounded-full bg-violet-500/[0.04] blur-3xl dark:bg-violet-500/[0.07]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-5 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700 dark:text-orange-400">
              Portfolio
            </p>
            <h2 className="mt-4 max-w-md text-balance text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-[1.75rem] sm:leading-snug">
              {SITE.name}
              <span className="mt-2 block text-base font-normal leading-snug text-zinc-600 dark:text-zinc-400">
                Automation architecture, QA at scale, and pragmatic AI for real
                production systems.
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              {SITE.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {!onContact ? (
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-xl border border-orange-700 bg-orange-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-orange-800 hover:bg-orange-800 dark:border-orange-600 dark:bg-orange-600 dark:hover:border-orange-500 dark:hover:bg-orange-500"
                >
                  Start a conversation
                  <ArrowUpRight
                    className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </Link>
              ) : null}
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white/80 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-400 hover:bg-white dark:border-zinc-600 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800/80"
              >
                View selected work
              </Link>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4 lg:gap-8">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                Navigate
              </h3>
              <ul className="mt-4 space-y-2.5" role="list">
                {navColA.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "inline-flex text-sm font-medium text-zinc-700 transition hover:text-orange-700 dark:text-zinc-300 dark:hover:text-orange-400",
                        pathname === link.href &&
                          "text-orange-700 dark:text-orange-400",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="sr-only">More pages</h3>
              <ul className="mt-4 space-y-2.5" role="list">
                {navColB.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "inline-flex text-sm font-medium text-zinc-700 transition hover:text-orange-700 dark:text-zinc-300 dark:hover:text-orange-400",
                        pathname === link.href &&
                          "text-orange-700 dark:text-orange-400",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-3">
            <div className="rounded-2xl border border-zinc-200/90 bg-white/70 p-6 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-none">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                Elsewhere
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Writing, open source, and professional presence.
              </p>
              <div className="mt-5">
                <SocialIcons />
              </div>
            </div>

            <figure className="rounded-2xl border border-zinc-200/90 bg-gradient-to-br from-white/90 to-zinc-50/90 p-6 dark:border-white/[0.08] dark:from-white/[0.04] dark:to-transparent">
              <blockquote className="text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
                &ldquo;Async-first, clear written specs, tight review
                loops.&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
                How I work
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-zinc-200/90 pt-8 dark:border-white/[0.07] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            {FOOTER_QUICK.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-zinc-900 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
