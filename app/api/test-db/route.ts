import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse(null, { status: 404 });
  }

  try {
    // Only verify connection count without exposing user hashes or polluting data
    const totalUsers = await prisma.user.count();
    return NextResponse.json({
      message: "Database connection verified",
      totalUsers,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
  }
}