"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  blogsFormAction,
  deleteBlogPostFormAction,
  type BlogsActionState,
} from "@/features/admin/actions/blogs";

export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  canonicalUrl: string | null;
  published: boolean;
  featured: boolean;
  publishedAt: string | null;
};

export function BlogsAdminPanel({ posts }: { posts: BlogRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = editingId ? posts.find((p) => p.id === editingId) : undefined;

  const [mutState, mutateAction] = useActionState<BlogsActionState, FormData>(
    blogsFormAction,
    null,
  );

  useEffect(() => {
    if (mutState?.ok) {
      setEditingId(null);
      router.refresh();
    }
  }, [mutState, router]);

  return (
    <div className="space-y-10">
      {mutState ? (
        <p
          className={
            mutState.ok ? "text-sm text-emerald-400" : "text-sm text-red-400"
          }
        >
          {mutState.message}
        </p>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-black/40 p-6">
        <h2 className="text-lg font-semibold text-white">
          {editingId ? "Edit Medium article" : "Add Medium article"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Paste the Medium URL. Your site shows a Medium-style preview; the full
          read opens on Medium.
        </p>

        <form
          key={editingId ?? "new"}
          action={mutateAction}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          <input
            type="hidden"
            name="_intent"
            value={editingId ? "update" : "create"}
          />
          {editingId ? <input type="hidden" name="id" value={editingId} /> : null}

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={editing?.title ?? ""}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="mediumUrl">Medium article URL</Label>
            <Input
              id="mediumUrl"
              name="mediumUrl"
              type="url"
              required
              placeholder="https://medium.com/@you/your-story"
              defaultValue={editing?.canonicalUrl ?? ""}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="slug">Slug (optional)</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="auto from title"
              defaultValue={editing?.slug ?? ""}
              className="border-white/15 bg-black/50"
            />
            <p className="text-xs text-slate-500">
              URL on your site: <code className="text-slate-400">/blogs/slug</code>
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              rows={4}
              defaultValue={editing?.excerpt ?? ""}
              className="glass-panel w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300 sm:col-span-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={editing?.published ?? true}
              className="size-4 accent-emerald-500"
            />
            Published on public site
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300 sm:col-span-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={editing?.featured ?? false}
              className="size-4 accent-emerald-500"
            />
            Featured
          </label>

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button type="submit" variant="primary">
              {editingId ? "Update post" : "Add post"}
            </Button>
            {editingId ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingId(null)}
              >
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          All posts ({posts.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 bg-black/50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Medium</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-medium text-white">{p.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">
                    {p.slug}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {p.published ? (
                      <span className="text-emerald-400">live</span>
                    ) : (
                      <span className="text-slate-500">draft</span>
                    )}
                    {p.featured ? (
                      <span className="ml-2 text-amber-300">★</span>
                    ) : null}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-xs">
                    {p.canonicalUrl ? (
                      <a
                        href={p.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#5bd37d] hover:underline"
                      >
                        link
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingId(p.id)}
                      >
                        Edit
                      </Button>
                      <form
                        action={deleteBlogPostFormAction}
                        onSubmit={(e) => {
                          if (!window.confirm(`Delete “${p.title}”?`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={p.id} />
                        <Button type="submit" size="sm" variant="outline">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
