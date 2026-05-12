"use server";

import { signOut } from "@/auth";

export async function signOutAdminAction() {
  await signOut({ redirectTo: "/admin/login" });
}
