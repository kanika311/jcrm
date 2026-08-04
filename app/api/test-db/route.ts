import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Create a dummy user in your Neon database
    const newUser = await prisma.user.create({
      data: {
        fullName: "Test User",
        email: `test-${Date.now()}@example.com`,
        passwordHash: "fake_hashed_password_123",
        role: "STUDENT",
      },
    });

    // 2. Fetch all users from the database
    const allUsers = await prisma.user.findMany();

    // 3. Return the data to the browser
    return NextResponse.json({
      message: "Database connection successful!",
      newlyCreatedUser: newUser,
      totalUsers: allUsers.length,
      users: allUsers
    });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
  }
}