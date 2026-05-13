import { describe, expect, it } from "vitest";

import type { BlogPostListRow } from "@/lib/blogs-list";
import {
  BLOG_SEARCH_MIN_CHARS,
  blogInstantSearchTokens,
  blogListWhere,
  blogPostMatchesFilters,
  blogSearchTokens,
  parseBlogsListParams,
} from "@/lib/blogs-list";
import { normalizeBlogListRows } from "@/lib/blogs-list-data";

describe("Lib suite · blogs listing & cards", () => {
  describe("blogs-list", () => {
    describe("parseBlogsListParams", () => {
      it("normalizes topic, page, and search flags", () => {
        expect(parseBlogsListParams({})).toEqual({
          q: "",
          topic: null,
          page: 1,
          searchIgnoredTooShort: false,
        });
        expect(
          parseBlogsListParams({ topic: "JAVA", page: "3", q: "ab" }),
        ).toEqual({
          q: "ab",
          topic: "java",
          page: 3,
          searchIgnoredTooShort: false,
        });
      });

      it("flags ignored search when query too short", () => {
        const r = parseBlogsListParams({ q: "a" });
        expect(r.searchIgnoredTooShort).toBe(true);
        expect(r.q).toBe("a");
      });

      it("clamps huge page numbers", () => {
        expect(parseBlogsListParams({ page: "999999" }).page).toBe(500);
      });
    });

    describe("blogSearchTokens", () => {
      it("returns empty when below minimum length", () => {
        expect(blogSearchTokens("a")).toEqual([]);
        expect(blogSearchTokens("")).toEqual([]);
      });

      it("splits and caps tokens", () => {
        expect(blogSearchTokens("foo bar baz")).toEqual(["foo", "bar", "baz"]);
      });
    });

    describe("blogInstantSearchTokens", () => {
      it("allows single-character tokens unlike prisma search", () => {
        expect(blogInstantSearchTokens("a b")).toEqual(["a", "b"]);
      });
    });

    describe("blogListWhere", () => {
      it("always requires published true", () => {
        const w = blogListWhere("", null);
        expect(w).toMatchObject({ published: true });
      });

      it("adds topic filter", () => {
        const w = blogListWhere("", "git");
        expect(w.categories).toEqual({
          some: { category: { slug: "git" } },
        });
      });

      it("combines tokens with AND", () => {
        const w = blogListWhere("alpha beta", null);
        expect(Array.isArray(w.AND)).toBe(true);
        expect(w.AND).toHaveLength(2);
      });
    });

    describe("blogPostMatchesFilters", () => {
      const basePost: BlogPostListRow = {
        id: "1",
        slug: "s",
        title: "Hello TypeScript World",
        excerpt: "Intro",
        featured: false,
        publishedAt: null,
        readingTimeMinutes: null,
        canonicalUrl: null,
        categories: [
          { category: { slug: "javascript", name: "JavaScript" } },
        ],
      };

      it("matches topic by category slug", () => {
        expect(blogPostMatchesFilters(basePost, "", "javascript")).toBe(true);
        expect(blogPostMatchesFilters(basePost, "", "java")).toBe(false);
      });

      it("matches instant search tokens across title and excerpt", () => {
        expect(blogPostMatchesFilters(basePost, "typescript", null)).toBe(true);
        expect(blogPostMatchesFilters(basePost, "missing", null)).toBe(false);
      });

      it("requires all tokens (AND)", () => {
        expect(blogPostMatchesFilters(basePost, "hello world", null)).toBe(true);
        expect(blogPostMatchesFilters(basePost, "hello galaxy", null)).toBe(
          false,
        );
      });
    });

    it("exports search minimum constant used by UI", () => {
      expect(BLOG_SEARCH_MIN_CHARS).toBeGreaterThanOrEqual(2);
    });
  });

  describe("blogs-list-data", () => {
    describe("normalizeBlogListRows", () => {
      it("converts ISO publishedAt strings to Date instances", () => {
        const rows = [
          {
            id: "1",
            slug: "a",
            title: "t",
            excerpt: "e",
            featured: false,
            publishedAt: "2024-01-02T00:00:00.000Z" as unknown as Date,
            readingTimeMinutes: 3,
            canonicalUrl: null,
            categories: [],
          } as BlogPostListRow,
        ];

        const [out] = normalizeBlogListRows(rows);
        expect(out.publishedAt).toBeInstanceOf(Date);
        expect(out.publishedAt?.toISOString().startsWith("2024-01-02")).toBe(
          true,
        );
      });

      it("preserves null publishedAt", () => {
        const rows: BlogPostListRow[] = [
          {
            id: "1",
            slug: "a",
            title: "t",
            excerpt: "e",
            featured: false,
            publishedAt: null,
            readingTimeMinutes: null,
            canonicalUrl: null,
            categories: [],
          },
        ];
        expect(normalizeBlogListRows(rows)[0].publishedAt).toBeNull();
      });
    });
  });
});
