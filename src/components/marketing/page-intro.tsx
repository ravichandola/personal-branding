import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: PageIntroProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <Badge tone="violet" className="px-3 py-1.5 text-xs tracking-[0.12em] sm:text-sm sm:px-3.5 sm:py-2">
        {eyebrow}
      </Badge>
      <h1 className="max-w-4xl text-balance text-[2.125rem] font-semibold leading-[1.12] tracking-tight text-zinc-900 dark:text-white sm:text-4xl sm:leading-[1.1] md:text-5xl md:leading-[1.08] lg:text-[3.25rem]">
        {title}
      </h1>
      {description ? (
        <p className="max-w-4xl text-pretty text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-xl sm:leading-[1.65]">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
