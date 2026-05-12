import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "glass-panel min-h-[120px] w-full resize-y rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm outline-none backdrop-blur-2xl transition focus-visible:ring-2 focus-visible:ring-cyan-400/40 disabled:opacity-35",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
