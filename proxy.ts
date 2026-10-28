import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  // Reject debug or probing HTTP methods
  if (req.method === "TRACE" || req.method === "TRACK") {
    return new NextResponse(null, { status: 405 });
  }

  const res = NextResponse.next();

  // Prevent caching of private authenticated dashboards and auth responses
  const pathname = req.nextUrl.pathname;
  if (
    pathname.startsWith("/student") ||
    pathname.startsWith("/faculty") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/onboarding")
  ) {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
  }

  return res;
}

export default proxy;

export const config = {
  matcher: [
    "/admin/:path*",
    "/faculty/:path*",
    "/student/:path*",
    "/auth",
    "/onboarding/:path*",
    "/api/auth/:path*",
  ],
};
