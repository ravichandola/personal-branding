"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

import { auth } from "@/auth";
import { SkillBucket } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export type SkillsActionState = { ok: boolean; message: string } | null;

const buckets = Object.values(SkillBucket) as [SkillBucket, ...SkillBucket[]];

const skillCore = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.enum(buckets),
  proficiency: z.coerce.number().int().min(0).max(100),
});

function formString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return v == null ? "" : String(v);
}

function optionalNonNegInt(
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

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const baseSlug = slugify(base, { lower: true, strict: true, trim: true }) || "skill";
  let candidate = baseSlug;
  let n = 1;
  while (true) {
    const existing = await prisma.skill.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    n += 1;
    candidate = `${baseSlug}-${n}`;
  }
}

export async function skillsFormAction(
  _prev: SkillsActionState,
  formData: FormData,
): Promise<SkillsActionState> {
  const intent = String(formData.get("_intent") ?? "create");
  if (intent === "update") return updateSkillAction(_prev, formData);
  return createSkillAction(_prev, formData);
}

export async function createSkillAction(
  _prev: SkillsActionState,
  formData: FormData,
): Promise<SkillsActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const parsed = skillCore.safeParse({
    name: formString(formData, "name"),
    category: formString(formData, "category"),
    proficiency: formString(formData, "proficiency"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid skill data.",
    };
  }

  const years = optionalNonNegInt(formString(formData, "years"), 80);
  const sortOrder = optionalNonNegInt(formString(formData, "sortOrder"), 9999);
  if (!years.ok || !sortOrder.ok) {
    return { ok: false, message: "Years and sort order must be empty or valid numbers." };
  }

  const slug = await uniqueSlug(parsed.data.name);

  try {
    await prisma.skill.create({
      data: {
        name: parsed.data.name,
        slug,
        category: parsed.data.category,
        proficiency: parsed.data.proficiency,
        years: years.value,
        sortOrder: sortOrder.value ?? 0,
      },
    });
    revalidatePath("/about");
    revalidatePath("/admin/skills");
    return { ok: true, message: "Skill created." };
  } catch (e) {
    console.error("[createSkill]", e);
    return { ok: false, message: "Could not create skill." };
  }
}

export async function updateSkillAction(
  _prev: SkillsActionState,
  formData: FormData,
): Promise<SkillsActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const id = formString(formData, "id");
  if (!id) return { ok: false, message: "Missing skill id." };

  const parsed = skillCore.safeParse({
    name: formString(formData, "name"),
    category: formString(formData, "category"),
    proficiency: formString(formData, "proficiency"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid skill data.",
    };
  }

  const years = optionalNonNegInt(formString(formData, "years"), 80);
  const sortOrder = optionalNonNegInt(formString(formData, "sortOrder"), 9999);
  if (!years.ok || !sortOrder.ok) {
    return { ok: false, message: "Years and sort order must be empty or valid numbers." };
  }

  const slug = await uniqueSlug(parsed.data.name, id);

  try {
    await prisma.skill.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug,
        category: parsed.data.category,
        proficiency: parsed.data.proficiency,
        years: years.value,
        sortOrder: sortOrder.value ?? 0,
      },
    });
    revalidatePath("/about");
    revalidatePath("/admin/skills");
    return { ok: true, message: "Skill updated." };
  } catch (e) {
    console.error("[updateSkill]", e);
    return { ok: false, message: "Could not update skill." };
  }
}

export async function deleteSkillAction(
  _prev: SkillsActionState,
  formData: FormData,
): Promise<SkillsActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const id = formString(formData, "id");
  if (!id) return { ok: false, message: "Missing id." };

  try {
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/about");
    revalidatePath("/admin/skills");
    return { ok: true, message: "Skill deleted." };
  } catch (e) {
    console.error("[deleteSkill]", e);
    return { ok: false, message: "Could not delete skill." };
  }
}

/** For `<form action={...}>` without `useActionState` — matches React form action arity. */
export async function deleteSkillFormAction(formData: FormData) {
  await deleteSkillAction(null, formData);
}
