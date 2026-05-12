import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteSettingsForms } from "@/features/admin/site-settings-forms";

export const metadata = {
  title: "Site & profile · Admin",
};

export default async function AdminSiteSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [profile, settings] = await Promise.all([
    prisma.profile.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.settings.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Site &amp; profile</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Edit what visitors see on the homepage and persist global site metadata
          in the database. Sign in is required; this route is protected by
          middleware.
        </p>
      </header>

      <SiteSettingsForms
        cloudinaryConfigured={
          Boolean(
            process.env.CLOUDINARY_CLOUD_NAME &&
              process.env.CLOUDINARY_API_KEY &&
              process.env.CLOUDINARY_API_SECRET,
          )
        }
        profile={
          profile
            ? {
                headline: profile.headline,
                bio: profile.bio,
                rotatingTitles: profile.rotatingTitles.join("\n"),
                avatarUrl: profile.avatarUrl,
                resumeUrl: profile.resumeUrl,
                seoTitle: profile.seoTitle,
                seoDescription: profile.seoDescription,
                canonicalBase: profile.canonicalBase,
                statsYears: profile.statsYears,
                statsProjects: profile.statsProjects,
                statsArticles: profile.statsArticles,
                statsAutomationRuns: profile.statsAutomationRuns,
                statsAiExperiments: profile.statsAiExperiments,
              }
            : null
        }
        settings={{
          siteName: settings?.siteName ?? "Ravi Chandola",
          metaTitle: settings?.metaTitle ?? null,
          metaDescription: settings?.metaDescription ?? null,
          twitterHandle: settings?.twitterHandle ?? null,
          linkedInUrl: settings?.linkedInUrl ?? null,
          mediumUrl: settings?.mediumUrl ?? null,
          githubOrgUrl: settings?.githubOrgUrl ?? null,
          contactNotifyEmail: settings?.contactNotifyEmail ?? null,
          googleAnalyticsId: settings?.googleAnalyticsId ?? null,
        }}
      />
    </div>
  );
}
