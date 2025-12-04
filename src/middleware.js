import { NextResponse } from "next/server";

export function middleware(req) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  // Skip static files
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Login / Register page
  if (pathname === "/login" || pathname === "/register") {
    if (accessToken) {
      // Already logged in → redirect to /client
      return NextResponse.redirect(new URL("/client", req.url));
    }
    return NextResponse.next();
  }

  // Protected pages: jodi accessToken na thake → login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all pages except Next.js internals
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
