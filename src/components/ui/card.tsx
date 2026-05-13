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
        "relative isolate overflow-hidden rounded-xl border border-border bg-card shadow-sm backdrop-blur-sm",
        glow && "ring-1 ring-accent/20 dark:ring-accent/25",
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
