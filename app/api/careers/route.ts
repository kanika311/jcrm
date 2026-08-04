import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      degree,
      university,
      graduationYear,
      shortTermGoal,
      longTermGoal,
      weaknesses,
      strengths,
      hobbies,
      remarkableAchievements,
    } = data;

    if (!firstName || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const form = await prisma.careerGuidanceForm.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        location,
        degree,
        university,
        graduationYear,
        shortTermGoal: shortTermGoal || "",
        longTermGoal: longTermGoal || "",
        weaknesses: weaknesses || "",
        strengths: strengths || "",
        hobbies: hobbies || "",
        remarkableAchievements: remarkableAchievements || "",
      },
    });

    return NextResponse.json({ success: true, form });
  } catch (error) {
    console.error("Error submitting career form:", error);
    return NextResponse.json({ error: "Failed to submit form." }, { status: 500 });
  }
}
