/**
 * Import Medium account export (.zip) into BlogPost + topic categories.
 *
 * Categories (keyword rules): Gen AI, React, Testing, Java, JavaScript, Git, Other.
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
import {
  BLOG_TOPIC_LABELS,
  BLOG_TOPIC_SLUGS,
  type BlogTopicSlug,
  inferBlogTopicSlug,
} from "../src/lib/blog-topic";

const prisma = new PrismaClient();

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
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
  for (const slug of BLOG_TOPIC_SLUGS) {
    await prisma.category.upsert({
      where: { slug },
      create: { slug, name: BLOG_TOPIC_LABELS[slug] },
      update: { name: BLOG_TOPIC_LABELS[slug] },
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

  const topicCounts = Object.fromEntries(
    [...BLOG_TOPIC_SLUGS].map((slug) => [slug, 0]),
  ) as Record<BlogTopicSlug, number>;

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

    const topic = inferBlogTopicSlug(
      title,
      excerpt,
      stripTags(bodyHtml).slice(0, 6000),
    );
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
