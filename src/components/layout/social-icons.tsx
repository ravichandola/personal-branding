"use client";

import Link from "next/link";

import type { JSX } from "react";
import { Globe, Newspaper } from "lucide-react";

import { SITE } from "@/config/site";

import { cn } from "@/lib/utils";

type SocialIconsProps = {
  condensed?: boolean;
  align?: "left" | "center";
};

const tileClass =
  "grid h-9 w-9 place-items-center rounded-lg border border-zinc-300 bg-white text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/80";

export function SocialIcons({
  condensed: _condensed,
  align = "left",
}: SocialIconsProps) {
  void _condensed;

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
          <IconGitHub className="h-5 w-5" />
          <span className="sr-only">GitHub organization</span>
        </>
      ),
    },
    {
      aria: "Read Medium articles",
      href: SITE.urls.medium,
      content: (
        <>
          <Newspaper className="h-5 w-5" aria-hidden />
          <span className="sr-only">Medium</span>
        </>
      ),
    },
    {
      aria: "Connect on LinkedIn",
      href: SITE.urls.linkedin,
      content: (
        <>
          <IconLinkedIn aria-hidden />
          <span className="sr-only">LinkedIn</span>
        </>
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
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
        <Globe aria-hidden className="h-5 w-5" strokeWidth={1.6} />
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

function IconLinkedIn({ ...props }: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      {...props}
      aria-hidden
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
    >
      <rect height="11" rx="2" width="13" x="9" y="9" />
      <path d="M5 22V10" />
      <path d="M2 22h18" />
      <circle cx="5.5" cy="5.5" r="2.75" />
    </svg>
  );
}
