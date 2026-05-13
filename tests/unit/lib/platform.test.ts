import { afterEach, describe, expect, it } from "vitest";

import {
  databaseUrlHost,
  prismaAdminErrorDetail,
} from "@/lib/admin-action-errors";
import { isProtectedAdminRoute } from "@/lib/admin-path";
import { isCloudinaryConfigured } from "@/lib/cloudinary-server";

describe("Lib suite · admin platform & integrations", () => {
  describe("admin-action-errors", () => {
    describe("prismaAdminErrorDetail", () => {
      it("hides details in production", () => {
        const prev = process.env.NODE_ENV;
        process.env.NODE_ENV = "production";
        expect(prismaAdminErrorDetail(new Error("secret"))).toBe(
          "See server logs.",
        );
        process.env.NODE_ENV = prev;
      });

      it("returns trimmed Error message in development", () => {
        const prev = process.env.NODE_ENV;
        process.env.NODE_ENV = "development";
        expect(prismaAdminErrorDetail(new Error("  boom  "))).toBe("boom");
        process.env.NODE_ENV = prev;
      });

      it("truncates long messages in development", () => {
        const prev = process.env.NODE_ENV;
        process.env.NODE_ENV = "development";
        const long = "x".repeat(600);
        expect(
          prismaAdminErrorDetail(new Error(long)).length,
        ).toBeLessThanOrEqual(501);
        process.env.NODE_ENV = prev;
      });
    });

    describe("databaseUrlHost", () => {
      it("parses postgres hosts without leaking credentials", () => {
        expect(
          databaseUrlHost("postgresql://user:pass@db.internal:5432/app"),
        ).toBe("db.internal");
      });

      it("handles missing or invalid URLs", () => {
        expect(databaseUrlHost(null)).toMatch(/not set/i);
        expect(databaseUrlHost("not-a-url")).toMatch(/not a valid url/i);
      });
    });
  });

  describe("admin-path", () => {
    it("treats /admin/login as public", () => {
      expect(isProtectedAdminRoute("/admin/login")).toBe(false);
    });

    it("protects nested admin routes", () => {
      expect(isProtectedAdminRoute("/admin")).toBe(true);
      expect(isProtectedAdminRoute("/admin/experience")).toBe(true);
    });

    it("ignores non-admin paths", () => {
      expect(isProtectedAdminRoute("/")).toBe(false);
      expect(isProtectedAdminRoute("/about")).toBe(false);
    });
  });

  describe("cloudinary-server", () => {
    const keys = [
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ] as const;
    const snapshot: Partial<
      Record<(typeof keys)[number], string | undefined>
    > = {};

    afterEach(() => {
      for (const k of keys) {
        const v = snapshot[k];
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
        delete snapshot[k];
      }
    });

    it("is false when any credential missing", () => {
      for (const k of keys) snapshot[k] = process.env[k];
      delete process.env.CLOUDINARY_CLOUD_NAME;
      process.env.CLOUDINARY_API_KEY = "k";
      process.env.CLOUDINARY_API_SECRET = "s";
      expect(isCloudinaryConfigured()).toBe(false);
    });

    it("is true when all credentials present", () => {
      for (const k of keys) snapshot[k] = process.env[k];
      process.env.CLOUDINARY_CLOUD_NAME = "n";
      process.env.CLOUDINARY_API_KEY = "k";
      process.env.CLOUDINARY_API_SECRET = "s";
      expect(isCloudinaryConfigured()).toBe(true);
    });
  });
});
