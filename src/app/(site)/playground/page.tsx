import { PageIntro } from "@/components/marketing/page-intro";

export default function Page() {
  return (
    <div className="space-y-12">
      <PageIntro eyebrow="Engineering playground" title="React Flow canvases, LangGraph sketches, automation topology visualisers" description="Embed React Flow diagrams, sequence charts, and mocked LangGraph state machines. Hooks are stubbed for rapid iteration before wiring real agents." />
      <p className="text-sm text-slate-400">
        Content is CMS-driven in production — scaffolded copy will hydrate from the Postgres + Prisma layer once you run `npm run db:seed`.
      </p>
    </div>
  );
}
