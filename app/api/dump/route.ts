import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Completely disable in production or for unauthenticated users
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse(null, { status: 404 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      phoneNumber: true,
      role: true,
      createdAt: true
    }
  });
  return NextResponse.json(users);
}
