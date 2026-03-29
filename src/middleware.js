import { NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/admin-login",
  "/api",
  "/_next",
  "/favicon.ico",
];

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.some((route) =>
    route === "/"
      ? pathname === "/"
      : pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const adminAccessToken = request.cookies.get("adminAccessToken")?.value;
  const isAuthenticated = Boolean(accessToken || adminAccessToken);
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminAuthenticated = Boolean(adminAccessToken);

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (isAdminRoute && !isAdminAuthenticated) {
    const adminLoginUrl = new URL("/admin-login", request.url);
    adminLoginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(adminLoginUrl);
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
