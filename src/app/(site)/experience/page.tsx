import { prisma } from "@/lib/prisma";

import { PageIntro } from "@/components/marketing/page-intro";

import { ExperienceTimeline } from "@/features/experience/experience-timeline";

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
    <div className="flex flex-col gap-10 sm:gap-12">
      <PageIntro
        eyebrow="Career"
        title="Experience — Litera, AQM Technologies, Medium"
        description="Timeline aligned with your LinkedIn profile: Litera (remote-first legal tech), self-employed Medium blogging, and AQM Digital Lending & insurance automation."
      />
      <ExperienceTimeline items={items} />
    </div>
  );
}
