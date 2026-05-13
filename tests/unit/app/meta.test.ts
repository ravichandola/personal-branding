import { describe, expect, it, vi } from "vitest";

import robots from "@/app/robots";

describe("App suite · crawl & indexing metadata", () => {
  describe("sitemap", () => {
    it("lists core marketing routes with absolute URLs", async () => {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://brand.test");
      vi.resetModules();

      const { default: freshSitemap } = await import("@/app/sitemap");
      const entries = await freshSitemap();
      const urls = entries.map((e) => e.url);

      expect(urls).toContain("https://brand.test");
      expect(urls).toContain("https://brand.test/about");
      expect(urls).toContain("https://brand.test/contact");
      expect(entries.every((e) => e.lastModified instanceof Date)).toBe(true);

      vi.unstubAllEnvs();
    });
  });

  describe("robots", () => {
    it("allows crawling site surface and blocks admin paths", () => {
      const r = robots();
      expect(r.rules.userAgent).toBe("*");
      expect(r.rules.allow).toBe("/");
      expect(r.rules.disallow).toEqual(
        expect.arrayContaining(["/admin", "/admin/login"]),
      );
      expect(r.sitemap).toMatch(/sitemap\.xml$/);
    });

    it("prefixes sitemap with NEXT_PUBLIC_SITE_URL when set", () => {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.dev");
      expect(robots().sitemap).toBe("https://example.dev/sitemap.xml");
      vi.unstubAllEnvs();
    });
  });
});
