"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prismaAdminErrorDetail } from "@/lib/admin-action-errors";
import { prisma } from "@/lib/prisma";

export type ExperienceActionState = { ok: boolean; message: string } | null;

function formString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return v == null ? "" : String(v);
}

function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateInput(s: string): { ok: true; date: Date } | { ok: false } {
  const t = s.trim();
  if (!t) return { ok: false };
  const parts = t.split("-").map((p) => Number(p));
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    return { ok: false };
  }
  const [y, mo, d] = parts;
  if (y! < 1900 || y! > 2100 || mo! < 1 || mo! > 12 || d! < 1 || d! > 31) {
    return { ok: false };
  }
  const date = new Date(y!, mo! - 1, d!);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo! - 1 ||
    date.getDate() !== d
  ) {
    return { ok: false };
  }
  return { ok: true, date };
}

function splitLines(raw: string, maxItems: number, maxLen: number): string[] {
  const lines = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxItems);
  return lines.map((line) =>
    line.length > maxLen ? line.slice(0, maxLen) : line,
  );
}

function splitTech(raw: string, maxItems: number, maxLen: number): string[] {
  const parts = raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxItems);
  return parts.map((p) => (p.length > maxLen ? p.slice(0, maxLen) : p));
}

const experienceCore = z.object({
  company: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  location: z.string().trim().max(200),
  summary: z.string().trim().min(1).max(20_000),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim(),
  achievements: z.string(),
  technologies: z.string(),
});

export async function experienceFormAction(
  _prev: ExperienceActionState,
  formData: FormData,
): Promise<ExperienceActionState> {
  const intent = String(formData.get("_intent") ?? "create");
  if (intent === "update") return updateExperienceAction(_prev, formData);
  return createExperienceAction(_prev, formData);
}

export async function createExperienceAction(
  _prev: ExperienceActionState,
  formData: FormData,
): Promise<ExperienceActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const parsed = experienceCore.safeParse({
    company: formString(formData, "company"),
    role: formString(formData, "role"),
    location: formString(formData, "location"),
    summary: formString(formData, "summary"),
    sortOrder: formString(formData, "sortOrder"),
    startDate: formString(formData, "startDate"),
    endDate: formString(formData, "endDate"),
    achievements: formString(formData, "achievements"),
    technologies: formString(formData, "technologies"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid experience data.",
    };
  }

  const start = parseDateInput(parsed.data.startDate);
  if (!start.ok) {
    return { ok: false, message: "Start date must be a valid YYYY-MM-DD." };
  }

  let endDate: Date | null = null;
  const endRaw = parsed.data.endDate.trim();
  if (endRaw !== "") {
    const end = parseDateInput(endRaw);
    if (!end.ok) {
      return { ok: false, message: "End date must be valid YYYY-MM-DD or empty (current role)." };
    }
    if (end.date < start.date) {
      return { ok: false, message: "End date cannot be before start date." };
    }
    endDate = end.date;
  }

  const location =
    parsed.data.location.trim() === "" ? null : parsed.data.location.trim();
  const achievements = splitLines(parsed.data.achievements, 40, 2000);
  const technologies = splitTech(parsed.data.technologies, 60, 120);

  try {
    await prisma.experience.create({
      data: {
        company: parsed.data.company.trim(),
        role: parsed.data.role.trim(),
        location,
        startDate: start.date,
        endDate,
        summary: parsed.data.summary.trim(),
        achievements,
        technologies,
        sortOrder: parsed.data.sortOrder,
      },
    });
    revalidatePath("/experience");
    revalidatePath("/admin/experience");
    return { ok: true, message: "Experience entry created." };
  } catch (e) {
    console.error("[experience create]", e);
    return {
      ok: false,
      message: `Could not create experience. ${prismaAdminErrorDetail(e)}`.trim(),
    };
  }
}

export async function updateExperienceAction(
  _prev: ExperienceActionState,
  formData: FormData,
): Promise<ExperienceActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const id = formString(formData, "id");
  if (!id) return { ok: false, message: "Missing id." };

  const parsed = experienceCore.safeParse({
    company: formString(formData, "company"),
    role: formString(formData, "role"),
    location: formString(formData, "location"),
    summary: formString(formData, "summary"),
    sortOrder: formString(formData, "sortOrder"),
    startDate: formString(formData, "startDate"),
    endDate: formString(formData, "endDate"),
    achievements: formString(formData, "achievements"),
    technologies: formString(formData, "technologies"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid experience data.",
    };
  }

  const start = parseDateInput(parsed.data.startDate);
  if (!start.ok) {
    return { ok: false, message: "Start date must be a valid YYYY-MM-DD." };
  }

  let endDate: Date | null = null;
  const endRaw = parsed.data.endDate.trim();
  if (endRaw !== "") {
    const end = parseDateInput(endRaw);
    if (!end.ok) {
      return { ok: false, message: "End date must be valid YYYY-MM-DD or empty (current role)." };
    }
    if (end.date < start.date) {
      return { ok: false, message: "End date cannot be before start date." };
    }
    endDate = end.date;
  }

  const location =
    parsed.data.location.trim() === "" ? null : parsed.data.location.trim();
  const achievements = splitLines(parsed.data.achievements, 40, 2000);
  const technologies = splitTech(parsed.data.technologies, 60, 120);

  try {
    const existing = await prisma.experience.findUnique({ where: { id } });
    if (!existing) return { ok: false, message: "Experience entry not found." };

    await prisma.experience.update({
      where: { id },
      data: {
        company: parsed.data.company.trim(),
        role: parsed.data.role.trim(),
        location,
        startDate: start.date,
        endDate,
        summary: parsed.data.summary.trim(),
        achievements,
        technologies,
        sortOrder: parsed.data.sortOrder,
      },
    });
    revalidatePath("/experience");
    revalidatePath("/admin/experience");
    return { ok: true, message: "Experience entry updated." };
  } catch (e) {
    console.error("[experience update]", e);
    return {
      ok: false,
      message: `Could not update experience. ${prismaAdminErrorDetail(e)}`.trim(),
    };
  }
}

export async function deleteExperienceFormAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;

  const id = formString(formData, "id");
  if (!id) return;

  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/experience");
    revalidatePath("/admin/experience");
  } catch {
    /* ignore */
  }
}
