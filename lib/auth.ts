export const protectedRoutes = ["/dashboard", "/history"];
export const authRoutes = ["/login", "/signup"];

export function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export function isAuthRoute(pathname: string) {
  return authRoutes.some((route) => pathname.startsWith(route));
}
