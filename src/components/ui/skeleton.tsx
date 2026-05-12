import * as React from "react";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/[0.08] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
