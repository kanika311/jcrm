import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Strip passwordHash before sending
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json(safeUser, { status: 200 });
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      // User table fields
      firstName,
      lastName,
      phoneNumber,
      
      // UserProfile table fields
      lifeStage,
      organization,
      degree,
      experienceYears,
      techStack,
      bio,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      country,
      state,
      city,
      pincode,
      languages,
      image,
    } = body;

    const userId = session.user.id;
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();

    // 1. Update User table
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { name: fullName, fullName: fullName }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(image !== undefined && { image }),
      },
    });

    // 2. Upsert UserProfile table
    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        lifeStage,
        organization,
        degree,
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : null,
        techStack: techStack || [],
        bio,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        country,
        state,
        city,
        pincode,
        languages: languages || [],
      },
      create: {
        userId,
        lifeStage,
        organization,
        degree,
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : null,
        techStack: techStack || [],
        bio,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        country,
        state,
        city,
        pincode,
        languages: languages || [],
      },
    });

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("[PROFILE_PUT_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Keep POST for Onboarding backward compatibility
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { role, lifeStage, organization, degree, experienceYears, techStack, bio, linkedinUrl, githubUrl, portfolioUrl, country, state, city, pincode, languages, image } = body;
    const userId = session.user.id;
    
    // Build User table updates
    const userUpdateData: any = {};
    if (session.user.role !== "ADMIN" && (role === "STUDENT" || role === "INSTRUCTOR")) {
      userUpdateData.role = role;
    }
    if (image) {
      userUpdateData.image = image;
    }
    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: userUpdateData });
    }
    await prisma.userProfile.upsert({
      where: { userId },
      update: { lifeStage, organization, degree, experienceYears: experienceYears ? parseInt(experienceYears, 10) : null, techStack: techStack || [], bio, linkedinUrl, githubUrl, portfolioUrl, country, state, city, pincode, languages: languages || [] },
      create: { userId, lifeStage, organization, degree, experienceYears: experienceYears ? parseInt(experienceYears, 10) : null, techStack: techStack || [], bio, linkedinUrl, githubUrl, portfolioUrl, country, state, city, pincode, languages: languages || [] },
    });
    return NextResponse.json({ message: "Profile saved successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
