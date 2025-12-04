import Cookies from "js-cookie";
import { NextResponse } from "next/server";

export function middleware(req) {
  const accessToken = Cookies.get("accessToken");

  const { pathname } = req.nextUrl;

  // Protect login/register from authenticated users
  const authRoutes = ["/login", "/register"];

  if (accessToken && authRoutes.includes(pathname)) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"], // Only apply on these routes
};
