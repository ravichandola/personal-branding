import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const stats = await prisma
    .$transaction([
      prisma.blogPost.count({ where: { published: true } }),
      prisma.project.count({ where: { published: true } }),
      prisma.contact.count({ where: { status: "NEW" } }),
      prisma.analyticsEvent.count(),
    ])
    .catch(() => [0, 0, 0, 0]);

  const [blogs, projects, contacts, events] = stats;

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          Signed in as {session.user.email}
        </p>
        <h1 className="text-4xl font-semibold">Control room</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Extend this hub with charting, Contentlayer exports, vector memory health, and Incident hooks. All modules are backed by Prisma models and Zustand-powered client panes.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Live blogs", value: blogs },
          { label: "Shipped projects", value: projects },
          { label: "Open contacts", value: contacts },
          { label: "Tracked events", value: events },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 via-purple-950/50 to-transparent p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {card.label}
            </p>
            <p className="mt-4 text-4xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
