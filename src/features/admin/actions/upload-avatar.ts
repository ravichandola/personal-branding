"use server";

import { auth } from "@/auth";
import { uploadImageBuffer } from "@/lib/cloudinary-server";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

export type UploadAvatarState =
  | { ok: true; url: string }
  | { ok: false; message: string };

export async function uploadProfileAvatarAction(
  _prev: UploadAvatarState | null,
  formData: FormData,
): Promise<UploadAvatarState> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "Sign in required." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose an image file." };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, message: "Image must be 4 MB or smaller." };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false, message: "Only image files are allowed." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadImageBuffer(buffer, file.type, {
    folder: "personal-branding/profile",
  });

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  return { ok: true, url: result.secureUrl };
}
