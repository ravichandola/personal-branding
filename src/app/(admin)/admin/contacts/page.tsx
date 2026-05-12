import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ContactsPanel } from "@/features/admin/contacts-panel";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const contacts = await prisma.contact
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  const rows = contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    company: c.company,
    role: c.role,
    message: c.message,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Inbound contacts</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Every submission from the public contact form lands here. Reply from
          your mail client, triage by status, or remove noise.
        </p>
      </div>

      <ContactsPanel contacts={rows} />
    </div>
  );
}
