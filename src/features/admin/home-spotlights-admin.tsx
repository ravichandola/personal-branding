"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteHomeSpotlightFormAction,
  homeSpotlightsFormAction,
  type HomeSpotlightActionState,
} from "@/features/admin/actions/home-spotlights";

export type HomeSpotlightRow = {
  id: string;
  sortOrder: number;
  published: boolean;
  title: string;
  summary: string;
  narrative: string;
  projectSlug: string | null;
};

export function HomeSpotlightsAdminPanel({
  spotlights,
}: {
  spotlights: HomeSpotlightRow[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = editingId
    ? spotlights.find((s) => s.id === editingId)
    : undefined;

  const [mutState, mutateAction] = useActionState<
    HomeSpotlightActionState,
    FormData
  >(homeSpotlightsFormAction, null);

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
          {editingId ? "Edit spotlight" : "Add spotlight"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          These power the three &quot;Featured&quot; cards on the homepage.
          Optional project slug links the card to{" "}
          <code className="text-slate-500">/projects/your-slug</code>.
        </p>

        <form
          key={editingId ?? "new"}
          action={mutateAction}
          className="mt-6 grid gap-4"
        >
          <input
            type="hidden"
            name="_intent"
            value={editingId ? "update" : "create"}
          />
          {editingId ? <input type="hidden" name="id" value={editingId} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Order (0 = first)</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min={0}
                max={999}
                required
                defaultValue={editing?.sortOrder ?? spotlights.length}
                className="border-white/15 bg-black/50"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={editing?.published ?? true}
                  className="size-4 accent-emerald-500"
                />
                Published on homepage
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={editing?.title ?? ""}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary (one-liner on card)</Label>
            <textarea
              id="summary"
              name="summary"
              required
              rows={2}
              defaultValue={editing?.summary ?? ""}
              className="glass-panel w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="narrative">Narrative (longer story on card)</Label>
            <textarea
              id="narrative"
              name="narrative"
              required
              rows={8}
              defaultValue={editing?.narrative ?? ""}
              className="glass-panel w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectSlug">Project slug (optional)</Label>
            <Input
              id="projectSlug"
              name="projectSlug"
              placeholder="playwright-fleet-fabric"
              defaultValue={editing?.projectSlug ?? ""}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary">
              {editingId ? "Update" : "Create"}
            </Button>
            {editingId ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          All spotlights ({spotlights.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 bg-black/50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {spotlights.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-mono text-xs">{s.sortOrder}</td>
                  <td className="px-4 py-3 font-medium text-white">{s.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {s.projectSlug ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {s.published ? (
                      <span className="text-emerald-400">live</span>
                    ) : (
                      <span className="text-slate-500">off</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingId(s.id)}
                      >
                        Edit
                      </Button>
                      <form
                        action={deleteHomeSpotlightFormAction}
                        onSubmit={(e) => {
                          if (!window.confirm("Delete this spotlight?")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={s.id} />
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
