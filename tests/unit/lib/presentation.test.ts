import { describe, expect, it } from "vitest";

import { personStructuredData } from "@/config/structured-data";
import {
  githubPathLabel,
  isMediumArticleUrl,
  mediumMdxBodyWithoutDuplicateExcerpt,
} from "@/lib/external-content";
import { createMetadata } from "@/lib/metadata";
import {
  cn,
  formatDate,
  readingTimeFromMarkdown,
  truncate,
} from "@/lib/utils";

describe("Lib & config suite · presentation, URLs, and SEO helpers", () => {
  describe("lib/utils", () => {
    describe("cn", () => {
      it("merges tailwind classes", () => {
        expect(cn("px-2 py-1", "px-4")).toContain("py-1");
        expect(cn("px-2 py-1", "px-4")).toContain("px-4");
      });
    });

    describe("formatDate", () => {
      it("formats a fixed UTC instant consistently", () => {
        const d = new Date(Date.UTC(2024, 5, 15));
        expect(formatDate(d)).toMatch(/Jun/);
        expect(formatDate(d)).toMatch(/2024/);
      });
    });

    describe("readingTimeFromMarkdown", () => {
      it("returns at least 1 minute", () => {
        expect(readingTimeFromMarkdown("hello")).toBe(1);
        expect(readingTimeFromMarkdown("")).toBe(1);
      });

      it("scales with word count", () => {
        const words = Array.from({ length: 440 }, () => "word").join(" ");
        expect(readingTimeFromMarkdown(words)).toBe(2);
      });
    });

    describe("truncate", () => {
      it("leaves short strings unchanged", () => {
        expect(truncate("hi", 10)).toBe("hi");
      });

      it("adds ellipsis when over max", () => {
        expect(truncate("hello world", 6)).toBe("hello…");
      });
    });
  });

  describe("lib/external-content", () => {
    describe("isMediumArticleUrl", () => {
      it("accepts medium.com and subdomains", () => {
        expect(isMediumArticleUrl("https://medium.com/@user/post")).toBe(true);
        expect(
          isMediumArticleUrl("https://engineering.medium.com/foo-bar"),
        ).toBe(true);
      });

      it("rejects empty and invalid URLs", () => {
        expect(isMediumArticleUrl("")).toBe(false);
        expect(isMediumArticleUrl("not-a-url")).toBe(false);
      });
    });

    describe("mediumMdxBodyWithoutDuplicateExcerpt", () => {
      it("strips duplicate excerpt prefix before legacy separator", () => {
        const excerpt = "Intro paragraph";
        const body = `Intro paragraph\n\n---\n\nRest of article`;
        expect(mediumMdxBodyWithoutDuplicateExcerpt(body, excerpt)).toBe(
          "Rest of article",
        );
      });

      it("returns trimmed body when no separator", () => {
        expect(
          mediumMdxBodyWithoutDuplicateExcerpt("  Only body  ", "excerpt"),
        ).toBe("Only body");
      });
    });

    describe("githubPathLabel", () => {
      it("extracts user/repo", () => {
        expect(githubPathLabel("https://github.com/octocat/hello-world")).toBe(
          "octocat/hello-world",
        );
      });

      it("falls back for bad URLs", () => {
        expect(githubPathLabel(":::bad")).toBe("GitHub");
      });
    });
  });

  describe("lib/metadata", () => {
    it("includes Open Graph, Twitter, and robots defaults", () => {
      const m = createMetadata({
        title: "Projects",
        description: "Project catalogue",
        path: "/projects",
      });

      expect(m.openGraph?.title).toBeTruthy();
      expect(m.twitter?.card).toBe("summary_large_image");
      expect(m.robots).toEqual({ index: true, follow: true });
      expect(m.alternates?.canonical).toMatch(/\/projects$/);
    });

    it("falls back to brand-only title when title omitted", () => {
      const m = createMetadata({});
      expect(String(m.title)).toContain("Ravi");
    });

    it("embeds image hints when provided", () => {
      const m = createMetadata({
        title: "Blog",
        images: ["https://cdn.example/og.png"],
      });
      expect(m.openGraph?.images).toHaveLength(1);
    });
  });

  describe("config/structured-data", () => {
    it("exports schema.org Person payload", () => {
      expect(personStructuredData["@context"]).toBe("https://schema.org");
      expect(personStructuredData["@type"]).toBe("Person");
      expect(personStructuredData.name).toBeTruthy();
      expect(Array.isArray(personStructuredData.sameAs)).toBe(true);
      expect(personStructuredData.sameAs!.length).toBeGreaterThan(0);
    });
  });
});
