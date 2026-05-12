import { redirect } from "next/navigation";

import { AuthForm } from "@/features/admin/login-form";

import { auth } from "@/auth";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-10 py-24">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          Restricted access
        </p>
        <h1 className="text-3xl font-semibold">Authenticate</h1>
        <p className="text-sm text-slate-400">
          Google SSO for operators and secure credential login for break-glass admins.
        </p>
      </div>
      <AuthForm />
    </div>
  );
}
