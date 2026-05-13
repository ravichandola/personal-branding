/**
 * Import Medium account export (.zip) into BlogPost + topic categories.
 *
 * Categories (keyword rules): Gen AI, Java, JavaScript, Git, Other.
 *
 * Usage:
 *   MEDIUM_EXPORT_ZIP=/path/to/medium-export-....zip npm run db:import-medium-export
 *
 * Re-run safe: upserts by Medium slug (from canonical URL).
 */

import fs from "node:fs";
import path from "node:path";

import AdmZip from "adm-zip";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const TOPIC_CATALOG = [
  { slug: "gen-ai", name: "Gen AI" },
  { slug: "java", name: "Java" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "git", name: "Git" },
  { slug: "other", name: "Other" },
] as const;

type TopicSlug = (typeof TOPIC_CATALOG)[number]["slug"];

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function classifyTopic(title: string, excerpt: string, bodyHtml: string): TopicSlug {
  const sample = `${title}\n${excerpt}\n${stripTags(bodyHtml).slice(0, 6000)}`.toLowerCase();

  const genAi =
    /\brag\b|langgraph|langchain|openai|generative ai|\bgenai\b|\bllm\b|evals|chatbot|foundation model|\bai agent|agentic|anthropic|vector embed|retrieval[- ]augmented|persona.*chatbot|prompt mastery|token saving|\btransformer\b|\bgpt\b|multimodal ai/i.test(
      sample,
    );
  if (genAi) return "gen-ai";

  const javascript =
    /\bjavascript\b|\btypescript\b|\breact\b|node\.js|\bnodejs\b|\bnpm\b|usestate|\bjsx\b|reconciliation|next\.js|server component|package\.json|hook\b|\.tsx\b|web ?3\.0|arrow function|docker run/i.test(
      sample,
    );
  if (javascript) return "javascript";

  const java =
    /\bjava\b(?!script)|\bjvm\b|spring\b|maven\b|multithread|thread group|thread life|thread priority|jdbc\b|interface\b.*coupling|selenium|playwright.*java|junit|gradle/i.test(
      sample,
    );
  if (java) return "java";

  const git =
    /\bgit\b|github|gitlab|git repository|\.git\b|git init|git stash|pushing code to git|commit\b|merge conflict|two github accounts/i.test(
      sample,
    );
  if (git) return "git";

  return "other";
}

function slugFromCanonical(canonical: string): string | null {
  try {
    const u = new URL(canonical);
    const seg = u.pathname.split("/").filter(Boolean).pop();
    if (!seg) return null;
    return seg.split("?")[0]!.slice(0, 180);
  } catch {
    return null;
  }
}

function slugFromFilename(zipPath: string): string | null {
  const base = path.basename(zipPath, ".html");
  const hex = base.match(/([a-f0-9]{12})$/i);
  if (!hex) return null;
  return hex[1]!.toLowerCase();
}

function canonicalFromFilenameAndSlug(zipPath: string, slug: string): string {
  return `https://medium.com/p/${slug}`;
}

function htmlToMarkdown(html: string): string {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  td.remove(["script", "style", "iframe"]);
  return td.turndown(html).trim();
}

function estimateReadMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function ensureCategories() {
  for (const t of TOPIC_CATALOG) {
    await prisma.category.upsert({
      where: { slug: t.slug },
      create: { slug: t.slug, name: t.name },
      update: { name: t.name },
    });
  }
}

async function main() {
  const zipPath =
    process.env.MEDIUM_EXPORT_ZIP?.trim() || process.argv[2]?.trim() || "";
  if (!zipPath || !fs.existsSync(zipPath)) {
    console.error(
      "Set MEDIUM_EXPORT_ZIP=/path/to/export.zip or pass path as first argument.",
    );
    process.exit(1);
  }

  const zip = new AdmZip(zipPath);
  const entries = zip
    .getEntries()
    .filter(
      (e) =>
        !e.isDirectory &&
        e.entryName.startsWith("posts/") &&
        e.entryName.endsWith(".html") &&
        !e.entryName.includes("/draft_") &&
        !path.basename(e.entryName).startsWith("draft_"),
    );

  await ensureCategories();

  const topicCounts: Record<TopicSlug, number> = {
    "gen-ai": 0,
    java: 0,
    javascript: 0,
    git: 0,
    other: 0,
  };

  let skipped = 0;
  let imported = 0;

  for (const entry of entries) {
    const html = entry.getData().toString("utf8");
    const $ = cheerio.load(html);
    const title =
      $("h1.p-name").first().text().trim() ||
      $("title").first().text().trim() ||
      "";
    let canonical = $("a.p-canonical").first().attr("href")?.trim() ?? "";
    let slug = canonical ? slugFromCanonical(canonical) : null;

    if (!slug) {
      slug = slugFromFilename(entry.entryName);
      if (slug) {
        canonical = canonicalFromFilenameAndSlug(entry.entryName, slug);
      }
    }

    if (!slug || !title) {
      skipped += 1;
      continue;
    }

    const excerpt = $("section[data-field=subtitle]")
      .first()
      .text()
      .trim()
      .replace(/\s+/g, " ");

    const bodyHtml = $("section[data-field=body]").first().html() ?? "";
    if (bodyHtml.length < 80) {
      skipped += 1;
      continue;
    }

    const pub = $("time.dt-published").first().attr("datetime");
    let publishedAt: Date | null = null;
    if (pub) {
      const d = new Date(pub);
      if (!Number.isNaN(d.getTime())) publishedAt = d;
    }

    const topic = classifyTopic(title, excerpt, bodyHtml);
    topicCounts[topic] += 1;

    const markdown = htmlToMarkdown(bodyHtml);
    const excerptFinal =
      excerpt.length > 280
        ? `${excerpt.slice(0, 277).trim()}…`
        : excerpt || stripTags(bodyHtml).slice(0, 200);
    const readingTimeMinutes = estimateReadMinutes(
      stripTags(bodyHtml) + excerpt,
    );
    const canonicalClean = (() => {
      try {
        const u = new URL(canonical);
        u.search = "";
        u.hash = "";
        return u.toString();
      } catch {
        return canonical;
      }
    })();

    const categoryRow = await prisma.category.findUnique({
      where: { slug: topic },
    });

    const post = await prisma.blogPost.upsert({
      where: { slug },
      create: {
        slug,
        title: title.slice(0, 300),
        excerpt: excerptFinal,
        content: markdown,
        featured: false,
        published: true,
        publishedAt,
        readingTimeMinutes,
        canonicalUrl: canonicalClean,
        seoTitle: title.slice(0, 200),
        seoDescription: excerptFinal.slice(0, 300),
      },
      update: {
        title: title.slice(0, 300),
        excerpt: excerptFinal,
        content: markdown,
        published: true,
        publishedAt,
        readingTimeMinutes,
        canonicalUrl: canonicalClean,
        seoTitle: title.slice(0, 200),
        seoDescription: excerptFinal.slice(0, 300),
      },
    });

    await prisma.blogOnCategory.deleteMany({ where: { blogId: post.id } });
    if (categoryRow) {
      await prisma.blogOnCategory.create({
        data: { blogId: post.id, categoryId: categoryRow.id },
      });
    }

    imported += 1;
  }

  console.info("Medium export import complete", {
    zip: zipPath,
    filesScanned: entries.length,
    imported,
    skipped,
    byTopic: topicCounts,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
