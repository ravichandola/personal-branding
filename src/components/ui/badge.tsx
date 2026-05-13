import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
  {
    variants: {
      tone: {
        accent:
          "border-accent/35 bg-accent/10 text-foreground dark:text-foreground",
        muted:
          "border-border bg-muted text-muted-foreground",
        violet:
          "border-violet-500/25 bg-violet-500/10 text-violet-800 dark:text-violet-200",
        neon:
          "border-accent/35 bg-accent/10 text-foreground dark:text-foreground",
        slate:
          "border-border bg-muted text-muted-foreground",
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
