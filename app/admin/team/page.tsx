import { prisma } from "@/lib/prisma";
import TeamManagementClient from "./TeamManagementClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { TEAM_MEMBERS } from "@/lib/teamData";
import { getSiteContent } from "@/lib/cms";
import { DEFAULT_PLACED_CANDIDATES } from "@/lib/placedCandidatesData";
import { DEFAULT_SPONSORED_AD, SponsoredAd } from "@/lib/sponsoredAd";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      redirect("/jcrm-sushant");
    }

    // Fetch team members, placed candidates, and sponsored ad concurrently in a single parallel roundtrip
    let [dbMembers, placedData, sponsoredRecord] = await Promise.all([
      prisma.teamMember.findMany({
        orderBy: { createdAt: "desc" },
      }),
      getSiteContent("placed-candidates", { candidates: DEFAULT_PLACED_CANDIDATES }),
      prisma.siteContent.findUnique({
        where: { pageId: "sponsored-ads-list" },
      }),
    ]);

    // Only if table is completely empty (first run), seed default standard team members
    if (dbMembers.length === 0) {
      try {
        await Promise.all(
          TEAM_MEMBERS.map((m) =>
            prisma.teamMember.create({
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
            })
          )
        );
        dbMembers = await prisma.teamMember.findMany({
          orderBy: { createdAt: "desc" },
        });
      } catch (seedError) {
        console.error("ADMIN_TEAM_SEED_ERROR:", seedError);
      }
    }

    const serializedMembers = dbMembers.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));

    const initialPlacedCandidates = Array.isArray(placedData?.candidates) && placedData.candidates.length > 0
      ? placedData.candidates
      : DEFAULT_PLACED_CANDIDATES;

    let initialSponsoredAd: SponsoredAd = DEFAULT_SPONSORED_AD;
    if (sponsoredRecord && Array.isArray(sponsoredRecord.content) && sponsoredRecord.content.length > 0) {
      const ads = sponsoredRecord.content as unknown as SponsoredAd[];
      initialSponsoredAd = ads.find((a) => a.isActive) || ads[0] || DEFAULT_SPONSORED_AD;
    }

    return (
      <div className="max-w-[1300px] mx-auto space-y-8 pb-24">
        <TeamManagementClient
          initialMembers={serializedMembers as any}
          initialPlacedCandidates={initialPlacedCandidates}
          initialSponsoredAd={initialSponsoredAd}
        />
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
