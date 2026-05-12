"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteSkillFormAction,
  skillsFormAction,
  type SkillsActionState,
} from "@/features/admin/actions/skills";
import { SkillBucket } from "@/generated/prisma";

export type SkillRow = {
  id: string;
  name: string;
  slug: string;
  category: SkillBucket;
  proficiency: number;
  years: number | null;
  sortOrder: number;
};

const BUCKET_LABEL: Record<SkillBucket, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  AI_ML: "AI / ML",
  AUTOMATION: "Automation",
  DEVOPS: "DevOps",
  CLOUD: "Cloud",
  DATABASES: "Databases",
  ARCHITECTURE: "Architecture",
};

const BUCKETS = Object.values(SkillBucket) as SkillBucket[];

export function SkillsAdminPanel({ skills }: { skills: SkillRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = editingId ? skills.find((s) => s.id === editingId) : undefined;

  const [mutState, mutateAction] = useActionState<SkillsActionState, FormData>(
    skillsFormAction,
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
          {editingId ? "Edit skill" : "Add skill"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Slug is generated from the name (unique in the database).
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={editing?.name ?? ""}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              required
              defaultValue={editing?.category ?? "AUTOMATION"}
              className="glass-panel h-10 w-full rounded-xl border border-white/10 bg-black/35 px-3 text-sm text-white outline-none"
            >
              {BUCKETS.map((bucket) => (
                <option key={bucket} value={bucket} className="bg-slate-900">
                  {BUCKET_LABEL[bucket]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency (0–100)</Label>
            <Input
              id="proficiency"
              name="proficiency"
              type="number"
              min={0}
              max={100}
              required
              defaultValue={editing?.proficiency ?? 85}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years">Years (optional)</Label>
            <Input
              id="years"
              name="years"
              type="number"
              min={0}
              defaultValue={editing?.years ?? ""}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={editing?.sortOrder ?? 0}
              className="border-white/15 bg-black/50"
            />
          </div>

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button type="submit" variant="primary">
              {editingId ? "Update skill" : "Add skill"}
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
          All skills ({skills.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 bg-black/50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">%</th>
                <th className="px-4 py-3">Years</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-white">{s.name}</td>
                  <td className="px-4 py-3">{BUCKET_LABEL[s.category]}</td>
                  <td className="px-4 py-3">{s.proficiency}</td>
                  <td className="px-4 py-3">{s.years ?? "—"}</td>
                  <td className="px-4 py-3">{s.sortOrder}</td>
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
                        action={deleteSkillFormAction}
                        onSubmit={(e) => {
                          if (!window.confirm(`Delete “${s.name}”?`)) {
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
