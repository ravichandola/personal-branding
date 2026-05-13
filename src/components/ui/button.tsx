import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-tight transition-colors active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",

  {
    variants: {
      variant: {
        primary:
          "border border-transparent bg-accent text-accent-foreground shadow-sm shadow-accent/25 hover:bg-accent-hover",
        secondary:
          "border border-border bg-muted/50 text-foreground hover:bg-muted",
        outline:
          "border border-border bg-background/80 text-foreground hover:bg-muted",
        ghost:
          "border-transparent text-foreground hover:bg-muted",
        /** @deprecated use `primary` — alias for older call sites */
        glow:
          "border border-transparent bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover",
        glass:
          "border border-border bg-muted/40 text-foreground hover:bg-muted/70",
        muted:
          "border border-border bg-muted text-foreground hover:bg-muted/80",
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
