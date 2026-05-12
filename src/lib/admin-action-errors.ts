/** Extra detail for admin server actions (safe for browsers in development only). */
export function prismaAdminErrorDetail(error: unknown): string {
  if (process.env.NODE_ENV === "production") {
    return "See server logs.";
  }
  if (error instanceof Error) {
    const m = error.message.trim();
    if (!m) return "";
    return m.length > 500 ? `${m.slice(0, 500)}…` : m;
  }
  return "";
}

/** Readable DB host from DATABASE_URL (no credentials). */
export function databaseUrlHost(url?: string | null): string {
  if (!url?.trim()) return "DATABASE_URL is not set";
  try {
    const u = new URL(url);
    return u.hostname || "invalid host";
  } catch {
    return "DATABASE_URL is not a valid URL";
  }
}
