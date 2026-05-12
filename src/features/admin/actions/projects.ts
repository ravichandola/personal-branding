"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

import { auth } from "@/auth";
import { ProjectCategoryCode } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export type ProjectsActionState = { ok: boolean; message: string } | null;

const categoryValues = Object.values(ProjectCategoryCode) as [
  ProjectCategoryCode,
  ...ProjectCategoryCode[],
];

function formString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return v == null ? "" : String(v);
}

function checkboxOn(fd: FormData, key: string): boolean {
  return fd.get(key) === "on";
}

function githubHostnameOk(host: string): boolean {
  const h = host.replace(/^www\./, "").toLowerCase();
  return h === "github.com" || h.endsWith(".github.com");
}

const projectCore = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(200).optional(),
  githubUrl: z
    .string()
    .trim()
    .min(1)
    .refine((s) => {
      try {
        const u = new URL(s);
        return (
          (u.protocol === "http:" || u.protocol === "https:") &&
          githubHostnameOk(u.hostname)
        );
      } catch {
        return false;
      }
    }, "Use a full GitHub URL (https://github.com/...)"),
  liveUrl: z.string().trim(),
  description: z.string().trim().min(1).max(12000),
  markdown: z.string().optional(),
  tech: z.string().trim().optional(),
});

async function uniqueProjectSlug(base: string, excludeId?: string): Promise<string> {
  const baseSlug =
    slugify(base, { lower: true, strict: true, trim: true }) || "project";
  let candidate = baseSlug;
  let n = 1;
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    n += 1;
    candidate = `${baseSlug}-${n}`;
  }
}

function parseCategories(fd: FormData): ProjectCategoryCode[] {
  const raw = fd.getAll("category");
  const out: ProjectCategoryCode[] = [];
  for (const r of raw) {
    const s = String(r).trim();
    if (categoryValues.includes(s as ProjectCategoryCode)) {
      out.push(s as ProjectCategoryCode);
    }
  }
  return out;
}

function parseTechLine(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 40);
}

function defaultMarkdown(githubUrl: string, liveUrl?: string): string {
  const lines = [
    "## Source",
    "",
    `Browse code, issues, and releases on **[GitHub](${githubUrl})**.`,
  ];
  if (liveUrl) {
    lines.push("", `[Live demo →](${liveUrl})`);
  }
  return lines.join("\n");
}

export async function projectsFormAction(
  _prev: ProjectsActionState,
  formData: FormData,
): Promise<ProjectsActionState> {
  const intent = String(formData.get("_intent") ?? "create");
  if (intent === "update") return updateProjectAction(_prev, formData);
  return createProjectAction(_prev, formData);
}

export async function createProjectAction(
  _prev: ProjectsActionState,
  formData: FormData,
): Promise<ProjectsActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const parsed = projectCore.safeParse({
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    githubUrl: formString(formData, "githubUrl"),
    liveUrl: formString(formData, "liveUrl"),
    description: formString(formData, "description"),
    markdown: formString(formData, "markdown"),
    tech: formString(formData, "tech"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid project data.",
    };
  }

  const liveRaw = parsed.data.liveUrl.trim();
  let live: string | undefined;
  if (liveRaw !== "") {
    try {
      const u = new URL(liveRaw);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
      live = u.toString();
    } catch {
      return { ok: false, message: "Live URL must be empty or a valid http(s) link." };
    }
  }

  const featured = checkboxOn(formData, "featured");
  const published = checkboxOn(formData, "published");
  const categories = parseCategories(formData);
  const slugInput = parsed.data.slug?.trim();
  const slug = await uniqueProjectSlug(slugInput || parsed.data.title);
  const gh = parsed.data.githubUrl.trim();
  const tech = parseTechLine(parsed.data.tech ?? "");
  const description = parsed.data.description.trim();
  const excerpt =
    description.length > 280 ? `${description.slice(0, 277)}…` : description;
  const markdown =
    (parsed.data.markdown?.trim() || defaultMarkdown(gh, live)).trim();

  try {
    await prisma.project.create({
      data: {
        slug,
        title: parsed.data.title.trim(),
        excerpt,
        description,
        markdown,
        githubUrl: gh,
        liveUrl: live ?? null,
        tech,
        featured,
        published,
        categories: {
          create: categories.map((categoryCode) => ({ categoryCode })),
        },
      },
    });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);
    return { ok: true, message: "Project created." };
  } catch {
    return { ok: false, message: "Could not create project." };
  }
}

export async function updateProjectAction(
  _prev: ProjectsActionState,
  formData: FormData,
): Promise<ProjectsActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const id = formString(formData, "id");
  if (!id) return { ok: false, message: "Missing id." };

  const parsed = projectCore.safeParse({
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    githubUrl: formString(formData, "githubUrl"),
    liveUrl: formString(formData, "liveUrl"),
    description: formString(formData, "description"),
    markdown: formString(formData, "markdown"),
    tech: formString(formData, "tech"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid project data.",
    };
  }

  const liveRaw = parsed.data.liveUrl.trim();
  let live: string | undefined;
  if (liveRaw !== "") {
    try {
      const u = new URL(liveRaw);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
      live = u.toString();
    } catch {
      return { ok: false, message: "Live URL must be empty or a valid http(s) link." };
    }
  }

  const featured = checkboxOn(formData, "featured");
  const published = checkboxOn(formData, "published");
  const categories = parseCategories(formData);
  const slugInput = parsed.data.slug?.trim();
  const slug = await uniqueProjectSlug(slugInput || parsed.data.title, id);
  const gh = parsed.data.githubUrl.trim();
  const tech = parseTechLine(parsed.data.tech ?? "");
  const description = parsed.data.description.trim();
  const excerpt =
    description.length > 280 ? `${description.slice(0, 277)}…` : description;
  const markdown =
    (parsed.data.markdown?.trim() || defaultMarkdown(gh, live)).trim();

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return { ok: false, message: "Project not found." };

    await prisma.$transaction(async (tx) => {
      await tx.projectOnCategory.deleteMany({ where: { projectId: id } });
      await tx.project.update({
        where: { id },
        data: {
          slug,
          title: parsed.data.title.trim(),
          excerpt,
          description,
          markdown,
          githubUrl: gh,
          liveUrl: live ?? null,
          tech,
          featured,
          published,
        },
      });
      if (categories.length > 0) {
        await tx.projectOnCategory.createMany({
          data: categories.map((categoryCode) => ({ projectId: id, categoryCode })),
        });
      }
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${existing.slug}`);
    revalidatePath(`/projects/${slug}`);
    return { ok: true, message: "Project updated." };
  } catch {
    return { ok: false, message: "Could not update project." };
  }
}

export async function deleteProjectAction(
  _prev: ProjectsActionState,
  formData: FormData,
): Promise<ProjectsActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const id = formString(formData, "id");
  if (!id) return { ok: false, message: "Missing id." };

  try {
    const p = await prisma.project.findUnique({ where: { id } });
    if (!p) return { ok: false, message: "Not found." };
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${p.slug}`);
    return { ok: true, message: "Deleted." };
  } catch {
    return { ok: false, message: "Could not delete." };
  }
}

/** For `<form action={...}>` without `useActionState` — matches React form action arity. */
export async function deleteProjectFormAction(formData: FormData) {
  await deleteProjectAction(null, formData);
}
