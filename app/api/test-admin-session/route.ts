import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const dynamic = 'force-dynamic';

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.json({ 
    success: true, 
    hasSession: true,
    userRole: session.user.role 
  });
}

