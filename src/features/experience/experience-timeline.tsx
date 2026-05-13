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
  const b = end
    ? end.toLocaleDateString(undefined, opts)
    : "Present";
  return `${a} — ${b}`;
}

export function ExperienceTimeline({ items }: { items: ExperienceRow[] }) {
  if (items.length === 0) {
    return (
      <p className="text-base text-zinc-600 dark:text-zinc-400">
        No roles in the database yet. Run{" "}
        <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">
          npm run db:seed
        </code>{" "}
        to load your LinkedIn-aligned timeline.
      </p>
    );
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute left-[7px] top-2 bottom-4 w-px bg-gradient-to-b from-orange-500/50 via-zinc-300 to-transparent dark:from-orange-500/40 dark:via-zinc-700 sm:left-3"
      />
      <ol className="relative space-y-8 sm:space-y-10">
        {items.map((job) => (
          <li key={job.id} className="relative pl-8 sm:pl-12">
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-2 grid h-4 w-4 place-items-center rounded-full border-2 border-orange-600 bg-[var(--fm-bg)] sm:left-1.5 sm:h-3.5 sm:w-3.5",
                "dark:border-orange-500",
              )}
            />
            <Card className="overflow-hidden border-zinc-200/90 p-0 shadow-sm dark:border-zinc-800">
              <div className="space-y-4 p-6 sm:space-y-5 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-400 sm:text-sm">
                      {job.company}
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                    <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                      {job.role}
                    </h2>
                  </div>
                  <time
                    dateTime={job.startDate.toISOString()}
                    className="shrink-0 rounded-md border border-zinc-200/90 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 sm:text-[13px]"
                  >
                    {formatRange(job.startDate, job.endDate)}
                  </time>
                </div>
                <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-[17px] sm:leading-[1.65]">
                  {job.summary}
                </p>
                {job.achievements.length > 0 ? (
                  <ul className="list-inside list-disc space-y-2 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {job.achievements.map((a) => (
                      <li key={a} className="pl-1 marker:text-orange-600 dark:marker:text-orange-500">
                        {a}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {job.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {job.technologies.map((t) => (
                      <Badge key={t} tone="muted">
                        {t}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
