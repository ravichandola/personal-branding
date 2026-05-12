import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "glass-panel flex h-10 w-full rounded-xl border border-white/10 bg-black/35 px-3 text-sm outline-none backdrop-blur-2xl transition focus-visible:ring-2 focus-visible:ring-cyan-400/40 disabled:opacity-35",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
