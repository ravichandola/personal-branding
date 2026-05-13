"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteExperienceFormAction,
  experienceFormAction,
  type ExperienceActionState,
} from "@/features/admin/actions/experience";

export type ExperienceAdminRow = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  summary: string;
  achievements: string[];
  technologies: string[];
  sortOrder: number;
};

function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ExperienceAdminPanel({
  rows,
}: {
  rows: ExperienceAdminRow[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = editingId ? rows.find((r) => r.id === editingId) : undefined;

  const [mutState, mutateAction] = useActionState<
    ExperienceActionState,
    FormData
  >(experienceFormAction, null);

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
          {editingId ? "Edit role" : "Add role"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          These entries power the public{" "}
          <code className="text-slate-500">/experience</code> timeline. Lower
          sort order appears first. Leave end date empty for &quot;Present&quot;.
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
              <Label htmlFor="sortOrder">Order (0 = first on timeline)</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min={0}
                max={9999}
                required
                defaultValue={editing?.sortOrder ?? rows.length * 10}
                className="border-white/15 bg-black/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                name="location"
                placeholder="Remote"
                defaultValue={editing?.location ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                required
                defaultValue={editing?.company ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / title</Label>
              <Input
                id="role"
                name="role"
                required
                defaultValue={editing?.role ?? ""}
                className="border-white/15 bg-black/50"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={
                  editing?.startDate
                    ? toDateInputValue(editing.startDate)
                    : ""
                }
                className="border-white/15 bg-black/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End date (empty = Present)</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={
                  editing?.endDate ? toDateInputValue(editing.endDate) : ""
                }
                className="border-white/15 bg-black/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <textarea
              id="summary"
              name="summary"
              required
              rows={5}
              defaultValue={editing?.summary ?? ""}
              className="glass-panel w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">
              Achievements (one bullet per line)
            </Label>
            <textarea
              id="achievements"
              name="achievements"
              rows={6}
              defaultValue={
                editing?.achievements?.length
                  ? editing.achievements.join("\n")
                  : ""
              }
              placeholder={"Shipped X\nLed Y"}
              className="glass-panel w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">
              Technologies (comma or newline separated)
            </Label>
            <textarea
              id="technologies"
              name="technologies"
              rows={3}
              defaultValue={
                editing?.technologies?.length
                  ? editing.technologies.join(", ")
                  : ""
              }
              placeholder="Playwright, TypeScript, AWS"
              className="glass-panel w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none"
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
          All roles ({rows.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 bg-black/50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-mono text-xs">{r.sortOrder}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    {r.company}
                  </td>
                  <td className="max-w-[220px] px-4 py-3 text-slate-200">
                    {r.role}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {toDateInputValue(r.startDate)}
                    {" → "}
                    {r.endDate ? toDateInputValue(r.endDate) : "Present"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingId(r.id)}
                      >
                        Edit
                      </Button>
                      <form
                        action={deleteExperienceFormAction}
                        onSubmit={(e) => {
                          if (!window.confirm("Delete this experience row?")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={r.id} />
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
