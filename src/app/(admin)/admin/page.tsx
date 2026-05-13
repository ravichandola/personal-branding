import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { databaseUrlHost } from "@/lib/admin-action-errors";

import { auth } from "@/auth";

function parseOrigin(url: string): string | null {
  try {
    return new URL(url.trim()).origin;
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const dbHost = databaseUrlHost(process.env.DATABASE_URL);

  type Counts = {
    blogsPublished: number;
    projectsPublished: number;
    contactsNew: number;
    events: number;
    profiles: number;
    settingsRows: number;
    skills: number;
    spotlights: number;
    experienceRows: number;
  };

  let dbError: string | null = null;
  let counts: Counts | null = null;

  try {
    const [
      blogsPublished,
      projectsPublished,
      contactsNew,
      events,
      profiles,
      settingsRows,
      skills,
      spotlights,
      experienceRows,
    ] = await Promise.all([
      prisma.blogPost.count({ where: { published: true } }),
      prisma.project.count({ where: { published: true } }),
      prisma.contact.count({ where: { status: "NEW" } }),
      prisma.analyticsEvent.count(),
      prisma.profile.count(),
      prisma.settings.count(),
      prisma.skill.count(),
      prisma.homeSpotlight.count(),
      prisma.experience.count(),
    ]);

    counts = {
      blogsPublished,
      projectsPublished,
      contactsNew,
      events,
      profiles,
      settingsRows,
      skills,
      spotlights,
      experienceRows,
    };
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Unknown database error";
    console.error("[admin dashboard] database unreachable", e);
  }

  const authUrlRaw = process.env.AUTH_URL?.trim() ?? "";
  const siteUrlRaw = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  const authOrigin = authUrlRaw ? parseOrigin(authUrlRaw) : null;
  const siteOrigin = siteUrlRaw ? parseOrigin(siteUrlRaw) : null;
  const authSiteMismatch = Boolean(
    authOrigin && siteOrigin && authOrigin !== siteOrigin,
  );

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          Signed in as {session.user.email}
        </p>
        <h1 className="text-4xl font-semibold">Control room</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Operations hub for content and inbox. Saves use your{" "}
          <code className="rounded bg-white/10 px-1 text-xs">DATABASE_URL</code>{" "}
          — if the wrong database or branch is configured, data will look empty
          or disappear after you switch env files.
        </p>
      </header>

      <div
        className={`rounded-2xl border px-5 py-4 text-sm ${
          dbError
            ? "border-red-500/40 bg-red-950/40 text-red-100"
            : "border-emerald-500/30 bg-emerald-950/20 text-emerald-100"
        }`}
      >
        <p className="font-semibold text-white">Database</p>
        <p className="mt-1 text-slate-200">
          Connected host: <span className="font-mono text-xs">{dbHost}</span>
        </p>
        {dbError ? (
          <p className="mt-2 font-mono text-xs leading-relaxed text-red-200/90">
            Prisma error: {dbError}
          </p>
        ) : counts ? (
          <ul className="mt-3 grid gap-1 text-xs text-slate-300 sm:grid-cols-2">
            <li>Profile rows: {counts.profiles}</li>
            <li>Settings rows: {counts.settingsRows}</li>
            <li>Published blogs: {counts.blogsPublished}</li>
            <li>Published projects: {counts.projectsPublished}</li>
            <li>Experience rows: {counts.experienceRows}</li>
            <li>Skills: {counts.skills}</li>
            <li>Home spotlights: {counts.spotlights}</li>
            <li>New contacts: {counts.contactsNew}</li>
            <li>Analytics events: {counts.events}</li>
          </ul>
        ) : null}
        {dbError ? (
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-slate-400">
            <li>
              <strong className="text-slate-300">Neon:</strong> Open the Neon
              console and confirm the project is running (free tiers sleep; open
              the dashboard to wake compute). Copy a fresh connection string if
              the password was rotated.
            </li>
            <li>
              Ensure the URL ends with{" "}
              <code className="rounded bg-black/30 px-1">sslmode=require</code>{" "}
              unless you use a local Postgres.
            </li>
            <li>
              From the project root, test:{" "}
              <code className="rounded bg-black/30 px-1">
                npx prisma db execute --schema prisma/schema.prisma --stdin
              </code>{" "}
              then type{" "}
              <code className="rounded bg-black/30 px-1">SELECT 1;</code>
            </li>
            <li>
              After fixing{" "}
              <code className="rounded bg-black/30 px-1">DATABASE_URL</code>,
              run{" "}
              <code className="rounded bg-black/30 px-1">
                npx prisma migrate deploy
              </code>{" "}
              if needed and restart{" "}
              <code className="rounded bg-black/30 px-1">next dev</code>.
            </li>
          </ul>
        ) : null}
      </div>

      <div className="rounded-2xl border border-amber-500/25 bg-amber-950/20 px-5 py-4 text-sm text-amber-100/95">
        <p className="font-semibold text-amber-50">Auth URL and port</p>
        <p className="mt-2 text-xs leading-relaxed text-amber-100/80">
          If you use <span className="font-mono">localhost:3001</span> (or any
          port other than 3000), set{" "}
          <code className="rounded bg-black/30 px-1">AUTH_URL</code> and{" "}
          <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SITE_URL</code>{" "}
          to that same origin. Mismatched{" "}
          <code className="rounded bg-black/30 px-1">AUTH_URL</code> can break
          sessions so server actions think you are signed out and refuse saves.
        </p>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-amber-200/85">
          AUTH_URL={authUrlRaw || "(unset)"}
          <br />
          NEXT_PUBLIC_SITE_URL={siteUrlRaw || "(unset)"}
        </p>
        {authSiteMismatch ? (
          <p className="mt-2 text-xs font-semibold text-amber-200">
            These origins differ ({authOrigin} vs {siteOrigin}). Align both to
            the URL you use in the browser, then restart the dev server.
          </p>
        ) : null}
      </div>

      {counts ? (
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: "Live blogs", value: counts.blogsPublished },
            { label: "Shipped projects", value: counts.projectsPublished },
            { label: "Open contacts", value: counts.contactsNew },
            { label: "Tracked events", value: counts.events },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 via-purple-950/50 to-transparent p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-4 text-4xl font-semibold">{card.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <p className="text-sm text-slate-400">
        <a
          className="font-semibold text-sky-300 underline-offset-4 hover:underline"
          href="/admin/experience"
        >
          Experience
        </a>{" "}
        — career timeline on the public site (
        <code className="rounded bg-white/10 px-1 text-xs">/experience</code>
        ).
      </p>

      <p className="text-sm text-slate-400">
        <a
          className="font-semibold text-sky-300 underline-offset-4 hover:underline"
          href="/admin/site"
        >
          Site &amp; profile
        </a>{" "}
        — bio, rotating titles, metrics, global settings (Postgres).
      </p>
    </div>
  );
}
