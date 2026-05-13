import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ExperienceRow = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  summary: string;
  achievements: string[];
  technologies: string[];
};

function formatRange(start: Date, end: Date | null) {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
  };
  const a = start.toLocaleDateString(undefined, opts);
  const b = end ? end.toLocaleDateString(undefined, opts) : "Present";
  return `${a} — ${b}`;
}

const spineX = "left-[17px] sm:left-[19px]";

export function ExperienceTimeline({ items }: { items: ExperienceRow[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="relative z-[1] pb-2">
      <div
        aria-hidden
        className={cn(
          "absolute bottom-10 top-4 w-[3px] rounded-full bg-gradient-to-b from-orange-500 via-orange-400/35 to-transparent opacity-75 blur-[1px] dark:from-orange-400 dark:via-orange-400/25 dark:opacity-90",
          spineX,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute bottom-10 top-4 w-px bg-gradient-to-b from-orange-500/95 from-[5%] via-zinc-300/85 to-transparent dark:via-zinc-600/90",
          spineX,
        )}
      />

      <ol className="relative space-y-9 sm:space-y-11">
        {items.map((job) => {
          const isPresent = job.endDate == null;

          return (
            <li key={job.id} className="group relative pl-11 sm:pl-14">
              <span
                aria-hidden
                className={cn(
                  spineX,
                  "absolute top-[15px] z-[2] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[2.5px] border-orange-600 bg-[var(--fm-bg)] shadow-[0_0_0_5px_rgba(234,88,12,0.12),0_0_14px_rgba(234,88,12,0.28)] transition-[box-shadow,transform] duration-300 dark:border-orange-400 dark:shadow-[0_0_0_5px_rgba(249,115,22,0.14),0_0_18px_rgba(249,115,22,0.28)] sm:top-4 sm:h-4 sm:w-4",
                  isPresent &&
                    "ring-2 ring-orange-400/40 dark:ring-orange-400/35 group-hover:scale-110 group-hover:shadow-[0_0_0_6px_rgba(234,88,12,0.18),0_0_22px_rgba(234,88,12,0.38)] dark:group-hover:shadow-[0_0_0_6px_rgba(249,115,22,0.2),0_0_24px_rgba(249,115,22,0.36)]",
                )}
              />

              <Card
                className={cn(
                  "overflow-hidden rounded-2xl border-zinc-200/90 bg-white/95 p-0 shadow-sm ring-1 ring-black/[0.03] transition-[box-shadow,transform] duration-300 dark:border-zinc-800 dark:bg-zinc-950/92 dark:ring-white/[0.04]",
                  "hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,0.22)] hover:ring-orange-500/12 dark:hover:shadow-[0_28px_56px_-26px_rgba(0,0,0,0.55)] dark:hover:ring-orange-400/18",
                )}
              >
                <div className="flex min-h-0 gap-0">
                  <div
                    className="w-1 shrink-0 bg-gradient-to-b from-orange-500 via-orange-400/75 to-orange-600/50 dark:from-orange-400 dark:via-orange-500/60 dark:to-orange-600/45"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1 space-y-4 p-6 sm:space-y-5 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 space-y-1">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-400 sm:text-sm">
                          {job.company}
                          {job.location ? (
                            <span className="font-normal text-zinc-500 dark:text-zinc-500">
                              {" "}
                              · {job.location}
                            </span>
                          ) : null}
                        </p>
                        <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                          {job.role}
                        </h3>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                        {isPresent ? (
                          <Badge tone="accent" className="rounded-full">
                            Current
                          </Badge>
                        ) : null}
                        <time
                          dateTime={job.startDate.toISOString()}
                          className="rounded-full border border-zinc-200/95 bg-zinc-50/95 px-3.5 py-1.5 text-xs font-medium tabular-nums text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 sm:text-[13px]"
                        >
                          {formatRange(job.startDate, job.endDate)}
                        </time>
                      </div>
                    </div>

                    <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-[17px] sm:leading-[1.65]">
                      {job.summary}
                    </p>

                    {job.achievements.length > 0 ? (
                      <ul className="space-y-2.5">
                        {job.achievements.map((a) => (
                          <li
                            key={a}
                            className="flex gap-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-[16px] sm:leading-[1.62]"
                          >
                            <span
                              className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500 dark:bg-orange-400"
                              aria-hidden
                            />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {job.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2 border-t border-zinc-200/85 pt-5 dark:border-zinc-800/90">
                        {job.technologies.map((t) => (
                          <Badge key={t} tone="muted" className="rounded-md">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
