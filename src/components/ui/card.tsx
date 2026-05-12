import * as React from "react";

import { cn } from "@/lib/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative isolate overflow-hidden rounded-xl border border-zinc-200/90 bg-white/70 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/35",
        glow && "ring-1 ring-orange-600/15 dark:ring-orange-500/20",
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = "Card";

export { Card };

export const CardInner = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "relative rounded-[inherit] bg-transparent p-6 sm:p-8",
      className,
    )}
    {...props}
  />
);
