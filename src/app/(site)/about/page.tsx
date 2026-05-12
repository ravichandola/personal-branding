import type { ReactNode } from "react";

import { Cpu, Gauge, Shield, Sparkles } from "lucide-react";

import { PageIntro } from "@/components/marketing/page-intro";
import { Card, CardInner } from "@/components/ui/card";

const highlights: Array<{ title: string; body: string; icon: ReactNode }> = [
  {
    title: "7+ years shaping automation architecture",
    body: "Litera legal tech, hyperscale OCR estates, Playwright TypeScript programs, cloud-native QA meshes, distributed systems empathy.",
    icon: <Cpu aria-hidden />,
  },
  {
    title: "Legal tech + OCR realism",
    body: "Redaction aware pipelines, evaluation harnesses guarding PDF/OCR drift, regulated dataset hygiene.",
    icon: <Shield aria-hidden />,
  },
  {
    title: "AI + automation fusion",
    body: "LangGraph orchestration, RAG surfaces, agentic QA copilots guarded by deterministic checkpoints.",
    icon: <Sparkles aria-hidden />,
  },
  {
    title: "Performance + reliability",
    body: "JMeter estates, chaos-minded rollouts, SLA-sensitive observability weaving product + platform signals.",
    icon: <Gauge aria-hidden />,
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <PageIntro
        eyebrow="Story mode"
        title="Ravi Chandola — automation architect, AI engineer, systems writer."
        description="I build the connective tissue between deterministic automation, agentic experimentation, and humane operator experience. This page is intentionally narrative: the same voice that briefs execs, codes Playwright harnesses, designs LangGraph checkpoints, and publishes long-form essays."
      />

      <div className="grid gap-8 md:grid-cols-2">
        {highlights.map((item) => (
          <Card key={item.title}>
            <CardInner className="space-y-4">
              <div className="inline-flex items-center gap-2 text-emerald-200">
                {item.icon}
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Signal
                </span>
              </div>
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              <p className="text-sm leading-relaxed text-slate-300">
                {item.body}
              </p>
            </CardInner>
          </Card>
        ))}
      </div>
    </div>
  );
}
