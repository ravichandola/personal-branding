import { prisma } from "@/lib/prisma";

import { PageIntro } from "@/components/marketing/page-intro";

import { ExperienceTimeline } from "@/features/experience/experience-timeline";

const sectionPanel = "marketing-shell";

const sectionGlow = "marketing-glow-tr";

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
          <div className="page-rule" aria-hidden />
        </header>

        <section
          aria-labelledby="experience-timeline-heading"
          className="scroll-mt-28"
        >
          <div className={sectionPanel}>
            <div className={sectionGlow} aria-hidden />
            <div className="marketing-blur-bl" aria-hidden />

            <header className="relative z-[1] mb-10 space-y-4 sm:mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent sm:text-base">
                Timeline
              </p>
              <h2
                id="experience-timeline-heading"
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Roles & impact
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
                Chronological roles, scope, and tech stack — kept in sync from
                your portfolio database.
              </p>
            </header>

            {items.length === 0 ? (
              <div className="relative z-[1] marketing-dash-callout">
                <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
                  No roles in the database yet. Run{" "}
                  <code className="surface-code-inline">
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
