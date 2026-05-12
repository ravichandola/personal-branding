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
    <div className="space-y-6">
      <Badge tone="violet">{eyebrow}</Badge>
      <h1 className="text-[2.92rem] font-semibold tracking-[-0.05em] text-white md:text-[3.45rem]">
        {title}
      </h1>
      {description ? (
        <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
