import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SkillsAdminPanel } from "@/features/admin/skills-admin";

export const metadata = {
  title: "Skills · Admin",
};

export default async function AdminSkillsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Skills CMS</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          These records power the public{" "}
          <a
            className="text-sky-300 underline-offset-4 hover:underline"
            href="/about#about-skills"
          >
            Skills &amp; depth
          </a>{" "}
          section on About. Seed creates defaults; edit or extend from here.
        </p>
      </header>

      <SkillsAdminPanel skills={skills} />
    </div>
  );
}
