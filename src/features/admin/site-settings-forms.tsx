"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  saveAdminProfileAction,
  saveAdminSettingsAction,
  type SiteSettingsActionState,
} from "@/features/admin/actions/site-settings";
import { ProfileAvatarSection } from "@/features/admin/profile-avatar-section";

export type SiteSettingsFormsProps = {
  cloudinaryConfigured: boolean;
  profile: {
    headline: string | null;
    bio: string;
    rotatingTitles: string;
    avatarUrl: string | null;
    resumeUrl: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    canonicalBase: string | null;
    statsYears: number | null;
    statsProjects: number | null;
    statsArticles: number | null;
    statsAutomationRuns: number | null;
    statsAiExperiments: number | null;
  } | null;
  settings: {
    siteName: string;
    metaTitle: string | null;
    metaDescription: string | null;
    twitterHandle: string | null;
    linkedInUrl: string | null;
    mediumUrl: string | null;
    githubOrgUrl: string | null;
    contactNotifyEmail: string | null;
    googleAnalyticsId: string | null;
  };
};

export function SiteSettingsForms({
  cloudinaryConfigured,
  profile,
  settings,
}: SiteSettingsFormsProps) {
  const [profileState, profileAction] = useActionState<
    SiteSettingsActionState,
    FormData
  >(saveAdminProfileAction, null);

  const [settingsState, settingsAction] = useActionState<
    SiteSettingsActionState,
    FormData
  >(saveAdminSettingsAction, null);

  const p = profile;

  return (
    <div className="space-y-12">
      <p className="text-sm text-slate-400">
        Changes save to Postgres and revalidate the homepage. Manage capability
        lists under{" "}
        <a
          className="font-semibold text-sky-300 underline-offset-4 hover:underline"
          href="/admin/skills"
        >
          Skills
        </a>
        . Social links in <strong className="text-slate-200">site settings</strong>{" "}
        are stored here; the public navbar still uses{" "}
        <code className="rounded bg-white/10 px-1 text-xs">config/site.ts</code> until
        wired.
      </p>

      <section className="space-y-6 rounded-2xl border border-white/10 bg-black/40 p-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Profile &amp; homepage</h2>
          <p className="mt-1 text-sm text-slate-400">
            Maps to the <code className="text-xs">Profile</code> model — hero
            stats, avatar, rotating titles under your name.
          </p>
        </div>

        <form action={profileAction} className="space-y-5">
          {profileState ? (
            <p
              className={
                profileState.ok
                  ? "text-sm text-emerald-400"
                  : "text-sm text-red-400"
              }
            >
              {profileState.message}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="headline">Headline (optional)</Label>
            <Input
              id="headline"
              name="headline"
              defaultValue={p?.headline ?? ""}
              placeholder="Short line under your name"
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              required
              rows={5}
              defaultValue={p?.bio ?? ""}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rotatingTitles">Rotating titles (one per line)</Label>
            <Textarea
              id="rotatingTitles"
              name="rotatingTitles"
              required
              rows={6}
              defaultValue={p?.rotatingTitles ?? ""}
              placeholder={"Automation Lead\nAI Engineer"}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Portrait</Label>
            <ProfileAvatarSection
              initialUrl={p?.avatarUrl ?? ""}
              cloudinaryConfigured={cloudinaryConfigured}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="resumeUrl">Résumé PDF URL</Label>
            <Input
              id="resumeUrl"
              name="resumeUrl"
              type="url"
              defaultValue={p?.resumeUrl ?? ""}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO title</Label>
              <Input
                id="seoTitle"
                name="seoTitle"
                defaultValue={p?.seoTitle ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="seoDescription">SEO description</Label>
              <Textarea
                id="seoDescription"
                name="seoDescription"
                rows={2}
                defaultValue={p?.seoDescription ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="canonicalBase">Canonical base URL (optional)</Label>
              <Input
                id="canonicalBase"
                name="canonicalBase"
                type="url"
                defaultValue={p?.canonicalBase ?? ""}
                placeholder="https://yourdomain.com"
                className="border-white/15 bg-black/50"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Homepage metric strip
            </p>
            <div className="grid gap-4 sm:grid-cols-5">
              {(
                [
                  ["statsYears", "Years"],
                  ["statsProjects", "Projects"],
                  ["statsArticles", "Articles"],
                  ["statsAutomationRuns", "Automation"],
                  ["statsAiExperiments", "AI exps"],
                ] as const
              ).map(([name, label]) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    id={name}
                    name={name}
                    type="number"
                    min={0}
                    defaultValue={
                      p?.[name] === null || p?.[name] === undefined
                        ? ""
                        : String(p[name])
                    }
                    className="border-white/15 bg-black/50"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary">
            Save profile
          </Button>
        </form>
      </section>

      <section className="space-y-6 rounded-2xl border border-white/10 bg-black/40 p-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Site settings</h2>
          <p className="mt-1 text-sm text-slate-400">
            <code className="text-xs">Settings</code> row (single &quot;default&quot; record)
            — metadata, outbound links, notifications.
          </p>
        </div>

        <form action={settingsAction} className="space-y-5">
          {settingsState ? (
            <p
              className={
                settingsState.ok
                  ? "text-sm text-emerald-400"
                  : "text-sm text-red-400"
              }
            >
              {settingsState.message}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="siteName">Site name</Label>
            <Input
              id="siteName"
              name="siteName"
              required
              defaultValue={settings.siteName}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="metaTitle">Global meta title (optional)</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                defaultValue={settings.metaTitle ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="metaDescription">Global meta description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                rows={2}
                defaultValue={settings.metaDescription ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitterHandle">Twitter / X handle (optional)</Label>
            <Input
              id="twitterHandle"
              name="twitterHandle"
              defaultValue={settings.twitterHandle ?? ""}
              placeholder="@handle"
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
              <Input
                id="linkedInUrl"
                name="linkedInUrl"
                type="url"
                defaultValue={settings.linkedInUrl ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mediumUrl">Medium URL</Label>
              <Input
                id="mediumUrl"
                name="mediumUrl"
                type="url"
                defaultValue={settings.mediumUrl ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="githubOrgUrl">GitHub org / lab URL</Label>
              <Input
                id="githubOrgUrl"
                name="githubOrgUrl"
                type="url"
                defaultValue={settings.githubOrgUrl ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactNotifyEmail">Contact form notify email</Label>
              <Input
                id="contactNotifyEmail"
                name="contactNotifyEmail"
                type="email"
                defaultValue={settings.contactNotifyEmail ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsId">GA measurement ID (optional)</Label>
              <Input
                id="googleAnalyticsId"
                name="googleAnalyticsId"
                defaultValue={settings.googleAnalyticsId ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
          </div>

          <Button type="submit" variant="primary">
            Save site settings
          </Button>
        </form>
      </section>
    </div>
  );
}
