"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prismaAdminErrorDetail } from "@/lib/admin-action-errors";
import { prisma } from "@/lib/prisma";

export type SiteSettingsActionState = {
  ok: boolean;
  message: string;
} | null;

const optionalUrl = z
  .string()
  .max(2000)
  .transform((s) => (s.trim() === "" ? null : s.trim()))
  .refine((s) => s === null || z.string().url().safeParse(s).success, {
    message: "Invalid URL",
  });

const optionalEmail = z
  .string()
  .max(320)
  .transform((s) => (s.trim() === "" ? null : s.trim()))
  .refine((s) => s === null || z.string().email().safeParse(s).success, {
    message: "Invalid email",
  });

const profileTextForm = z.object({
  headline: z
    .string()
    .max(500)
    .transform((s) => (s.trim() === "" ? null : s.trim())),
  bio: z.string().trim().min(1, "Bio is required").max(50_000),
  rotatingTitles: z
    .string()
    .transform((s) =>
      s
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .refine((arr) => arr.length > 0, {
      message: "Add at least one rotating title (one per line).",
    }),
  avatarUrl: optionalUrl,
  resumeUrl: optionalUrl,
  seoTitle: z
    .string()
    .max(300)
    .transform((s) => (s.trim() === "" ? null : s.trim())),
  seoDescription: z
    .string()
    .max(2000)
    .transform((s) => (s.trim() === "" ? null : s.trim())),
  canonicalBase: optionalUrl,
});

const settingsForm = z.object({
  siteName: z.string().trim().min(1).max(120),
  metaTitle: z
    .string()
    .max(300)
    .transform((s) => (s.trim() === "" ? null : s.trim())),
  metaDescription: z
    .string()
    .max(2000)
    .transform((s) => (s.trim() === "" ? null : s.trim())),
  twitterHandle: z
    .string()
    .max(80)
    .transform((s) => (s.trim() === "" ? null : s.trim())),
  linkedInUrl: optionalUrl,
  mediumUrl: optionalUrl,
  githubOrgUrl: optionalUrl,
  contactNotifyEmail: optionalEmail,
  googleAnalyticsId: z
    .string()
    .max(80)
    .transform((s) => (s.trim() === "" ? null : s.trim())),
});

function formString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return v == null ? "" : String(v);
}

function optionalIntField(
  raw: string,
  max: number,
): { ok: true; value: number | null } | { ok: false } {
  const t = raw.trim();
  if (t === "") return { ok: true, value: null };
  const n = Number(t);
  if (!Number.isFinite(n)) return { ok: false };
  const i = Math.trunc(n);
  if (i < 0 || i > max) return { ok: false };
  return { ok: true, value: i };
}

export async function saveAdminProfileAction(
  _prev: SiteSettingsActionState,
  formData: FormData,
): Promise<SiteSettingsActionState> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const parsed = profileTextForm.safeParse({
    headline: formString(formData, "headline"),
    bio: formString(formData, "bio"),
    rotatingTitles: formString(formData, "rotatingTitles"),
    avatarUrl: formString(formData, "avatarUrl"),
    resumeUrl: formString(formData, "resumeUrl"),
    seoTitle: formString(formData, "seoTitle"),
    seoDescription: formString(formData, "seoDescription"),
    canonicalBase: formString(formData, "canonicalBase"),
  });

  if (!parsed.success) {
    const err = parsed.error.flatten().formErrors.join(" ") ||
      parsed.error.issues[0]?.message ||
      "Check the profile form.";
    return { ok: false, message: err };
  }

  const statYears = optionalIntField(formString(formData, "statsYears"), 200);
  const statProjects = optionalIntField(
    formString(formData, "statsProjects"),
    999_999,
  );
  const statArticles = optionalIntField(
    formString(formData, "statsArticles"),
    999_999,
  );
  const statAutomation = optionalIntField(
    formString(formData, "statsAutomationRuns"),
    999_999,
  );
  const statAi = optionalIntField(
    formString(formData, "statsAiExperiments"),
    999_999,
  );

  if (
    !statYears.ok ||
    !statProjects.ok ||
    !statArticles.ok ||
    !statAutomation.ok ||
    !statAi.ok
  ) {
    return {
      ok: false,
      message: "Homepage stats must be empty or whole numbers in range.",
    };
  }

  const d = parsed.data;

  try {
    const existing = await prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    const payload = {
      headline: d.headline,
      bio: d.bio,
      rotatingTitles: d.rotatingTitles,
      avatarUrl: d.avatarUrl,
      resumeUrl: d.resumeUrl,
      seoTitle: d.seoTitle,
      seoDescription: d.seoDescription,
      canonicalBase: d.canonicalBase,
      statsYears: statYears.value,
      statsProjects: statProjects.value,
      statsArticles: statArticles.value,
      statsAutomationRuns: statAutomation.value,
      statsAiExperiments: statAi.value,
    };

    if (existing) {
      await prisma.profile.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.profile.create({ data: payload });
    }

    revalidatePath("/");
    revalidatePath("/admin/site");
    return { ok: true, message: "Profile and homepage stats saved." };
  } catch (e) {
    console.error("[admin profile]", e);
    return {
      ok: false,
      message: `Could not save profile. ${prismaAdminErrorDetail(e)}`.trim(),
    };
  }
}

export async function saveAdminSettingsAction(
  _prev: SiteSettingsActionState,
  formData: FormData,
): Promise<SiteSettingsActionState> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "You must be signed in." };
  }

  const parsed = settingsForm.safeParse({
    siteName: formString(formData, "siteName"),
    metaTitle: formString(formData, "metaTitle"),
    metaDescription: formString(formData, "metaDescription"),
    twitterHandle: formString(formData, "twitterHandle"),
    linkedInUrl: formString(formData, "linkedInUrl"),
    mediumUrl: formString(formData, "mediumUrl"),
    githubOrgUrl: formString(formData, "githubOrgUrl"),
    contactNotifyEmail: formString(formData, "contactNotifyEmail"),
    googleAnalyticsId: formString(formData, "googleAnalyticsId"),
  });

  if (!parsed.success) {
    const err = parsed.error.flatten().formErrors.join(" ") ||
      parsed.error.issues[0]?.message ||
      "Check the site settings form.";
    return { ok: false, message: err };
  }

  const d = parsed.data;

  try {
    await prisma.settings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        siteName: d.siteName,
        metaTitle: d.metaTitle,
        metaDescription: d.metaDescription,
        twitterHandle: d.twitterHandle,
        linkedInUrl: d.linkedInUrl,
        mediumUrl: d.mediumUrl,
        githubOrgUrl: d.githubOrgUrl,
        contactNotifyEmail: d.contactNotifyEmail,
        googleAnalyticsId: d.googleAnalyticsId,
      },
      update: {
        siteName: d.siteName,
        metaTitle: d.metaTitle,
        metaDescription: d.metaDescription,
        twitterHandle: d.twitterHandle,
        linkedInUrl: d.linkedInUrl,
        mediumUrl: d.mediumUrl,
        githubOrgUrl: d.githubOrgUrl,
        contactNotifyEmail: d.contactNotifyEmail,
        googleAnalyticsId: d.googleAnalyticsId,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/site");
    return { ok: true, message: "Site settings saved." };
  } catch (e) {
    console.error("[admin settings]", e);
    return {
      ok: false,
      message: `Could not save settings. ${prismaAdminErrorDetail(e)}`.trim(),
    };
  }
}
