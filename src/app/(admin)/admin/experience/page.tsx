import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  ExperienceAdminPanel,
  type ExperienceAdminRow,
} from "@/features/admin/experience-admin";
import { prisma } from "@/lib/prisma";

export default async function AdminExperiencePage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const rows = await prisma.experience
    .findMany({
      orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    })
    .then(
      (list): ExperienceAdminRow[] =>
        list.map((e) => ({
          id: e.id,
          company: e.company,
          role: e.role,
          location: e.location,
          startDate: e.startDate,
          endDate: e.endDate,
          summary: e.summary,
          achievements: e.achievements,
          technologies: e.technologies,
          sortOrder: e.sortOrder,
        })),
    )
    .catch(() => [] as ExperienceAdminRow[]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Experience</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Manage the career timeline shown on{" "}
          <code className="text-slate-500">/experience</code>. Changes save to
          Postgres and revalidate the public page immediately.
        </p>
      </div>
      <ExperienceAdminPanel rows={rows} />
    </div>
  );
}
