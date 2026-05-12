"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { ContactStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export type ContactActionState = { ok: boolean; message: string } | null;

function formString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return v == null ? "" : String(v);
}

export async function updateContactStatusAction(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const id = formString(formData, "id");
  const status = formString(formData, "status") as ContactStatus;

  if (!id || !Object.values(ContactStatus).includes(status)) {
    return { ok: false, message: "Invalid request." };
  }

  try {
    await prisma.contact.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/contacts");
    return { ok: true, message: "Updated." };
  } catch {
    return { ok: false, message: "Could not update." };
  }
}

export async function deleteContactAction(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const id = formString(formData, "id");
  if (!id) return { ok: false, message: "Missing id." };

  try {
    await prisma.contact.delete({ where: { id } });
    revalidatePath("/admin/contacts");
    return { ok: true, message: "Removed." };
  } catch {
    return { ok: false, message: "Could not delete." };
  }
}
