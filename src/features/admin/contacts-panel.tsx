"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  deleteContactAction,
  updateContactStatusAction,
  type ContactActionState,
} from "@/features/admin/actions/contacts";
import { ContactStatus } from "@/generated/prisma";

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
};

const STATUS_OPTIONS: ContactStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "RESOLVED",
  "SPAM",
];

const STATUS_LABEL: Record<ContactStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  SPAM: "Spam",
};

const STATUS_STYLE: Record<ContactStatus, string> = {
  NEW: "border-sky-500/40 bg-sky-500/10 text-sky-200",
  IN_PROGRESS: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  RESOLVED: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  SPAM: "border-slate-600 bg-slate-800/60 text-slate-400",
};

export function ContactsPanel({ contacts }: { contacts: ContactRow[] }) {
  const [statusState, statusAction] = useActionState<
    ContactActionState,
    FormData
  >(updateContactStatusAction, null);

  const [deleteState, deleteAction] = useActionState<
    ContactActionState,
    FormData
  >(deleteContactAction, null);

  const counts = contacts.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1;
      acc.total += 1;
      return acc;
    },
    { total: 0 } as Record<ContactStatus | "total", number>,
  );

  return (
    <div className="space-y-8">
      {(statusState || deleteState) && (statusState?.message || deleteState?.message) ? (
        <p
          className={
            statusState?.ok || deleteState?.ok
              ? "text-sm text-emerald-400"
              : "text-sm text-red-400"
          }
        >
          {statusState?.message ?? deleteState?.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATUS_OPTIONS.map((s) => (
          <div
            key={s}
            className={`rounded-2xl border px-5 py-4 ${STATUS_STYLE[s]}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
              {STATUS_LABEL[s]}
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">
              {counts[s] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-500">
        {counts.total} total inbound message{counts.total === 1 ? "" : "s"}
      </p>

      {contacts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-black/30 px-8 py-16 text-center">
          <p className="text-lg font-medium text-slate-300">Inbox is quiet</p>
          <p className="mt-2 text-sm text-slate-500">
            Submissions from the public contact form will land here.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/70 via-black/50 to-purple-950/25 shadow-[0_24px_60px_-40px_rgba(56,189,248,0.35)]"
            >
              <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLE[c.status]}`}
                    >
                      {STATUS_LABEL[c.status]}
                    </span>
                    <time
                      dateTime={c.createdAt}
                      className="text-xs text-slate-500"
                    >
                      {new Date(c.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white">{c.name}</p>
                    <p className="mt-1 text-sm text-sky-300/90">
                      <a href={`mailto:${c.email}`}>{c.email}</a>
                      {(c.company || c.role) && (
                        <span className="text-slate-400">
                          {" · "}
                          {[c.role, c.company].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </p>
                  </div>
                  <blockquote className="border-l-2 border-emerald-500/50 pl-4 text-[15px] leading-relaxed text-slate-300">
                    {c.message}
                  </blockquote>
                </div>

                <div className="flex shrink-0 flex-col justify-between gap-3 border-t border-white/10 pt-4 lg:w-56 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <form action={statusAction} className="space-y-2">
                    <input type="hidden" name="id" value={c.id} />
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={c.status}
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-sm text-white outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900">
                          {STATUS_LABEL[opt]}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="secondary" className="w-full">
                      Save status
                    </Button>
                  </form>
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="primary" className="w-full">
                      <a href={`mailto:${c.email}?subject=Re:%20Your%20message`}>
                        Reply in email
                      </a>
                    </Button>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full border-red-500/40 text-red-300 hover:bg-red-950/40"
                      >
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
