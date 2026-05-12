import Link from "next/link";
import type { ReactNode } from "react";

import { auth } from "@/auth";
import { signOutAdminAction } from "@/features/admin/sign-out-action";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/site", label: "Site & profile" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/spotlights", label: "Home spotlights" },
  { href: "/admin/projects", label: "Projects" },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="border-b border-white/10 bg-black/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-8 py-6">
          <Link className="font-semibold" href="/admin">
            Operations bridge
          </Link>

          <nav className="flex flex-wrap gap-4 text-sm text-slate-300">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form action={signOutAdminAction}>
            <button
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-8 py-12">{children}</main>
    </div>
  );
}
