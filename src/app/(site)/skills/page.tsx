import { PageIntro } from "@/components/marketing/page-intro";

export default function Page() {
  return (
    <div className="space-y-12">
      <PageIntro eyebrow="Capability mesh" title="Interactive skills across Frontend, Backend, AI/ML, Automation, DevOps, Cloud, Data, Architecture" description="Skills render from the Skills CMS with proficiency meters, category filters, and telemetry on how each capability was battle-tested in production programs." />
      <p className="text-sm text-slate-400">
        Content is CMS-driven in production — scaffolded copy will hydrate from the Postgres + Prisma layer once you run `npm run db:seed`.
      </p>
    </div>
  );
}
