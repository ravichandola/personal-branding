"use client";

import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SocialIcons } from "@/components/layout/social-icons";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About me", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
] as const;

const navLinkClass = (active: boolean) =>
  cn(
    "relative block whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium tracking-[-0.01em] transition-colors sm:px-2.5 sm:text-[15px]",
    "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50",
    active &&
      "text-zinc-900 after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:rounded-full after:bg-orange-600 dark:text-white dark:after:bg-orange-500",
  );

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function SiteNavbar({ brandSubtitle }: { brandSubtitle?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const primaryLinks = navLinks.filter((link) => link.href !== "/");

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-[80] w-full border-b border-zinc-200/85 bg-[#fafaf9]/92 backdrop-blur-xl supports-[backdrop-filter]:backdrop-saturate-150 dark:border-zinc-800/90 dark:bg-zinc-950/96 dark:supports-[backdrop-filter]:backdrop-saturate-150">
      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3.5 sm:px-5 lg:flex-nowrap lg:gap-x-4 lg:px-8 lg:py-4 xl:gap-x-6">
        <Link
          href="/"
          className="relative z-10 flex min-w-0 max-w-[min(100%,22rem)] shrink-0 flex-col gap-0.5 leading-tight sm:max-w-none"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400 sm:text-xs sm:tracking-[0.2em]">
            Automation architecture · GenAI · Legal tech
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg lg:text-xl">
            <span className="block sm:inline">Ravi Chandola</span>
            {brandSubtitle ? (
              <span className="mt-0.5 block text-xs font-normal text-zinc-500 sm:ml-1.5 sm:mt-0 sm:inline sm:text-[15px] dark:text-zinc-400">
                {brandSubtitle}
              </span>
            ) : null}
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="relative z-0 hidden min-w-0 flex-1 items-center justify-center px-1 lg:flex"
        >
          <ul className="flex max-w-full flex-wrap items-center justify-center gap-x-0.5 gap-y-1 sm:gap-x-1">
            {primaryLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href} className="shrink-0">
                  <Link
                    href={link.href}
                    className={navLinkClass(active)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          <div className="hidden items-center lg:flex">
            <SocialIcons surface="header" />
          </div>
          <ThemeToggle compact />

          <Link
            href="/about"
            prefetch
            className={cn(
              navLinkClass(isActive(pathname, "/about")),
              "hidden shrink-0 sm:inline-flex lg:hidden",
            )}
          >
            About me
          </Link>

          <Link
            href="/contact"
            prefetch
            className={cn(
              navLinkClass(isActive(pathname, "/contact")),
              "hidden shrink-0 sm:inline-flex lg:hidden",
            )}
          >
            Contact
          </Link>

          <Separator
            orientation="vertical"
            decorative
            className="hidden h-8 bg-zinc-200 dark:bg-zinc-800 sm:block lg:hidden"
          />

          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-9 w-9 shrink-0 rounded-md border-zinc-300 bg-white lg:hidden dark:border-zinc-700 dark:bg-zinc-950"
            onClick={() => setOpen((previous) => !previous)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-zinc-200 bg-[#fafaf9]/98 dark:border-zinc-800 dark:bg-zinc-950/98 lg:hidden"
          >
            <div className="mx-auto max-h-[min(70vh,520px)] max-w-7xl overflow-y-auto px-4 py-4 sm:px-5 lg:px-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400 sm:text-[13px]">
                Navigate
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg border border-zinc-200/90 bg-white px-3 py-3 text-[15px] font-medium text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
                      isActive(pathname, link.href) &&
                        "border-orange-600/45 bg-orange-50 dark:border-orange-500/35 dark:bg-orange-950/35",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Separator className="my-4 bg-zinc-200 dark:bg-zinc-800" />
              <SocialIcons align="center" surface="header" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
