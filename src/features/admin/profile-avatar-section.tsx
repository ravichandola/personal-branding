"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { uploadProfileAvatarAction } from "@/features/admin/actions/upload-avatar";

type ProfileAvatarSectionProps = {
  initialUrl: string;
  cloudinaryConfigured: boolean;
};

export function ProfileAvatarSection({
  initialUrl,
  cloudinaryConfigured,
}: ProfileAvatarSectionProps) {
  const [url, setUrl] = React.useState(initialUrl);
  const [uploadMsg, setUploadMsg] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  async function handleUpload() {
    setUploadMsg(null);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setUploadMsg("Choose a file first.");
      return;
    }
    setPending(true);
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadProfileAvatarAction(null, fd);
    setPending(false);
    if (result.ok) {
      setUrl(result.url);
      setUploadMsg("Uploaded — URL updated. Click “Save profile” below to persist.");
      if (fileRef.current) fileRef.current.value = "";
    } else {
      setUploadMsg(result.message);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-4">
      <input type="hidden" name="avatarUrl" value={url} readOnly />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <p className="mb-1 text-xs font-medium text-slate-500">Preview</p>
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-black/50">
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="px-2 text-center text-[11px] text-slate-500">
                No image
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="avatarUrlVisible">Portrait URL</Label>
            <Input
              id="avatarUrlVisible"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://… (Cloudinary, LinkedIn media.licdn.com, etc.)"
              className="border-white/15 bg-black/50"
            />
            <p className="text-[12px] leading-relaxed text-slate-500">
              <strong className="text-slate-400">LinkedIn:</strong> Open your profile
              → click profile photo → right‑click the large photo → &quot;Copy image
              address&quot; → paste here. URLs usually contain{" "}
              <code className="text-slate-400">media.licdn.com</code>.
            </p>
          </div>

          {cloudinaryConfigured ? (
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="avatarFile">Upload from computer</Label>
                <Input
                  ref={fileRef}
                  id="avatarFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="border-white/15 bg-black/50 file:mr-3 file:rounded-md file:border-0 file:bg-orange-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                disabled={pending}
                onClick={() => void handleUpload()}
              >
                { pending ? "Uploading…" : "Upload to Cloudinary" }
              </Button>
              {uploadMsg ? (
                <p
                  className={`w-full text-sm ${
                    uploadMsg.startsWith("Uploaded")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {uploadMsg}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-[12px] text-amber-200/90">
              Cloudinary is not configured in <code>.env</code>. Add{" "}
              <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code>,{" "}
              <code>CLOUDINARY_API_SECRET</code> to enable file upload; until then use
              a direct image URL only.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
