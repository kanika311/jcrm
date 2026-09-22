import { TEAM_MEMBERS, TeamMember } from "@/lib/teamData";
import TeamDirectoryClient from "../im/TeamDirectoryClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OurTeamAliasPage() {
  let dbApproved: TeamMember[] = [];
  try {
    const records = await prisma.teamMember.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });

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
    console.error("Error fetching approved team members:", err);
  }

  // Combine DB approved members with static members (avoiding duplicate names/ids)
  const combinedMembers = [...dbApproved];
  for (const staticMember of TEAM_MEMBERS) {
    if (
      !combinedMembers.some(
        (m) => m.id === staticMember.id || m.name.toLowerCase() === staticMember.name.toLowerCase()
      )
    ) {
      combinedMembers.push(staticMember);
    }
  }

  return <TeamDirectoryClient members={combinedMembers} />;
}
