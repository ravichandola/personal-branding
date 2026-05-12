import { PageIntro } from "@/components/marketing/page-intro";

export default function Page() {
  return (
    <div className="space-y-12">
      <PageIntro eyebrow="Research & experiments" title="Playgrounds for OCR, agentic QA, performance characterisation" description="This surface links long-form MDX labs, datasets, benchmark harnesses, and reproducible notebooks. Wire it to GitHub + Medium feeds below the fold." />
      <p className="text-sm text-slate-400">
        Content is CMS-driven in production — scaffolded copy will hydrate from the Postgres + Prisma layer once you run `npm run db:seed`.
      </p>
    </div>
  );
}
