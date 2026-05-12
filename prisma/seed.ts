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
      headline:
        "Automation Technical Lead @ Litera · Sage (Cursor autocode + Jira), architecture & GenAI contribution, Playwright/TypeScript",
      bio: `I'm an Automation Technical Lead at Litera, working remotely  contributing to test architecture, organization-wide Playwright and TypeScript adoption, COE / R&D for automation frameworks, and GenAI-flavored tooling (Langchain/LangGraph patterns, LLMs, Python) where it helps teams ship safely. I'm not here to posture as “the only architect in the room”. I care about concrete seams: contracts, CI signal, and operability.

I build and evolve Sage, an autocode-generation layer on top of Cursor. Sage reaches into the repository, reasons about product flows, and drafts exact test automation so engineers can work on any area without pretending they already know every historical edge case. It pulls structured context from Jira — stories, acceptance criteria, linked defects — so generated flows trace to real requirements instead of guesswork.

Alongside generation, Sage includes a maintenance model meant for crisis windows: brutal regressions, org-wide UI rewrites, and timelines that don’t forgive delay (think a three-day regression slot while the whole UI changes underneath you). That mode is about stabilizing coverage quickly — remapping selectors, regrouping suites, and prioritizing risk using Jira impact — so teams aren’t flying blind when everything moves at once.

From an architecture perspective, I still treat automation as software: module boundaries, stable contracts between tests and services, versioned fixtures, and CI/CD feedback loops people trust. I care about flake budgets, parallelization strategy, ownership of layers, and observability that ties failures to commits and releases — not just “more scripts.”

On the GenAI side, I use LLM-backed workflows where they earn their place — developer acceleration, orchestration, exploratory analysis — always paired with deterministic checks for compliance- or money-touching paths. I’m opinionated about lightweight evaluation, refusing silent nonsense in regulated spaces, cost/latency trade-offs, and human-in-the-loop when confidence is ambiguous. OCR-heavy legal PDF surfaces are a natural fit for pairing classic pipeline tests with retrieval-aware assistance, with a bright line between “model suggestion” and “shippable truth.”

From a development perspective, I ship alongside product engineering: TypeScript and Node.js for harnesses and services, Java where the core lives, APIs and integration seams first, and the same PR, review, and incremental delivery discipline as feature teams. I’ve spent years in Angular and React-shaped UIs, REST contracts, and performance work (JMeter, Elastic Stack) so automation matches how systems behave under load.

Previously I was a Senior Automation Engineer (2022–2024) on legal-tech document stacks. I've owned QA for Litigate matter management and for drafting / PDF products: OCR, standards, redaction, signatures, and DMS integration.

Earlier I was at AQM Technologies on Digital Lending and insurance/mobile automation. Before that, GSTN India refund-module integration testing and ABFL Digital automation with Selenium, Java, Rest Assured, and Python, plus AWS (EC2, S3, CloudFront).

Since 2020 I've written on Medium about Git, Java, JavaScript, React, APIs, Docker, and AWS. I hold a B.E. in Electrical and Electronics Engineering (Surajmal College, 2012–2016) and certifications in performance testing, Jenkins, and ISTQB. I care about problem-solving, web performance, and automation that teams can trust in production.`,
      rotatingTitles: [
        "Automation Technical Lead",
        "Sage · Cursor autocode",
        "Test & platform architecture",
        "GenAI & LangGraph practitioner",
        "Legal tech & OCR automation",
        "Technical blogger — Medium",
      ],
      seoTitle: "Ravi Chandola — Automation Technical Lead · Sage",
      seoDescription:
        "Litera automation lead — Sage (Cursor autocode, Jira-grounded tests, regression maintenance), contributing to architecture & GenAI, Playwright/TypeScript, legal tech PDF/OCR.",
      resumeUrl: "",
      avatarUrl: "",
      statsYears: 8,
      statsProjects: 45,
      statsArticles: 25,
      statsAutomationRuns: 14,
      statsAiExperiments: 18,
    },
  });

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      {
        platform: "linkedin",

        url: "https://www.linkedin.com/in/ravi-chandola-304522133",

        label: "LinkedIn outreach",

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
        name: "Java",
        slug: "java",
        category: SkillBucket.BACKEND,
        proficiency: 90,
        years: 8,
        sortOrder: 25,
      },
      {
        name: "Agentic AI development",
        slug: "agentic-ai-development",
        category: SkillBucket.AI_ML,
        proficiency: 90,
        years: 2,
        sortOrder: 27,
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
      /* Litera — ~5y 2m total (per LinkedIn); ordered most recent first */
      {
        company: "Litera",
        role: "Automation Technical Lead",
        location: "Remote",
        startDate: new Date("2024-03-01"),
        endDate: null,
        summary:
          "Automation architecture and COE work: organization-wide test architecture, Playwright + TypeScript adoption, and R&D on automation frameworks. Heavy use of LLM-assisted workflows and Python for tooling where it fits.",
        achievements: [
          "Lead framework and architecture decisions for distributed automation estates",
          "Partner with product and platform teams to scale reliable regression and release gates",
        ],
        technologies: [
          "Large language models (LLM)",
          "Python",
          "Playwright",
          "TypeScript",
          "Node.js",
          "Langchain",
          "LangGraph",
          "Java",
          "AWS",
          "Jenkins",
        ],
        sortOrder: 10,
      },
      {
        company: "Litera",
        role: "Senior Automation Engineer",
        location: "India · Remote",
        startDate: new Date("2022-04-01"),
        endDate: new Date("2024-03-31"),
        summary:
          "Senior automation ownership across Litera document stacks: Node.js services, Java components, and resilient test design for legal-tech delivery.",
        achievements: [
          "Delivered and maintained automation across multi-repo and multi-service boundaries",
          "Tightened CI/CD feedback loops for critical customer paths",
        ],
        technologies: [
          "Node.js",
          "Java",
          "Playwright",
          "TypeScript",
          "Jenkins",
          "Docker",
          "AWS",
        ],
        sortOrder: 20,
      },
      {
        company: "Litera",
        role: "Software Engineer — QA",
        location: "Remote",
        startDate: new Date("2023-03-01"),
        endDate: new Date("2024-03-31"),
        summary:
          "Drafting product specializing in PDF lifecycle: OCR, standards compliance, redaction, signatures, DMS integration, and cross-client compatibility.",
        achievements: [
          "Validated OCR and PDF pipelines end-to-end with regulated-data constraints",
          "Shipped quality for signature, redaction, and document-management integration scenarios",
        ],
        technologies: [
          "ES6",
          "Functional testing",
          "Java",
          "TypeScript",
          "OCR",
          "PDF",
          "Playwright",
          "API testing",
        ],
        sortOrder: 30,
      },
      {
        company: "Litera",
        role: "Software Engineer — QA",
        location: "Ahmedabad, Gujarat, India · Remote",
        startDate: new Date("2021-04-01"),
        endDate: new Date("2023-03-31"),
        summary:
          "Litigate: legal matter workspace with case connection, searchable databases / smart keyword search, witness profiles, dynamic E-binder, highlights, notes, and transcripts.",
        achievements: [
          "Owned STLC design and execution for complex litigation workflows",
          "Integrated automation into feature teams for faster feedback on search and binder experiences",
        ],
        technologies: [
          "ES6",
          "Java",
          "Selenium",
          "REST Assured",
          "API testing",
          "Test automation",
        ],
        sortOrder: 40,
      },
      /* Medium — self-employed blogger */
      {
        company: "Medium",
        role: "Blogger · Self-employed",
        location: "Remote",
        startDate: new Date("2020-01-01"),
        endDate: null,
        summary:
          "Technology writing: Git, Java, JavaScript, React, APIs, Docker, and AWS. medium.com/@ravichandola",
        achievements: [
          "Publish practical deep-dives for developers and testers",
        ],
        technologies: [
          "Core Java",
          "ES6",
          "JavaScript",
          "React",
          "Git",
          "Docker",
          "AWS",
        ],
        sortOrder: 50,
      },
      /* AQM Technologies — ~3y 3m */
      {
        company: "AQM Technologies",
        role: "SDET",
        location: "Mumbai Area, India",
        startDate: new Date("2019-10-01"),
        endDate: new Date("2021-04-30"),
        summary:
          "Digital Lending programme: SDET owning E2E architecture from build to deployment; Angular-heavy UI, API depth, JMeter load tests, Elastic Stack monitoring, email alerting.",
        achievements: [
          "Automated end-to-end lending journeys with observability and alert hooks",
          "Partnered with dev on API contracts, integration topology, and release readiness",
        ],
        technologies: [
          "Node.js",
          "ES6",
          "Angular",
          "JMeter",
          "Elastic Stack",
          "Jenkins",
          "Java",
        ],
        sortOrder: 60,
      },
      {
        company: "AQM Technologies",
        role: "Full Stack QA",
        location: "Mumbai Metropolitan Region, India",
        startDate: new Date("2019-01-01"),
        endDate: new Date("2019-10-31"),
        summary:
          "Digital Lending: full-stack QA across Angular front ends and backing services; Jenkins-driven pipelines and API verification.",
        achievements: [
          "Extended automation coverage across service and UI layers",
          "Supported performance characterization with JMeter and operational visibility",
        ],
        technologies: [
          "Node.js",
          "Jenkins",
          "Angular",
          "JMeter",
          "Java",
          "API testing",
        ],
        sortOrder: 70,
      },
      {
        company: "AQM Technologies",
        role: "Test Automation Engineer",
        location: "Mumbai Area, India",
        startDate: new Date("2018-09-01"),
        endDate: new Date("2018-12-31"),
        summary:
          "Mobile banking automation with Appium: KYC, loans, funds, SMS banking, OTP — data-driven framework, TestNG, Page Object Model.",
        achievements: [
          "Built stable mobile regression suites for high-risk money movement flows",
        ],
        technologies: ["Appium", "Jenkins", "Java", "TestNG", "Selenium"],
        sortOrder: 80,
      },
      {
        company: "AQM Technologies",
        role: "Test Automation Engineer · New India Assurance",
        location: "Mumbai Area, India",
        startDate: new Date("2018-04-01"),
        endDate: new Date("2018-08-31"),
        summary:
          "Insurance web automation across many LOBs and products; Selenium Grid hub/node stability, complex popups, OTP flows, and large scenario matrices.",
        achievements: [
          "Scaled coverage across dozens of products and hundreds of scenarios per LOB",
          "Hardened grid infrastructure for heavy parallel execution",
        ],
        technologies: ["Jenkins", "Java", "Selenium", "TestNG"],
        sortOrder: 90,
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

      {
        slug: "architecture-thought-leadership",
        name: "Automation Architecture",
      },

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

        featured: true,

        published: true,

        githubUrl: `https://github.com/ravichandola/${slug}`,

        liveUrl: `https://example.com/${slug}`,

        tech: ["TypeScript", "PostgreSQL", "AWS"],

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

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        sortOrder: 0,
        author: "Akshay Gadkari",
        role:
          "I help build products to its excellence with The Craft of Testing and Analysis ✅ | FinTech | Loans |",
        quote:
          "Ravi, you are the most enthusiastic person I have ever worked with. There are countless things you can do but let me mention here what you can't do. You are not a person who can sit idle for a single day without learning anything new. I have learned a lot from you. The passion you carry towards your work is simply amazing. Ravi is Optimistic about problem solving, and curious to explore various ways of automation. Great to work with 😊",
        relationship: "Worked with Ravi on the same team",
        writtenAt: new Date("2024-04-14"),
      },
      {
        sortOrder: 1,
        author: "Charlee Jain",
        role: "Agile Project Manager | CSM® | PMP®",
        quote:
          "Ravi and I have worked in same scrum team. He is very sincere and hard working person. He has hunger to learn new things and find different ways to accomplish any task. He is very good at his work and a good team player.",
        relationship:
          "Was senior to Ravi but didn't manage Ravi directly",
        writtenAt: new Date("2022-11-25"),
      },
      {
        sortOrder: 2,
        author: "Linda Tvrdy",
        role:
          "Passionate Advocate for Tech-Driven Social Change | Legal, Tech, & Education Expert | Results-Oriented Leader",
        quote:
          "Ravi and I worked closely together at Litera. I wrote our customer-facing documentation and Ravi was in charge of QA. He was a delight to work with. He very quickly developed a high-level understanding of how our complicated software should work. But he also worked hard to master the detailed way our users worked with the software. Ravi is also just a great person.",
        relationship: "Worked with Ravi on the same team",
        writtenAt: new Date("2022-11-24"),
      },
      {
        sortOrder: 3,
        author: "Gajendra Singh",
        role:
          "Lead Software Engineer | Backend & Full-Stack | Node.js, Kafka, AWS | High-Scale Event-Driven Systems",
        quote:
          "I enjoyed working with Ravi, fantastic team player. Always keen to improve the system and curious to know every bit of it. He was the first Quality engineer in our team and worked hard to lay down qa process. He is proactive and have great sense of responsibility.",
        relationship: "Worked with Ravi on the same team",
        writtenAt: new Date("2022-11-21"),
      },
      {
        sortOrder: 4,
        author: "Adam Trepanier",
        role:
          "Independent Software Consultant | Ruby on Rails | Postgres | Hotwire | Building software with my AI friends",
        quote:
          "Ravi was my lead SDET for our team based in India. Point blank, Ravi is a stellar team member. He is honest, thoughtful, and hungry to improve continuously. Ravi was instrumental in our process for validating releases for daily deploys. He was instrumental in raising issues around software testing in our Kanban process and recommended ways to improve it. Without his support, our software development process goals would not have been reached. Ravi is an excellent addition to any team!",
        relationship: "Managed Ravi directly",
        writtenAt: new Date("2022-01-14"),
      },
      {
        sortOrder: 5,
        author: "Anmol Mishra",
        role: "Lead Automation QA at O2ive",
        quote:
          "Ravi has good coding knowledge when it comes in UI automation as well as API automation and is always eager to put his hands in new technologies, has a good ability in coordinating and teaching new technologies to junior colleagues as well.",
        relationship:
          "Worked with Ravi but they were at different companies",
        writtenAt: new Date("2021-03-31"),
      },
      {
        sortOrder: 6,
        author: "Praveen Bhandari",
        role:
          "Technical Product Management - Digital Transformations, Cloud, Analytics, Gen AI",
        quote:
          "Ravi worked with me on couple of web development projects as SDET. He has good hands on knowledge in java and selenium and produced quality automation framework. I always found him ready to take on new challenges, learning new technologies and flexible in terms of picking up required tasks, be it Automation Testing, API monitoring, SRE or even working on front and development technologies. Keep up the spirits.",
        relationship: "Managed Ravi directly",
        writtenAt: new Date("2021-03-09"),
      },
      {
        sortOrder: 7,
        author: "Devendra Sawant",
        role:
          "Digital Transformation | Solution Architect | FullStack Observability Expert | DevSecOps | AIOps | Cloud Tech | GitOps | SRE | Linux | Leadership | Security | K8s | Helm | Terraform | Platform Engineering",
        quote:
          "Ravi and I worked together at Aditya Birla Finance Limited Digital for a year. I have known him to be a well balanced individual—technically strong and enjoyable to work with. He made work engaging, with solid depth in frontend (React JS) and backend (Java). Across domains and stacks he stayed hardworking, flexible, and someone teams could rely on when the scope kept shifting.",
        relationship:
          "Was senior to Ravi but didn't manage Ravi directly",
        writtenAt: new Date("2021-03-08"),
      },
      {
        sortOrder: 8,
        author: "Rajesh Devakate",
        role: "SDET",
        quote:
          "Ravi worked in my team as an automation expert, he has a zeal to go beyond. He has passion to learn and adopt new technologies. An out of box thinker. He delivers his work on time always. It was an pleasure to work with him.",
        relationship: "Worked with Ravi on the same team",
        writtenAt: new Date("2021-03-06"),
      },
      {
        sortOrder: 9,
        author: "Ashutosh Rathi",
        role: null,
        quote:
          "Ravi has very good knowledge of new technologies. He has a good experience of developing and very good at coding.",
        relationship: "Worked with Ravi on the same team",
        writtenAt: new Date("2021-03-06"),
      },
      {
        sortOrder: 10,
        author: "Hitesh Gupta",
        role: "QA Engineer",
        quote:
          "For Ravi I feel that he is very good in his work; when he gets a task he does it strategically with full focus. His technical knowledge is sound. There is no doubt and no question on his work capabilities. As a person he is very deep in thoughts. He keeps interest in knowing things in each area.",
        relationship: "Worked with Ravi but on different teams",
        writtenAt: new Date("2021-03-06"),
      },
      {
        sortOrder: 11,
        author: "Amiya Nayak",
        role:
          "Officer at State Street with over 9 years of working experience in Automation and Manual testing.",
        quote:
          "I worked with Ravi more than 2 years in Aqm technology. He is creative and a technology enthusiastic guy who always tries to implement new things in project and deliver it on time. He brings integrity and intelligence to his work—I believe his presence had positive impact on the organisation. Highly recommended.",
        relationship:
          "Was senior to Ravi but didn't manage Ravi directly",
        writtenAt: new Date("2021-03-06"),
      },
    ],
  });

  await prisma.user.deleteMany();

  await prisma.session.deleteMany();

  await prisma.account.deleteMany();

  await prisma.user.create({
    data: {
      email: adminEmail,

      passwordHash: await bcrypt.hash(
        password,

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
