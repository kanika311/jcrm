import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

function withRequestOrigin(req: NextRequest, context: unknown) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) {
    const forwarded = req.headers.get("x-forwarded-proto");
    const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
    const proto = forwarded || (local ? "http" : "https");
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  return handler(req, context);
}

export { withRequestOrigin as GET, withRequestOrigin as POST };
