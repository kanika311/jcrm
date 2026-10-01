import { TEAM_MEMBERS, toPublicTeamMember } from "@/lib/teamData";
import TeamDirectoryClient from "./TeamDirectoryClient";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SPONSORED_AD, SponsoredAd } from "@/lib/sponsoredAd";

export const dynamic = "force-dynamic";

export default async function TeamDirectoryPage() {
  let displayMembers = TEAM_MEMBERS;
  let sponsoredAd: SponsoredAd = DEFAULT_SPONSORED_AD;

  try {
    const [records, adRecord] = await Promise.all([
      prisma.teamMember.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.siteContent.findUnique({
        where: { pageId: "ourteam-sponsored-ad" },
      }),
    ]);

    if (adRecord && adRecord.content) {
      sponsoredAd = adRecord.content as any;
    }

    if (records.length > 0) {
      displayMembers = records.map(toPublicTeamMember);
    }
  } catch (err) {
    console.error("Error fetching team members or sponsored ad:", err);
  }

  return <TeamDirectoryClient members={displayMembers} initialSponsoredAd={sponsoredAd} />;
}
