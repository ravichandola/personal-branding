import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  HomeSpotlightsAdminPanel,
  type HomeSpotlightRow,
} from "@/features/admin/home-spotlights-admin";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const rows = await prisma.homeSpotlight
    .findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] })
    .then(
      (list): HomeSpotlightRow[] =>
        list.map((s) => ({
          id: s.id,
          sortOrder: s.sortOrder,
          published: s.published,
          title: s.title,
          summary: s.summary,
          narrative: s.narrative,
          projectSlug: s.projectSlug,
        })),
    )
    .catch(() => []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Home spotlights</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Manage the featured cards on the marketing homepage. Each has a
          one-line summary, a longer narrative, display order, and an optional
          project slug to link to{" "}
          <code className="text-slate-500">/projects/…</code>. The first three
          published rows (by order) are shown.
        </p>
      </div>
      <HomeSpotlightsAdminPanel spotlights={rows} />
    </div>
  );
}
