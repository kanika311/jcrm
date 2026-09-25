import { TEAM_MEMBERS, TeamMember } from "@/lib/teamData";
import TeamDirectoryClient from "../im/TeamDirectoryClient";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SPONSORED_AD, SponsoredAd } from "@/lib/sponsoredAd";

export const dynamic = "force-dynamic";

export default async function OurTeamAliasPage() {
  let dbApproved: TeamMember[] = [];
  let sponsoredAd: SponsoredAd = DEFAULT_SPONSORED_AD;

  try {
    const [records, adRecord] = await Promise.all([
      prisma.teamMember.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.siteContent.findUnique({
        where: { pageId: "ourteam-sponsored-ad" },
      }),
    ]);

    if (adRecord && adRecord.content) {
      sponsoredAd = adRecord.content as any;
    }

    dbApproved = records.map((m) => {
      const maskedPhone = m.phone ? m.phone.replace(/(\d{6})\d{4}/, "xxxxxx$2") : "xxxxxx9070";
      const maskedEmail = m.email ? m.email.replace(/(.{2})(.*)(@.*)/, "$1xxxxxx$3") : "xx@gmail.com";

      return {
        id: m.id,
        name: m.name,
        role: m.role || "Software Engineering Intern",
        image: m.image || "",
        city: m.city || "Bangalore",
        state: m.state || "Karnataka",
        maskedPhone,
        maskedEmail,
        college: m.college || "JCRM Engineering",
        education: m.education || "Bachelor of Technology",
        experience: m.experience || "Fresher / Intern",
        skills: m.skills && m.skills.length > 0 ? m.skills : ["Full Stack", "JavaScript", "React"],
        bio: m.bio || `${m.name} is a software engineer and contributor at JCRM Technologies.`,
        isVerified: m.isVerified,
      };
    });
  } catch (err) {
    console.error("Error fetching approved team members or sponsored ad:", err);
  }

  // Single source of truth: DB approved members
  const displayMembers = dbApproved.length > 0 ? dbApproved : TEAM_MEMBERS;
  return <TeamDirectoryClient members={displayMembers} initialSponsoredAd={sponsoredAd} />;
}

