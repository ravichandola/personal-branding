import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const core = [
    "",
    "/about",
    "/experience",
    "/projects",
    "/skills",
    "/blogs",
    "/contact",
    "/resume",
    "/research",
    "/architecture",
    "/playground",
    "/assistant",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  return core;
}
