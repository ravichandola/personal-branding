"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteProjectFormAction,
  projectsFormAction,
  type ProjectsActionState,
} from "@/features/admin/actions/projects";
import { ProjectCategoryCode } from "@/generated/prisma";

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  markdown: string;
  tech: string[];
  featured: boolean;
  published: boolean;
  categories: ProjectCategoryCode[];
};

const CATS = Object.values(ProjectCategoryCode) as ProjectCategoryCode[];

const CAT_LABEL: Record<ProjectCategoryCode, string> = {
  AI: "AI",
  AUTOMATION: "Automation",
  REACT: "React",
  BACKEND: "Backend",
  PERFORMANCE: "Performance",
  OCR: "OCR",
  LANGGRAPH: "LangGraph",
};

export function ProjectsAdminPanel({ projects }: { projects: ProjectRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = editingId
    ? projects.find((p) => p.id === editingId)
    : undefined;

  const [mutState, mutateAction] = useActionState<
    ProjectsActionState,
    FormData
  >(projectsFormAction, null);

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
          {editingId ? "Edit project" : "Add project"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          GitHub URL is required. Visitors get a clear button to open the repo or
          profile on GitHub.
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
          {editingId ? (
            <input type="hidden" name="id" value={editingId} />
          ) : null}

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
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              type="url"
              required
              placeholder="https://github.com/you/cool-repo"
              defaultValue={editing?.githubUrl ?? ""}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="liveUrl">Live URL (optional)</Label>
            <Input
              id="liveUrl"
              name="liveUrl"
              type="url"
              placeholder="https://demo.example.com"
              defaultValue={editing?.liveUrl ?? ""}
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
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Summary</Label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              defaultValue={editing?.description ?? ""}
              className="glass-panel w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="markdown">Extra markdown (optional)</Label>
            <textarea
              id="markdown"
              name="markdown"
              rows={6}
              placeholder="Leave empty for a short default section with GitHub + live links."
              defaultValue={editing?.markdown ?? ""}
              className="glass-panel w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 font-mono text-xs text-white outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tech">Tech (comma separated)</Label>
            <Input
              id="tech"
              name="tech"
              placeholder="TypeScript, Next.js, Prisma"
              defaultValue={editing?.tech.join(", ") ?? ""}
              className="border-white/15 bg-black/50"
            />
          </div>

          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Categories
            </legend>
            <div className="flex flex-wrap gap-3">
              {CATS.map((c) => (
                <label
                  key={c}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-300"
                >
                  <input
                    type="checkbox"
                    name="category"
                    value={c}
                    defaultChecked={editing?.categories.includes(c)}
                    className="size-4 accent-emerald-500"
                  />
                  {CAT_LABEL[c]}
                </label>
              ))}
            </div>
          </fieldset>

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
              {editingId ? "Update project" : "Add project"}
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
          All projects ({projects.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 bg-black/50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">GitHub</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-medium text-white">{p.title}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-xs">
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-300 hover:underline"
                      >
                        {p.githubUrl.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      "—"
                    )}
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
                        action={deleteProjectFormAction}
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
