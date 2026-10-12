import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get("error") || "AuthenticationFailed";
  const origin = req.nextUrl.origin || "http://localhost:3001";
  
  // Gracefully redirect to admin portal or auth with error query
  return NextResponse.redirect(
    new URL(`/jcrm-sushant?error=${encodeURIComponent(error)}`, origin)
  );
}
