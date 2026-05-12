import { PageIntro } from "@/components/marketing/page-intro";

export default function Page() {
  return (
    <div className="space-y-12">
      <PageIntro eyebrow="Timeline" title="Experience — Litera · AQM Technologies · Medium authoring" description="Expandable timelines, technology matrices, and measurable outcomes will render from the Experience CMS. Current copy references leadership on automation architecture, legal tech OCR programs, Playwright estate migrations, and QA org design." />
      <p className="text-sm text-slate-400">
        Content is CMS-driven in production — scaffolded copy will hydrate from the Postgres + Prisma layer once you run `npm run db:seed`.
      </p>
    </div>
  );
}
