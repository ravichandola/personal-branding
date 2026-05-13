import type { Skill } from "@/generated/prisma";
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

const sectionPanel =
  "relative overflow-hidden rounded-[1.75rem] border border-zinc-200/90 bg-gradient-to-b from-zinc-50/95 via-white/92 to-zinc-100/80 p-8 shadow-sm ring-1 ring-black/[0.03] dark:border-zinc-800/90 dark:from-zinc-950/95 dark:via-zinc-950/75 dark:to-black/50 dark:ring-white/[0.04] sm:p-10 lg:p-12";

const sectionGlow =
  "pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-orange-400/18 blur-3xl dark:bg-orange-500/22";

export function AboutSkillsSection({ skills }: { skills: Skill[] }) {
  const byCategory = skills.reduce<Partial<Record<SkillBucket, Skill[]>>>((acc, s) => {
    acc[s.category] = acc[s.category] ?? [];
    acc[s.category]!.push(s);
    return acc;
  }, {});

  const categoryOrder = Object.values(SkillBucket) as SkillBucket[];

  return (
    <section
      id="about-skills"
      aria-labelledby="about-skills-heading"
      className="scroll-mt-28"
    >
      <div className={sectionPanel}>
        <div className={sectionGlow} aria-hidden />
        <div
          className="pointer-events-none absolute -bottom-28 right-1/3 h-44 w-44 rounded-full bg-orange-600/10 blur-3xl dark:bg-orange-600/14"
          aria-hidden
        />

        <header className="relative z-[1] mb-8 space-y-4 sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-400 sm:text-base">
            Capability mesh
          </p>
          <h2
            id="about-skills-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl"
          >
            Skills & depth
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg sm:leading-[1.65]">
            Proficiency and tenure from the same list you maintain under{" "}
            <a
              href="/admin/skills"
              className="font-semibold text-orange-700 underline-offset-4 hover:underline dark:text-orange-400"
            >
              Admin → Skills
            </a>
            . Categories mirror how work shows up on real programmes.
          </p>
        </header>

        {skills.length === 0 ? (
          <div className="relative z-[1] rounded-2xl border border-dashed border-zinc-300/90 bg-white/70 px-6 py-8 dark:border-zinc-700 dark:bg-zinc-950/45 sm:px-8">
            <p className="max-w-prose text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              No skills in the database yet. Run{" "}
              <code className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[13px] dark:border-zinc-700 dark:bg-zinc-900">
                npm run db:seed
              </code>{" "}
              or add entries in{" "}
              <a
                className="font-semibold text-orange-700 underline-offset-4 hover:underline dark:text-orange-400"
                href="/admin/skills"
              >
                Admin → Skills
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="relative z-[1] space-y-10">
            {categoryOrder.map((cat) => {
              const list = byCategory[cat];
              if (!list?.length) return null;
              return (
                <div key={cat} className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {BUCKET_LABEL[cat]}
                  </h3>
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((s) => (
                      <li
                        key={s.id}
                        className="rounded-xl border border-zinc-200/95 bg-white/90 p-4 dark:border-zinc-800 dark:bg-zinc-950/70"
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
                            style={{
                              width: `${Math.min(100, Math.max(0, s.proficiency))}%`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
