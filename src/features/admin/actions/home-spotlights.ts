"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prismaAdminErrorDetail } from "@/lib/admin-action-errors";
import { prisma } from "@/lib/prisma";

export type HomeSpotlightActionState = { ok: boolean; message: string } | null;

function formString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return v == null ? "" : String(v);
}

function checkboxOn(fd: FormData, key: string): boolean {
  return fd.get(key) === "on";
}

const spotlightCore = z.object({
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().min(1).max(2000),
  narrative: z.string().trim().min(1).max(12000),
  projectSlug: z.string().trim().max(200).optional(),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

function normalizeSlug(raw: string): string | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  return t.replace(/^\//, "").split("/").filter(Boolean).pop();
}

export async function homeSpotlightsFormAction(
  _prev: HomeSpotlightActionState,
  formData: FormData,
): Promise<HomeSpotlightActionState> {
  const intent = String(formData.get("_intent") ?? "create");
  if (intent === "update") return updateHomeSpotlightAction(_prev, formData);
  return createHomeSpotlightAction(_prev, formData);
}

export async function createHomeSpotlightAction(
  _prev: HomeSpotlightActionState,
  formData: FormData,
): Promise<HomeSpotlightActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const parsed = spotlightCore.safeParse({
    title: formString(formData, "title"),
    summary: formString(formData, "summary"),
    narrative: formString(formData, "narrative"),
    projectSlug: formString(formData, "projectSlug"),
    sortOrder: formString(formData, "sortOrder"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid spotlight data.",
    };
  }

  const published = checkboxOn(formData, "published");
  const projectSlug = normalizeSlug(parsed.data.projectSlug ?? "");

  try {
    await prisma.homeSpotlight.create({
      data: {
        title: parsed.data.title.trim(),
        summary: parsed.data.summary.trim(),
        narrative: parsed.data.narrative.trim(),
        sortOrder: parsed.data.sortOrder,
        published,
        projectSlug: projectSlug ?? null,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/spotlights");
    return { ok: true, message: "Spotlight created." };
  } catch (e) {
    console.error("[homeSpotlight create]", e);
    return {
      ok: false,
      message: `Could not create spotlight. ${prismaAdminErrorDetail(e)}`.trim(),
    };
  }
}

export async function updateHomeSpotlightAction(
  _prev: HomeSpotlightActionState,
  formData: FormData,
): Promise<HomeSpotlightActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const id = formString(formData, "id");
  if (!id) return { ok: false, message: "Missing id." };

  const parsed = spotlightCore.safeParse({
    title: formString(formData, "title"),
    summary: formString(formData, "summary"),
    narrative: formString(formData, "narrative"),
    projectSlug: formString(formData, "projectSlug"),
    sortOrder: formString(formData, "sortOrder"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid spotlight data.",
    };
  }

  const published = checkboxOn(formData, "published");
  const projectSlug = normalizeSlug(parsed.data.projectSlug ?? "");

  try {
    const existing = await prisma.homeSpotlight.findUnique({ where: { id } });
    if (!existing) return { ok: false, message: "Not found." };

    await prisma.homeSpotlight.update({
      where: { id },
      data: {
        title: parsed.data.title.trim(),
        summary: parsed.data.summary.trim(),
        narrative: parsed.data.narrative.trim(),
        sortOrder: parsed.data.sortOrder,
        published,
        projectSlug: projectSlug ?? null,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/spotlights");
    return { ok: true, message: "Spotlight updated." };
  } catch (e) {
    console.error("[homeSpotlight update]", e);
    return {
      ok: false,
      message: `Could not update spotlight. ${prismaAdminErrorDetail(e)}`.trim(),
    };
  }
}

export async function deleteHomeSpotlightFormAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;

  const id = formString(formData, "id");
  if (!id) return;

  try {
    await prisma.homeSpotlight.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/spotlights");
  } catch {
    /* ignore */
  }
}
