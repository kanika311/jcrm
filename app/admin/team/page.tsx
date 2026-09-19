import { prisma } from "@/lib/prisma";
import TeamManagementClient from "./TeamManagementClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { TEAM_MEMBERS } from "@/lib/teamData";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      redirect("/auth");
    }

    // Seed default team members if table is completely empty
    const count = await prisma.teamMember.count();
    if (count === 0) {
      for (const m of TEAM_MEMBERS) {
        await prisma.teamMember.create({
          data: {
            name: m.name,
            email: `${m.name.toLowerCase().replace(/\s+/g, ".")}@jcrmtechnologies.com`,
            phone: "+91 98765 43210",
            role: m.role,
            department: m.role,
            image: m.image,
            city: m.city,
            state: m.state,
            country: "India",
            college: m.college,
            education: m.education,
            experience: m.experience,
            skills: m.skills,
            bio: m.bio,
            status: "APPROVED",
            isVerified: true,
          },
        });
      }
    }

    // Fetch all team members
    const dbMembers = await prisma.teamMember.findMany({
      orderBy: { createdAt: "desc" },
    });

    const serializedMembers = dbMembers.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));

    return (
      <div className="max-w-[1300px] mx-auto space-y-8 pb-24">
        <TeamManagementClient initialMembers={serializedMembers as any} />
      </div>
    );
  } catch (error: any) {
    if (
      error.digest?.startsWith("NEXT_REDIRECT") ||
      error.digest === "DYNAMIC_SERVER_USAGE" ||
      error.message?.includes("Dynamic server usage")
    ) {
      throw error;
    }
    console.error("ADMIN_TEAM_PAGE_ERROR:", error);
    return (
      <div
        className="p-8 max-w-2xl mx-auto mt-12 text-center rounded-2xl border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
      >
        <h3 className="heading-font text-xl font-bold text-red-500 mb-2">Failed to load Team page</h3>
        <p className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
          A runtime server error occurred. Please check the message details below:
        </p>
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 text-left font-mono text-xs overflow-x-auto">
          {error.stack || error.message || String(error)}
        </div>
      </div>
    );
  }
}
