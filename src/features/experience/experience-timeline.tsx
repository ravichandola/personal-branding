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
          "absolute bottom-10 top-4 w-[3px] rounded-full bg-gradient-to-b from-accent via-accent/35 to-transparent opacity-75 blur-[1px]",
          spineX,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute bottom-10 top-4 w-px bg-gradient-to-b from-accent from-[5%] via-border to-transparent",
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
                  "absolute top-[15px] z-[2] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[2.5px] border-accent bg-background shadow-[0_0_12px_-2px_color-mix(in_oklch,var(--accent)_42%,transparent)] transition-[box-shadow,transform] duration-300 sm:top-4 sm:h-4 sm:w-4",
                  isPresent &&
                    "ring-2 ring-accent/40 group-hover:scale-110 group-hover:shadow-[0_0_20px_-2px_color-mix(in_oklch,var(--accent)_55%,transparent)]",
                )}
              />

              <Card
                className={cn(
                  "overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm ring-1 ring-black/[0.03] transition-[box-shadow,transform] duration-300 dark:ring-white/[0.04]",
                  "hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,0.22)] hover:ring-accent/12 dark:hover:shadow-[0_28px_56px_-26px_rgba(0,0,0,0.55)] dark:hover:ring-accent/18",
                )}
              >
                <div className="flex min-h-0 gap-0">
                  <div
                    className="w-1 shrink-0 bg-gradient-to-b from-accent via-accent/75 to-accent/55"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1 space-y-4 p-6 sm:space-y-5 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 space-y-1">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent sm:text-sm">
                          {job.company}
                          {job.location ? (
                            <span className="font-normal text-muted-foreground">
                              {" "}
                              · {job.location}
                            </span>
                          ) : null}
                        </p>
                        <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
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
                          className="rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-medium tabular-nums text-foreground sm:text-[13px]"
                        >
                          {formatRange(job.startDate, job.endDate)}
                        </time>
                      </div>
                    </div>

                    <p className="text-base leading-relaxed text-muted-foreground sm:text-[17px] sm:leading-[1.65]">
                      {job.summary}
                    </p>

                    {job.achievements.length > 0 ? (
                      <ul className="space-y-2.5">
                        {job.achievements.map((a) => (
                          <li
                            key={a}
                            className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px] sm:leading-[1.62]"
                          >
                            <span
                              className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                              aria-hidden
                            />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {job.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2 border-t border-border pt-5">
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
