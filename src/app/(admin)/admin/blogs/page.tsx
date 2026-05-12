import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Blog CMS console</h1>
      <p className="text-sm text-slate-300">
        Scaffold module — wire mutations with Server Actions + React Hook Form editors. All routes are already protected by JWT middleware.
      </p>
    </div>
  );
}
