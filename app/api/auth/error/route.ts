import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get("error") || "AuthenticationFailed";
  const origin = req.nextUrl.origin || "https://www.jcrm.in";
  
  // Safe redirect to public /auth portal with encoded error, never leaking secret admin routes
  return NextResponse.redirect(
    new URL(`/auth?error=${encodeURIComponent(error)}`, origin)
  );
}
