"use client";

import Link from "next/link";

import type { JSX, SVGProps } from "react";
import { Globe } from "lucide-react";

import { SITE } from "@/config/site";

import { cn } from "@/lib/utils";

type SocialIconsProps = {
  condensed?: boolean;
  align?: "left" | "center";
  /** Compact tiles for sticky header (FM-style dark chrome). */
  surface?: "default" | "header";
};

export function SocialIcons({
  condensed: _condensed,
  align = "left",
  surface = "default",
}: SocialIconsProps) {
  void _condensed;

  const tileClass =
    surface === "header"
      ? "grid h-8 w-8 place-items-center rounded-md border border-border bg-background/70 text-muted-foreground shadow-none transition-colors hover:border-accent/35 hover:bg-muted hover:text-foreground dark:bg-transparent"
      : "grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-accent/30 hover:bg-muted hover:text-foreground";

  const iconSm = surface === "header" ? "h-[15px] w-[15px]" : "h-5 w-5";

  const tiles: Array<{
    aria: string;
    href: string;
    content: JSX.Element;
  }> = [
    {
      aria: "Explore GitHub organization Avengers",
      href: SITE.urls.githubRepos,
      content: (
        <>
          <IconGitHub className={iconSm} />
          <span className="sr-only">GitHub organization</span>
        </>
      ),
    },
    {
      aria: "Read Medium articles",
      href: SITE.urls.medium,
      content: (
        <>
          <IconMedium className={iconSm} aria-hidden />
          <span className="sr-only">Medium</span>
        </>
      ),
    },
    {
      aria: "Connect on LinkedIn",
      href: SITE.urls.linkedin,
      content: (
        <>
          <IconLinkedIn className={iconSm} aria-hidden />
          <span className="sr-only">LinkedIn</span>
        </>
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5",
        surface === "header" ? "gap-1.5" : "gap-2",
        align === "center" && "justify-center",
      )}
    >
      {tiles.map((tile) => (
        <Link
          prefetch={false}
          aria-label={tile.aria}
          title={tile.aria}
          href={tile.href}
          target="_blank"
          key={tile.href}
          rel="noopener noreferrer"
          className={tileClass}
        >
          {tile.content}
        </Link>
      ))}

      <Link
        href={SITE.urls.githubProfile}
        prefetch={false}
        aria-label="GitHub profile homepage"
        title="GitHub profile homepage"
        target="_blank"
        rel="noopener noreferrer"
        className={tileClass}
      >
        <Globe aria-hidden className={iconSm} strokeWidth={1.6} />
        <span className="sr-only">Personal GitHub</span>
      </Link>
    </div>
  );
}

function IconGitHub({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
    >
      <path d="M9 19c-4.5 1.5-4.5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 4.77 5.07 5.07 0 0 0 17.91 1S16.73.65 14 2.48a13.38 13.38 0 0 0-7 0C4.27.65 3.09 1 3.09 1A5.07 5.07 0 0 0 3 4.72a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V21" />
    </svg>
  );
}

/** LinkedIn “in” mark (monochrome; Simple Icons–style path, viewBox 0 0 24 24). */
function IconLinkedIn({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...rest}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** Medium wordmark circles (monochrome; Simple Icons–style path). */
function IconMedium({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...rest}
    >
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.84 5.74-1.88 5.74-1.03 0-1.87-2.57-1.87-5.74S21.14 6.26 22.17 6.26 24 8.83 24 12z" />
    </svg>
  );
}
