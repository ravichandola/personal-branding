import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-tight transition-colors active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600/45 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:focus-visible:ring-orange-500/45 dark:focus-visible:ring-offset-zinc-950",

  {
    variants: {
      variant: {
        primary:
          "border border-orange-700 bg-orange-700 text-white hover:bg-orange-800 dark:border-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500",
        secondary:
          "border border-zinc-300 bg-transparent text-zinc-800 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800/80",
        outline:
          "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-zinc-800/60",
        ghost:
          "border-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800/60",
        /** @deprecated use `primary` — alias for older call sites */
        glow:
          "border border-orange-700 bg-orange-700 text-white hover:bg-orange-800 dark:border-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500",
        glass:
          "border border-zinc-200/80 bg-zinc-100/60 text-zinc-900 hover:bg-zinc-200/70 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:bg-zinc-800/70",
        muted:
          "border border-zinc-200 bg-zinc-100 text-zinc-800 hover:bg-zinc-200/90 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
      },
      size: {
        sm: "h-9 px-3 text-[13px]",
        md: "h-10 px-4",
        lg: "h-11 px-5 text-[15px]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref as never}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
