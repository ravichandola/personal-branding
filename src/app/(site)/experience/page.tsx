import { prisma } from "@/lib/prisma";

import { PageIntro } from "@/components/marketing/page-intro";

import { ExperienceTimeline } from "@/features/experience/experience-timeline";

const sectionPanel =
  "relative overflow-hidden rounded-[1.75rem] border border-zinc-200/90 bg-gradient-to-b from-zinc-50/95 via-white/92 to-zinc-100/80 p-8 shadow-sm ring-1 ring-black/[0.03] dark:border-zinc-800/90 dark:from-zinc-950/95 dark:via-zinc-950/75 dark:to-black/50 dark:ring-white/[0.04] sm:p-10 lg:p-12";

const sectionGlow =
  "pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-orange-400/18 blur-3xl dark:bg-orange-500/22";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  let items: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];

  try {
    items = await prisma.experience.findMany({
      orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    });
  } catch {
    /* optional DB */
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-14 lg:gap-[4.25rem]">
        <header className="scroll-mt-28">
          <PageIntro
            eyebrow="Career"
            title="Experience — Litera, AQM Technologies, Medium"
            description="Timeline aligned with your LinkedIn profile: Litera (remote-first legal tech), self-employed Medium blogging, and AQM Digital Lending & insurance automation."
          />
          <div
            className="mx-auto mt-12 h-px max-w-xs bg-gradient-to-r from-transparent via-orange-500/40 to-transparent dark:via-orange-400/35 lg:mt-16"
            aria-hidden
          />
        </header>

        <section
          aria-labelledby="experience-timeline-heading"
          className="scroll-mt-28"
        >
          <div className={sectionPanel}>
            <div className={sectionGlow} aria-hidden />
            <div
              className="pointer-events-none absolute -bottom-32 left-1/4 h-48 w-48 rounded-full bg-orange-600/10 blur-3xl dark:bg-orange-600/15"
              aria-hidden
            />

            <header className="relative z-[1] mb-10 space-y-4 sm:mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-400 sm:text-base">
                Timeline
              </p>
              <h2
                id="experience-timeline-heading"
                className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl"
              >
                Roles & impact
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg sm:leading-[1.65]">
                Chronological roles, scope, and tech stack — kept in sync from
                your portfolio database.
              </p>
            </header>

            {items.length === 0 ? (
              <div className="relative z-[1] rounded-2xl border border-dashed border-zinc-300/90 bg-white/70 px-6 py-8 dark:border-zinc-700 dark:bg-zinc-950/45 sm:px-8">
                <p className="max-w-prose text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                  No roles in the database yet. Run{" "}
                  <code className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[13px] dark:border-zinc-700 dark:bg-zinc-900">
                    npm run db:seed
                  </code>{" "}
                  to load your LinkedIn-aligned timeline.
                </p>
              </div>
            ) : (
              <ExperienceTimeline items={items} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
