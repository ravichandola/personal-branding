"use client";

import * as React from "react";

import { Laptop, Moon, SunMedium } from "lucide-react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

type Presentation = "icon" | "full";

const modes = ["dark", "light", "system"] as const;

type Palette = (typeof modes)[number];

export function ThemeToggle({
  presentation = "icon",
  compact = false,
}: {
  presentation?: Presentation;
  /** Smaller square control for dense header chrome (e.g. FM-style bar). */
  compact?: boolean;
}) {
  const { theme = "dark", resolvedTheme = "dark", setTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        type="button"
        size="icon"
        variant="muted"
        className={cn(
          compact
            ? "h-8 w-8 shrink-0 rounded-md border-zinc-200/90 bg-white p-0 text-zinc-500 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900 dark:text-zinc-400"
            : "rounded-2xl",
        )}
        aria-label="Cycle appearance"
      >
        <Moon className={compact ? "h-4 w-4" : "h-6 w-6"} aria-hidden />
      </Button>
    );
  }

  const palette: Palette = modes.includes(theme as Palette)
    ? (theme as Palette)
    : "dark";

  const index = modes.indexOf(palette);
  const next = modes[(index + 1) % modes.length] ?? palette;

  const glyph =
    palette === "light" ? (
      <SunMedium aria-hidden strokeWidth={1.55} />
    ) : palette === "system" ? (
      <Laptop aria-hidden strokeWidth={1.55} />
    ) : (
      <Moon aria-hidden strokeWidth={1.55} />
    );

  return (
    <Button
      type="button"
      size={presentation === "full" ? "md" : "icon"}
      variant="muted"
      className={cn(
        compact &&
          "h-8 w-8 shrink-0 rounded-md border-zinc-200/90 bg-white p-0 text-zinc-500 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white",
        !compact && presentation === "icon" && "rounded-2xl px-5",
        !compact && presentation === "full" && "rounded-xl px-6",
      )}
      aria-label={`Switch to ${next} theme (accent ${resolvedTheme})`}
      onClick={() => setTheme(next)}
    >
      <span
        aria-hidden
        className={cn(compact && "[&_svg]:h-4 [&_svg]:w-4")}
      >
        {glyph}
      </span>
      {presentation === "full" ? (
        <span className="text-[13px] font-semibold capitalize">{theme}</span>
      ) : null}
    </Button>
  );
}
