/** Routes under `/admin` except `/admin/login` require authentication. */
export function isProtectedAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
}
