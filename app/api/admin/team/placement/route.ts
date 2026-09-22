import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const DEFAULT_PLACED_CANDIDATES = [
  {
    id: "default-1",
    name: "Neha Dahiya",
    role: "Sales & Marketing",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
    company: "Cognizant",
    package: "8.5 LPA"
  },
  {
    id: "default-2",
    name: "Shruti Srivastava",
    role: "Relationship Manager",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    company: "HDFC Bank",
    package: "7.2 LPA"
  },
  {
    id: "default-3",
    name: "Aarav Sharma",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    company: "TCS",
    package: "9.0 LPA"
  },
  {
    id: "default-4",
    name: "Rohan Verma",
    role: "Cloud & DevOps Engineer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    company: "Infosys",
    package: "10.5 LPA"
  },
  {
    id: "default-5",
    name: "Vanshika Srivastava",
    role: "Python Developer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    company: "Tech Mahindra",
    package: "6.8 LPA"
  },
  {
    id: "default-6",
    name: "Palak",
    role: "Business Analyst",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    company: "Deloitte",
    package: "11.2 LPA"
  },
  {
    id: "default-7",
    name: "Yashika ghai",
    role: "Human Resource",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    company: "Lloyd Tech",
    package: "6.5 LPA"
  },
  {
    id: "default-8",
    name: "Ananya Patel",
    role: "Full Stack Developer",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    company: "Wipro",
    package: "8.0 LPA"
  }
];

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
        content: { candidates: DEFAULT_PLACED_CANDIDATES },
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
