import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

let configured = false;

function ensureConfigured(): boolean {
  if (configured) return true;
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!name || !key || !secret) return false;
  cloudinary.config({ cloud_name: name, api_key: key, api_secret: secret });
  configured = true;
  return true;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export type UploadResult =
  | { ok: true; secureUrl: string; publicId: string }
  | { ok: false; message: string };

export async function uploadImageBuffer(
  buffer: Buffer,
  mimeType: string,
  options: { folder: string },
): Promise<UploadResult> {
  if (!ensureConfigured()) {
    return {
      ok: false,
      message:
        "Cloudinary env vars missing (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
    };
  }

  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

  try {
    const res = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          dataUri,
          {
            folder: options.folder,
            resource_type: "image",
            overwrite: true,
          },
          (err, result) => {
            if (err) reject(err);
            else if (result) resolve(result);
            else reject(new Error("Upload failed"));
          },
        );
      },
    );

    if (!res.secure_url) {
      return { ok: false, message: "Upload did not return a URL." };
    }

    return { ok: true, secureUrl: res.secure_url, publicId: res.public_id };
  } catch (e) {
    console.error("[cloudinary]", e);
    return { ok: false, message: "Image upload failed." };
  }
}
