import { PageIntro } from "@/components/marketing/page-intro";
import { prisma } from "@/lib/prisma";
import { SkillBucket } from "@/generated/prisma";

const BUCKET_LABEL: Record<SkillBucket, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  AI_ML: "AI / ML",
  AUTOMATION: "Automation",
  DEVOPS: "DevOps",
  CLOUD: "Cloud",
  DATABASES: "Databases",
  ARCHITECTURE: "Architecture",
};

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  let skills: Awaited<ReturnType<typeof prisma.skill.findMany>> = [];

  try {
    skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {
    /* optional DB */
  }

  const byCategory = skills.reduce<Partial<Record<SkillBucket, typeof skills>>>(
    (acc, s) => {
      acc[s.category] = acc[s.category] ?? [];
      acc[s.category]!.push(s);
      return acc;
    },
    {},
  );

  const categoryOrder = Object.values(SkillBucket) as SkillBucket[];

  return (
    <div className="space-y-12">
      <PageIntro
        eyebrow="Capability mesh"
        title="Skills & depth"
        description="Proficiency and tenure from the same database you edit under Admin → Skills. Categories mirror how work shows up in production programs."
      />

      {skills.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No skills in the database yet. Run{" "}
          <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">
            npm run db:seed
          </code>{" "}
          or add entries in{" "}
          <a className="font-medium text-orange-700 underline-offset-4 hover:underline dark:text-orange-400" href="/admin/skills">
            /admin/skills
          </a>
          .
        </p>
      ) : (
        <div className="space-y-10">
          {categoryOrder.map((cat) => {
            const list = byCategory[cat];
            if (!list?.length) return null;
            return (
              <section key={cat} className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {BUCKET_LABEL[cat]}
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
                    >
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {s.name}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <span>{s.proficiency}% proficiency</span>
                        {s.years != null ? <span>{s.years}+ yrs</span> : null}
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-orange-600 dark:bg-orange-500"
                          style={{ width: `${Math.min(100, Math.max(0, s.proficiency))}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
