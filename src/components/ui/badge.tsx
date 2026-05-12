import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
  {
    variants: {
      tone: {
        accent:
          "border-orange-600/35 bg-orange-600/10 text-orange-800 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200",
        muted:
          "border-zinc-300 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400",
        violet:
          "border-violet-500/25 bg-violet-500/10 text-violet-800 dark:text-violet-200",
        neon:
          "border-orange-600/35 bg-orange-600/10 text-orange-800 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200",
        slate:
          "border-zinc-300 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400",
      },
    },
    defaultVariants: {
      tone: "muted",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props} />
  );
}
