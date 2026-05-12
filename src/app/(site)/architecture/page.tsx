import { PageIntro } from "@/components/marketing/page-intro";

export default function Page() {
  return (
    <div className="space-y-12">
      <PageIntro eyebrow="Architecture thinking" title="Scalable automation, enterprise testing, distributed orchestration, AI mesh" description="Narrated reference cards for CQRS-inspired test data planes, zero-downtime harness rollouts, deterministic agent guardrails, latency budgets, and SaaS-grade reliability patterns." />
      <p className="text-sm text-slate-400">
        Content is CMS-driven in production — scaffolded copy will hydrate from the Postgres + Prisma layer once you run `npm run db:seed`.
      </p>
    </div>
  );
}
