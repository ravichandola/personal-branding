"use client";

import * as React from "react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SocialIcons } from "@/components/layout/social-icons";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
  { label: "Research", href: "/research" },
  { label: "Architecture", href: "/architecture" },
  { label: "Playground", href: "/playground" },
  { label: "AI Assistant", href: "/assistant" },
] as const;

/** Shown inline in the header — keeps one clean row on typical laptop widths. */
const MORE_HREFS = new Set<string>([
  "/research",
  "/architecture",
  "/playground",
  "/assistant",
]);

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function SiteNavbar({ brandSubtitle }: { brandSubtitle?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const primaryLinks = navLinks.filter(
    (link) => link.href !== "/" && !MORE_HREFS.has(link.href),
  );
  const moreLinks = navLinks.filter((link) => MORE_HREFS.has(link.href));
  const moreHasActive = moreLinks.some((link) => isActive(pathname, link.href));

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-[80] border-b border-zinc-200/80 bg-[#fafaf9]/95 backdrop-blur-md dark:border-zinc-800 dark:bg-[#0c0d10]/95">
      {/* Three-column grid: brand | nav (min-w-0) | actions — stops flex overlap */}
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:justify-items-stretch lg:gap-x-4 lg:gap-y-0 lg:px-6 lg:py-3.5 xl:gap-x-6">
        <Link
          href="/"
          className="relative z-10 flex w-max max-w-full flex-col gap-1 leading-tight"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 sm:text-[11px] sm:tracking-[0.18em]">
            Staff engineer · Automation &amp; AI
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-base">
            <span className="block sm:inline">Ravi Chandola</span>
            {brandSubtitle ? (
              <span className="mt-0.5 block text-xs font-normal text-zinc-500 sm:ml-1.5 sm:mt-0 sm:inline sm:text-base dark:text-zinc-400">
                {brandSubtitle}
              </span>
            ) : null}
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="relative z-0 hidden min-w-0 justify-self-stretch lg:block"
        >
          <div className="flex w-full max-w-full justify-center overflow-x-auto overscroll-x-contain px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="inline-flex w-max max-w-full flex-none flex-nowrap items-center justify-center gap-0.5 sm:gap-1">
              {primaryLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href} className="shrink-0">
                    <Link
                      href={link.href}
                      className={cn(
                        "block whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:px-2.5 sm:text-[13px] dark:text-zinc-400 dark:hover:text-white",
                        active &&
                          "bg-zinc-200/90 text-zinc-900 dark:bg-zinc-800 dark:text-white",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              <li className="shrink-0">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-0.5 whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] font-medium text-zinc-600 outline-none transition-colors hover:text-zinc-900 sm:px-2.5 sm:text-[13px] dark:text-zinc-400 dark:hover:text-white",
                        moreHasActive &&
                          "bg-zinc-200/90 text-zinc-900 dark:bg-zinc-800 dark:text-white",
                      )}
                    >
                      More
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={8}
                      className="z-[100] min-w-[200px] rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      {moreLinks.map((link) => {
                        const active = isActive(pathname, link.href);
                        return (
                          <DropdownMenu.Item key={link.href} asChild>
                            <Link
                              href={link.href}
                              className={cn(
                                "flex cursor-pointer rounded-md px-3 py-2 text-[13px] font-medium text-zinc-800 outline-none hover:bg-zinc-100 data-[highlighted]:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:data-[highlighted]:bg-zinc-800",
                                active &&
                                  "bg-orange-50 text-orange-900 dark:bg-orange-950/40 dark:text-orange-100",
                              )}
                            >
                              {link.label}
                            </Link>
                          </DropdownMenu.Item>
                        );
                      })}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </li>
            </ul>
          </div>
        </nav>

        <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:justify-self-end">
          <div className="hidden items-center 2xl:flex">
            <SocialIcons condensed />
          </div>
          <ThemeToggle />

          <Button
            asChild
            size="md"
            variant="primary"
            className="hidden shrink-0 sm:inline-flex"
          >
            <Link href="/contact" prefetch className="gap-1.5">
              <span className="hidden lg:inline">Get in touch</span>
              <span className="lg:hidden">Contact</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </Button>

          <Separator
            orientation="vertical"
            decorative
            className="hidden h-8 bg-zinc-200 dark:bg-zinc-800 sm:block lg:hidden"
          />

          <Button
            type="button"
            size="icon"
            variant="outline"
            className="lg:hidden"
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
            className="border-t border-zinc-200 dark:border-zinc-800 lg:hidden"
          >
            <div className="mx-auto max-h-[min(70vh,520px)] max-w-6xl overflow-y-auto px-4 py-4 sm:px-5">
              <p className="mb-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                Navigate
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg border border-zinc-200 px-3 py-2.5 text-[13px] font-medium text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80",
                      isActive(pathname, link.href) &&
                        "border-orange-600/40 bg-orange-50 dark:border-orange-500/35 dark:bg-orange-950/30",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Separator className="my-4 bg-zinc-200 dark:bg-zinc-800" />
              <SocialIcons condensed={false} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
