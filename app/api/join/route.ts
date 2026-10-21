import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      fullName,
      phoneNumber,
      emailAddress,
      dateOfBirth,
      country,
      state,
      city,
      pinCode,
      department,
      skills,
      college,
      courseMajor,
      experienceLevel,
      aboutYourself,
      photoPreview,
    } = data;

    if (!fullName || !emailAddress || !photoPreview) {
      return NextResponse.json(
        { message: "Full name, email address, and profile photo are all mandatory" },
        { status: 400 }
      );
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    let finalPhoto = photoPreview || null;
    if (photoPreview && typeof photoPreview === "string" && photoPreview.startsWith("data:image/")) {
      try {
        const match = photoPreview.match(/^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/);
        if (match && match[1]) {
          const rawBuffer = Buffer.from(match[1], "base64");
          const compressed = await sharp(rawBuffer, { failOn: "none" })
            .rotate()
            .resize(480, 480, { fit: "cover", withoutEnlargement: true })
            .webp({ quality: 80, effort: 4 })
            .toBuffer();
          finalPhoto = `data:image/webp;base64,${compressed.toString("base64")}`;
        }
      } catch (sharpErr) {
        console.warn("[JOIN_PHOTO_COMPRESSION_WARN]", sharpErr);
      }
    }

    const newMember = await prisma.teamMember.create({
      data: {
        name: fullName,
        email: emailAddress,
        phone: phoneNumber || null,
        role: department || "Software Engineering Intern",
        department: department || null,
        image: finalPhoto,
        city: city || null,
        state: state || null,
        country: country || "India",
        pinCode: pinCode || null,
        dateOfBirth: dateOfBirth || null,
        college: college || null,
        education: courseMajor || null,
        experience: experienceLevel || "Fresher / Intern",
        skills: skillsArray,
        bio: aboutYourself || null,
        status: "CANDIDATE",
        isVerified: false,
      },
    });

    return NextResponse.json({
      success: true,
      id: newMember.id,
      name: newMember.name,
      message: "Application submitted successfully and sent for admin review!",
    });
  } catch (error: any) {
    console.error("[JOIN_SUBMIT_ERROR]", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
