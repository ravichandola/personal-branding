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
        "relative mt-24 overflow-hidden border-t border-border",
        "bg-gradient-to-b from-background via-muted/30 to-muted/50",
        "dark:border-border dark:from-background dark:via-background dark:to-muted/80",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent dark:via-accent/35"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-accent/[0.06] blur-3xl dark:bg-accent/[0.09]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-40 h-64 w-64 rounded-full bg-violet-500/[0.04] blur-3xl dark:bg-violet-500/[0.07]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-5 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              Portfolio
            </p>
            <h2 className="mt-4 max-w-md text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem] sm:leading-snug">
              {SITE.name}
              <span className="mt-2 block text-base font-normal leading-snug text-muted-foreground">
                Automation architecture, QA at scale, and pragmatic AI for real
                production systems.
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {SITE.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {!onContact ? (
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-xl border border-accent bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-hover"
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
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-card-foreground shadow-sm transition hover:bg-muted"
              >
                View selected work
              </Link>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4 lg:gap-8">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Navigate
              </h3>
              <ul className="mt-4 space-y-2.5" role="list">
                {navColA.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "inline-flex text-sm font-medium text-muted-foreground transition hover:text-accent",
                        pathname === link.href && "text-accent",
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
                        "inline-flex text-sm font-medium text-muted-foreground transition hover:text-accent",
                        pathname === link.href && "text-accent",
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
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm dark:shadow-none">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Elsewhere
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Writing, open source, and professional presence.
              </p>
              <div className="mt-5">
                <SocialIcons />
              </div>
            </div>

            <figure className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/60 p-6 dark:from-card dark:to-muted/30">
              <blockquote className="text-sm font-medium leading-relaxed text-card-foreground">
                &ldquo;Async-first, clear written specs, tight review
                loops.&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                How I work
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground"
          >
            {FOOTER_QUICK.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-foreground"
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
