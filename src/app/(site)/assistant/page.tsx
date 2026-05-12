import { PageIntro } from "@/components/marketing/page-intro";

export default function Page() {
  return (
    <div className="space-y-12">
      <PageIntro eyebrow="AI assistant beta" title="Portfolio copilot — RAG-ready, vector friendly, policy aware" description="This route is an intentional placeholder with premium visuals. Wire OpenAI / LangGraph / vector DB via the AiExtension model and service abstractions in `src/services/ai`." />
      <p className="text-sm text-slate-400">
        Content is CMS-driven in production — scaffolded copy will hydrate from the Postgres + Prisma layer once you run `npm run db:seed`.
      </p>
    </div>
  );
}
