import { test, expect } from "@playwright/test";

/** Mirrors `navLinks` in `site-navbar.tsx` (Playwright does not resolve `@/`). */
const PRIMARY_ROUTES = [
  "/",
  "/about",
  "/experience",
  "/projects",
  "/blogs",
  "/contact",
] as const;

test.describe("E2E suite · public marketing site", () => {
  test.describe("Home", () => {
    test("loads root with primary hero content", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Ravi/i);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
        timeout: 15_000,
      });
    });
  });

  test.describe("About", () => {
    test("shows about headline", async ({ page }) => {
      await page.goto("/about");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
        timeout: 15_000,
      });
    });
  });

  test.describe("Experience", () => {
    test("renders career timeline section", async ({ page }) => {
      await page.goto("/experience");
      await expect(
        page.getByRole("heading", { name: /Experience/i }).first(),
      ).toBeVisible({ timeout: 15_000 });
    });
  });

  test.describe("Projects", () => {
    test("lists project catalogue intro", async ({ page }) => {
      await page.goto("/projects");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
        timeout: 15_000,
      });
    });
  });

  test.describe("Blogs", () => {
    test("loads blogs index", async ({ page }) => {
      await page.goto("/blogs");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
        timeout: 15_000,
      });
    });
  });

  test.describe("Contact", () => {
    test("shows contact surface", async ({ page }) => {
      await page.goto("/contact");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
        timeout: 15_000,
      });
    });
  });

  test.describe("Navigation", () => {
    test("primary routes respond without server error", async ({ page }) => {
      for (const href of PRIMARY_ROUTES) {
        const res = await page.goto(href, { waitUntil: "domcontentloaded" });
        expect(res?.ok(), `${href} should return 2xx`).toBeTruthy();
        await expect(page.locator("body")).toBeVisible();
      }
    });
  });
});
