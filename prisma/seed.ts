import bcrypt from "bcryptjs";

import {
  PrismaClient,
  SkillBucket,
  ProjectCategoryCode,
} from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const adminEmailRaw =
    process.env.ADMIN_BOOTSTRAP_EMAIL ??
    process.env.CONTACT_ALERT_EMAIL ??
    "studio@example.com";

  const adminEmail = adminEmailRaw.toLowerCase();

  const password =
    process.env.ADMIN_BOOTSTRAP_PASSWORD ??
    process.env.CONTACT_ALERT_PASSWORD ??
    "changeme-strong-password";

  await prisma.aiExtension.deleteMany();
  await prisma.aiExtension.create({
    data: {
      ragEnabled: false,
      notes:
        "Plug in OpenAI, LangGraph, LangChain, vector backends, and webhook secrets before enabling RAG features.",
    },
  });

  await prisma.settings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      linkedInUrl: "https://www.linkedin.com/in/ravi-chandola-304522133",
      mediumUrl: "https://medium.com/@ravichandola",
      githubOrgUrl: "https://github.com/ravichandola/Avengers",
      contactNotifyEmail: adminEmail,
    },
    update: {
      linkedInUrl: "https://www.linkedin.com/in/ravi-chandola-304522133",
      mediumUrl: "https://medium.com/@ravichandola",
      githubOrgUrl: "https://github.com/ravichandola/Avengers",
    },
  });

  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      bio: "Seven+ years building automation substrates that braid hyperscale OCR programs, deterministic Playwright fleets, exploratory LangGraph copilots, and humane systems-thinking defaults.",
      rotatingTitles: [
        "Automation Technical Lead",
        "AI Engineer",
        "Playwright Architect",
        "LangGraph Developer",
        "Full Stack QA Engineer",
        "Agentic AI Builder",
      ],
      seoTitle: "Ravi Chandola — Automation × AI Portfolio OS",
      seoDescription:
        "Hyperscale automation architecture blending OCR, deterministic QA fleets, LangGraph orchestration.",
      resumeUrl:
        "",

      avatarUrl:

        "",
      statsYears:
        7,
      statsProjects:
        48,
      statsArticles:

        31,
      statsAutomationRuns:
        16,
      statsAiExperiments:
        21,
    },
  });

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      {


        platform: "linkedin",


        url: "https://www.linkedin.com/in/ravi-chandola-304522133",


        label:

          "LinkedIn outreach",


        sortOrder: 11,
      },
      {


        platform: "medium",


        url: "https://medium.com/@ravichandola",


        label: "Essays",


        sortOrder: 41,
      },
      {


        platform: "github",


        url: "https://github.com/ravichandola/Avengers",


        label: "Open lab",


        sortOrder: 91,
      },
    ],
  });

  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      {


        name: "Playwright",


        slug: "playwright",


        category: SkillBucket.AUTOMATION,


        proficiency: 95,


        years: 7,


        sortOrder: 10,
      },
      {


        name: "TypeScript",


        slug: "typescript",


        category: SkillBucket.FRONTEND,


        proficiency: 96,


        years: 8,


        sortOrder: 20,
      },
      {


        name: "LangGraph",


        slug: "langgraph",


        category: SkillBucket.AI_ML,


        proficiency: 92,


        years: 3,


        sortOrder: 30,
      },
      {


        name: "AWS",


        slug: "aws",


        category: SkillBucket.CLOUD,


        proficiency: 94,


        years: 6,


        sortOrder: 40,
      },
      {


        name: "PostgreSQL",


        slug: "postgres",


        category: SkillBucket.DATABASES,


        proficiency: 95,


        years: 7,


        sortOrder: 50,
      },
      {


        name: "Docker",


        slug: "docker",


        category: SkillBucket.DEVOPS,


        proficiency: 93,


        years: 6,


        sortOrder: 60,
      },
      {


        name: "Jenkins",


        slug: "jenkins",


        category: SkillBucket.DEVOPS,


        proficiency: 92,


        years: 7,


        sortOrder: 70,
      },
      {


        name: "JMeter",


        slug: "jmeter",


        category: SkillBucket.ARCHITECTURE,


        proficiency: 91,


        years: 6,


        sortOrder: 80,
      },
    ],
  });

  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {


        company: "Litera",


        role: "Automation Technical Lead",


        summary:
          "Leading OCR + PDF automation strategy, deterministic QA estates, hyperscale Playwright programs for legal tech.",


        startDate: new Date("2019-02-01"),


        endDate: null,


        achievements: [


          "Instrumented hyperscale regression matrices with telemetry unions",


          "Brokered agentic experiments with guard rails on regulated corpora",


        ],


        technologies: [


          "Playwright",


          "TypeScript",


          "AWS",


          "PostgreSQL",


        ],


        sortOrder: 10,
      },
      {


        company: "AQM Technologies",


        role: "Technical Lead QA & Automation",


        summary:
          "Scaled performance engineering + automation adoption across distributed squads.",


        startDate: new Date("2016-01-01"),


        endDate: new Date("2019-02-01"),


        achievements: [


          "Built SLA-sensitive CI orchestration bridging classical + exploratory testing",


        ],


        technologies: ["Docker", "Jenkins", "JMeter"],


        sortOrder: 40,
      },
      {


        company: "Medium / Indie Labs",


        role: "Architect & Publisher",


        summary:
          "Writing and prototyping around automation ergonomics + agent fleets.",


        startDate: new Date("2014-01-01"),


        endDate: null,


        achievements: [


          "Authored long-form essays on hyperscale QA + orchestration philosophies",


        ],


        technologies: ["Markdown", "MDX", "LangGraph"],


        sortOrder: 70,
      },
    ],
  });

  await prisma.category.deleteMany();
  await prisma.category.createMany({
    data: [
      { slug: "langgraph-orchestration", name: "LangGraph" },


      { slug: "playwright-labs", name: "Playwright" },


      { slug: "ai-platforms", name: "AI Engineering" },


      { slug: "rag-systems", name: "RAG" },


      { slug: "react-surfaces", name: "React" },


      { slug: "aws-automation-backbone", name: "AWS" },


      { slug: "architecture-thought-leadership", name: "Automation Architecture" },

      { slug: "performance-characterization", name: "Performance Testing" },
    ],

  });


  await prisma.blogPost.deleteMany();

  await prisma.blogPost.create({
    data: {
      slug: "deterministic-ai-guardrails",
      title: "Operationalizing deterministic guardrails around agent loops",
      excerpt:
        "Thoughts on marrying LangGraph state machines with Playwright regressions.",
      content:
        "## Guardrails first\n\nAutomation architects must treat agent outputs as untrusted until validated through deterministic harnesses.",
      featured: true,
      published: true,
      publishedAt: new Date(),
      readingTimeMinutes: 9,
      seoTitle: "Deterministic guardrails for agent loops",
    },
  });

  await prisma.project.deleteMany();

  const sampleProjects = [


    {


      slug: "playwright-fleet-fabric",


      title: "Playwright Fleet Fabric",


      excerpt:
        "Composable fixtures, flaky auto-healing, deterministic telemetry overlays.",


      markdown:
        "## Overview\nDescribes how composable fixtures + infra-as-code power tenant-safe releases.",


      categories: [


        ProjectCategoryCode.AUTOMATION,


        ProjectCategoryCode.PERFORMANCE,


      ],


    },


    {


      slug: "langgraph-citation-guard",


      title: "LangGraph Citation Guard",


      excerpt:
        "Agent graph keeping OCR + RAG answers honest with eval harnesses.",


      markdown:
        "## Flow\nStep-through of retrieval, evaluation, escalation to classical automation.",


      categories: [ProjectCategoryCode.AI, ProjectCategoryCode.LANGGRAPH],


    },


    {


      slug: "ocr-surface-hardening",


      title: "OCR Surface Hardening",


      excerpt:
        "Pipeline patterns for legal PDF workloads with confidence scoring.",


      markdown:
        "## Details\nHighlights chunking, redaction, regression cadence bridging OCR + deterministic QA.",


      categories: [ProjectCategoryCode.OCR, ProjectCategoryCode.AUTOMATION],


    },


    {


      slug: "react-flow-studio",


      title: "React Flow Observability Studio",


      excerpt:
        "Topology visualisations for QA + automation fleets using React Flow.",


      markdown:
        "## Studio\nInteractive graphs enumerating flaky clusters + remediation paths.",


      categories: [ProjectCategoryCode.REACT, ProjectCategoryCode.AUTOMATION],


    },


    {


      slug: "ai-testing-assistant",


      title: "AI Testing Assistant",


      excerpt:
        "Hybrid copilot triaging regressions powered by deterministic evaluators.",


      markdown:
        "## Assistant mechanics\nDemonstrates interplay between conversational layers + scripted guardrails.",


      categories: [ProjectCategoryCode.AI, ProjectCategoryCode.PERFORMANCE],


    },

  ];

  for (const blueprint of sampleProjects) {
    const { categories, markdown, excerpt, slug, title } = blueprint;

    await prisma.project.create({
      data: {
        slug,


        title,


        excerpt,


        description: markdown.slice(


          0,


          380,


        ),


        markdown,


        featured:


          true,

        published: true,

        githubUrl: `https://github.com/ravichandola/${slug}`,

        liveUrl: `https://example.com/${slug}`,

        tech:


          ["TypeScript",

          "PostgreSQL",

          "AWS"],

        categories: {
          create: categories.map((categoryCode) => ({ categoryCode })),

        },

      },

    });


  }



  await prisma.homeSpotlight.deleteMany();

  await prisma.homeSpotlight.createMany({
    data: [
      {
        sortOrder: 0,
        published: true,
        title: "Playwright Fleet Control Plane",
        summary:
          "Tenant-aware estates, flaky auto-remediation loops, SLA-grade instrumentation.",
        narrative:
          "Multi-tenant Playwright estates need more than shared folders — they need identity per tenant, quota-aware runners, artifact retention policies, and dashboards that answer which estate is burning credits before leadership does. This control plane treats flaky tests as operational data: automatic quarantine, reruns with bounded blast radius, and remediation hooks that push failures back to owning teams with context. Instrumentation is SLA-grade: trace IDs from test start through artifact upload, budget alerts, and contract tests that fail the deploy if the fleet itself regresses.",
        projectSlug: "playwright-fleet-fabric",
      },
      {
        sortOrder: 1,
        published: true,
        title: "RAG Legal Companion",
        summary:
          "Chunking precedent libraries with OCR-aware guardrails plus eval harness.",
        narrative:
          "Legal research RAG dies in the gap between slick demos and messy PDFs — scanned exhibits, redacted clauses, and citation rules that change by jurisdiction. This companion pairs OCR-aware ingestion with chunking that respects document structure, then layers eval harnesses: golden Q&A sets, refusal boundaries around privileged content, and human-in-the-loop review queues when confidence drops. Guardrails are explicit: source attribution on every answer, blocked paths for sealed or non-public corpora, and regression suites that run nightly against precedent drift.",
        projectSlug: "langgraph-citation-guard",
      },
      {
        sortOrder: 2,
        published: true,
        title: "Performance Radar Suite",
        summary:
          "JMeter choreography, bottleneck overlays spanning prod-traffic hybrids.",
        narrative:
          "Performance testing only helps when it mimics reality without becoming impossible to maintain. This suite choreographs JMeter (and friends) against hybrid traffic models — replayed production shapes blended with synthetic edge cases — and renders bottleneck overlays that tie latency spikes to deploy windows, dependency versions, and fixture changes. The operator-facing goal is a single radar: reproducible scenarios, clear ownership, and a straight answer to whether a release slowed the system and where.",
        projectSlug: null,
      },
    ],
  });


  await prisma.user.deleteMany();

  await prisma.session.deleteMany();

  await prisma.account.deleteMany();


  await prisma.user.create({
    data: {
      email: adminEmail,


      passwordHash: await bcrypt.hash(password,


        13,


      ),


      name: "Portfolio Admin",


    },


  });

  console.info("Seed complete", { adminEmail });


}

main()
  .catch((error) => {

    console.error(error);


    process.exit(1);


  })


  .finally(async () => {


    await prisma.$disconnect();


  });
