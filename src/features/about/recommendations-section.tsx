import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";

import { SITE } from "@/config/site";
import type { Testimonial } from "@/generated/prisma";

import { Card, CardInner } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function formatWrittenAt(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function RecommendationsSection({
  items,
  className,
}: {
  items: Testimonial[];
  className?: string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="recommendations-heading"
      className={cn("space-y-8 sm:space-y-10", className)}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-400 sm:text-base">
            Social proof
          </p>
          <h2
            id="recommendations-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl"
          >
            Recommendations
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg sm:leading-[1.65]">
            What managers and teammates have said on LinkedIn: automation depth,
            learning appetite, and how it feels to ship together.
          </p>
        </div>
        <Link
          href={SITE.urls.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-orange-700 underline-offset-4 hover:underline dark:text-orange-400 sm:text-base"
        >
          Full list on LinkedIn
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {items.map((item) => {
          const writtenLabel = formatWrittenAt(item.writtenAt);
          return (
            <Card
              key={item.id}
              className="border-zinc-200/95 bg-white/90 dark:border-zinc-800 dark:bg-zinc-950/80"
            >
              <CardInner className="space-y-4 sm:space-y-5 sm:p-8 md:p-9">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <p className="text-lg font-semibold leading-snug text-zinc-900 dark:text-white sm:text-xl">
                      {item.author}
                    </p>
                    {item.role ? (
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-[15px]">
                        {item.role}
                      </p>
                    ) : null}
                  </div>
                  <Quote
                    className="h-5 w-5 shrink-0 text-orange-600/80 dark:text-orange-400/90"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-500 sm:text-[13px]">
                  {writtenLabel ? <span>{writtenLabel}</span> : null}
                  {item.relationship ? (
                    <span className="text-zinc-500 dark:text-zinc-500">
                      {item.relationship}
                    </span>
                  ) : null}
                </div>
                <blockquote className="border-l-2 border-orange-500/50 pl-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-[17px] sm:leading-[1.65]">
                  <p className="whitespace-pre-line">{item.quote}</p>
                </blockquote>
              </CardInner>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
