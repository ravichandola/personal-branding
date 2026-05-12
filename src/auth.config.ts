import type { NextAuthConfig } from "next-auth";

const adminAllowlist =
  process.env.ALLOWED_ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ??
  [];

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 6,
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      const isProtected =
        pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

      if (isProtected && !auth) {
        return false;
      }
      return true;
    },

    async session({ session, token }) {
      if (!session.user) return session;

      session.user.id = token.sub!;
      session.user.role = token.role as "ADMIN" | "EDITOR";

      return session;
    },

    async signIn({ account, profile }) {
      const emailLower = profile?.email?.toLowerCase() ?? "";

      if (account?.provider === "google") {
        if (adminAllowlist.length === 0) {
          // Allow first-time bootstrap in prod when unset — document lockdown requirement.
          return true;
        }
        return adminAllowlist.includes(emailLower);
      }

      return true;
    },
  },

  providers: [], // Implemented in ./auth.ts
};
