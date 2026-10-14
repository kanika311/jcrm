import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PLACED_CANDIDATES } from "@/lib/placedCandidatesData";

// Helper to get or seed placed candidates from SiteContent
async function getStoredPlacedCandidates(): Promise<any[]> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "placed-candidates" },
    });

    if (record && record.content && Array.isArray((record.content as any).candidates)) {
      return (record.content as any).candidates;
    }

    // Seed default if not yet created
    await prisma.siteContent.upsert({
      where: { pageId: "placed-candidates" },
      create: {
        pageId: "placed-candidates",
        category: "public",
        content: { candidates: DEFAULT_PLACED_CANDIDATES } as any,
      },
      update: {},
    });

    return DEFAULT_PLACED_CANDIDATES;
  } catch (err) {
    console.error("[GET_STORED_PLACED_CANDIDATES]", err);
    return DEFAULT_PLACED_CANDIDATES;
  }
}

// GET /api/admin/team/placement
export async function GET() {
  try {
    const candidates = await getStoredPlacedCandidates();
    return NextResponse.json({ candidates }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to fetch placed candidates" }, { status: 500 });
  }
}

// POST /api/admin/team/placement ?" Mark or Unmark candidate as placed
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { memberId, name, role, company, image, package: pkg, isPlaced } = body;

    if (!name) {
      return NextResponse.json({ message: "Candidate name is required" }, { status: 400 });
    }

    let candidates = await getStoredPlacedCandidates();

    if (isPlaced === false) {
      // Unmark / remove from placed candidates
      candidates = candidates.filter(
        (c) =>
          (memberId && c.memberId !== memberId) &&
          c.name.toLowerCase() !== name.toLowerCase()
      );
    } else {
      // Mark or update placement
      if (!company) {
        return NextResponse.json({ message: "Company name is required" }, { status: 400 });
      }

      const existingIndex = candidates.findIndex(
        (c) =>
          (memberId && c.memberId === memberId) ||
          c.name.toLowerCase() === name.toLowerCase()
      );

      const placedEntry = {
        id: memberId || `placed-${Date.now()}`,
        memberId: memberId || undefined,
        name,
        role: role || "Software Engineer",
        company,
        package: pkg || undefined,
        image: image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        placedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        candidates[existingIndex] = { ...candidates[existingIndex], ...placedEntry };
      } else {
        // Prepend so latest placed candidates appear first!
        candidates = [placedEntry, ...candidates];
      }
    }

    // Save updated list in database
    await prisma.siteContent.upsert({
      where: { pageId: "placed-candidates" },
      create: {
        pageId: "placed-candidates",
        category: "public",
        content: { candidates },
      },
      update: {
        content: { candidates },
      },
    });

    return NextResponse.json({ success: true, candidates }, { status: 200 });
  } catch (error: any) {
    console.error("[ADMIN_TEAM_PLACEMENT_POST]", error);
    return NextResponse.json({ message: error.message || "Failed to update placement status" }, { status: 500 });
  }
}
