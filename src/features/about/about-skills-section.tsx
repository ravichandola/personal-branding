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

const sectionPanel = "marketing-shell";

const sectionGlow = "marketing-glow-tr";

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
          className="pointer-events-none absolute -bottom-28 right-1/3 h-44 w-44 rounded-full bg-accent/10 blur-3xl dark:bg-accent/14"
          aria-hidden
        />

        <header className="relative z-[1] mb-8 space-y-4 sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent sm:text-base">
            Capability mesh
          </p>
          <h2
            id="about-skills-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Skills & depth
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
            Proficiency and tenure from the same list you maintain under{" "}
            <a
              href="/admin/skills"
              className="font-semibold text-accent underline-offset-4 hover:underline"
            >
              Admin → Skills
            </a>
            . Categories mirror how work shows up on real programmes.
          </p>
        </header>

        {skills.length === 0 ? (
          <div className="relative z-[1] marketing-dash-callout">
            <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
              No skills in the database yet. Run{" "}
              <code className="surface-code-inline">
                npm run db:seed
              </code>{" "}
              or add entries in{" "}
              <a
                className="font-semibold text-accent underline-offset-4 hover:underline"
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
                  <h3 className="text-lg font-semibold text-foreground">
                    {BUCKET_LABEL[cat]}
                  </h3>
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((s) => (
                      <li
                        key={s.id}
                        className="rounded-xl border border-border bg-card/90 p-4 dark:bg-card/70"
                      >
                        <p className="font-medium text-foreground">
                          {s.name}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>{s.proficiency}% proficiency</span>
                          {s.years != null ? <span>{s.years}+ yrs</span> : null}
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-accent"
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
