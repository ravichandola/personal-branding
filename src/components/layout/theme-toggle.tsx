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
}: {
  presentation?: Presentation;
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
        className="rounded-2xl"
        aria-label="Cycle appearance"
      >
        <Moon className="h-6 w-6" aria-hidden />
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
        presentation === "icon" ? "rounded-2xl px-5" : "rounded-xl px-6",
      )}
      aria-label={`Switch to ${next} theme (accent ${resolvedTheme})`}
      onClick={() => setTheme(next)}
    >
      <span aria-hidden>{glyph}</span>
      {presentation === "full" ? (
        <span className="text-[13px] font-semibold capitalize">{theme}</span>
      ) : null}
    </Button>
  );
}
