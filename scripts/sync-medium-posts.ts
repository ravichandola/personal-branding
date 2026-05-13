/**
 * Fetches https://medium.com/feed/@ravichandola (or MEDIUM_FEED_URL) and
 * upserts each item into BlogPost. HTML from the feed is converted to
 * Markdown for MDX. canonicalUrl points at Medium so the public site uses
 * MediumPostLayout (embed styling + “Read on Medium”).
 *
 * Note: Medium’s public RSS feed exposes a limited window of recent stories
 * (commonly ~10). Older posts are not in the feed; use Medium export or add
 * posts manually in admin for full archives.
 *
 * Usage: npm run db:sync-medium
 */

import Parser from "rss-parser";
import TurndownService from "turndown";

import { PrismaClient } from "../src/generated/prisma";
import { assignInferredBlogTopic } from "../src/lib/sync-blog-category";

const prisma = new PrismaClient();

const DEFAULT_FEED = "https://medium.com/feed/@ravichandola";

type MediumItem = Parser.Item & {
  "content:encoded"?: string;
  "content:encodedSnippet"?: string;
};

function slugFromMediumLink(link: string): string | null {
  try {
    const u = new URL(link);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (!last) return null;
    return last.split("?")[0]!.slice(0, 180);
  } catch {
    return null;
  }
}

function canonicalFromLink(link: string): string {
  const u = new URL(link);
  u.search = "";
  u.hash = "";
  return u.toString();
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function estimateReadMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
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

async function main() {
  const feedUrl = process.env.MEDIUM_FEED_URL?.trim() || DEFAULT_FEED;
  const parser = new Parser({
    customFields: {
      item: ["content:encoded"],
    },
  });

  const feed = await parser.parseURL(feedUrl);
  const items = feed.items as MediumItem[];

  let created = 0;
  let updated = 0;

  for (const item of items) {
    const link = item.link?.trim();
    if (!link) continue;

    const slug = slugFromMediumLink(link);
    if (!slug) continue;

    const encoded = item["content:encoded"]?.trim() ?? "";
    const snippet = item["content:encodedSnippet"]?.trim() ?? "";
    const title = item.title?.trim() ?? slug;
    const canonicalUrl = canonicalFromLink(link);

    let publishedAt: Date | null = null;
    if (item.isoDate) {
      const d = new Date(item.isoDate);
      if (!Number.isNaN(d.getTime())) publishedAt = d;
    } else if (item.pubDate) {
      const d = new Date(item.pubDate);
      if (!Number.isNaN(d.getTime())) publishedAt = d;
    }

    const excerptSource =
      snippet || (encoded ? stripTags(encoded).slice(0, 320) : title);
    const excerpt =
      excerptSource.length > 280
        ? `${excerptSource.slice(0, 277).trim()}…`
        : excerptSource;

    const markdownBody = encoded
      ? htmlToMarkdown(encoded)
      : `_Full article on [Medium](${canonicalUrl})._`;

    const readingTimeMinutes = estimateReadMinutes(
      stripTags(encoded || excerpt),
    );

    const content = markdownBody;

    const existing = await prisma.blogPost.findUnique({ where: { slug } });

    const row = await prisma.blogPost.upsert({
      where: { slug },
      create: {
        slug,
        title,
        excerpt,
        content,
        featured: false,
        published: true,
        publishedAt,
        readingTimeMinutes,
        canonicalUrl,
        seoTitle: title.slice(0, 200),
        seoDescription: excerpt.slice(0, 300),
      },
      update: {
        title,
        excerpt,
        content,
        published: true,
        publishedAt,
        readingTimeMinutes,
        canonicalUrl,
        seoTitle: title.slice(0, 200),
        seoDescription: excerpt.slice(0, 300),
      },
    });

    await assignInferredBlogTopic(
      row.id,
      title,
      excerpt,
      stripTags(encoded || excerpt).slice(0, 6000),
    );

    if (existing) updated += 1;
    else created += 1;
  }

  console.info("Medium sync complete", {
    feed: feedUrl,
    itemsInFeed: items.length,
    created,
    updated,
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
