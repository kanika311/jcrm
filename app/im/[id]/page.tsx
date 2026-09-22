import { getCandidateById, TEAM_MEMBERS } from "@/lib/teamData";
import CandidateDetailClient from "./CandidateDetailClient";
import { prisma } from "@/lib/prisma";

export const dynamicParams = true;

export async function generateStaticParams() {
  const staticList = TEAM_MEMBERS.map((member) => ({
    id: member.id,
  }));

  try {
    const dbMembers = await prisma.teamMember.findMany({
      select: { id: true },
    });
    return [...staticList, ...dbMembers.map((m) => ({ id: m.id }))];
  } catch {
    return staticList;
  }
}

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Try finding in DB first
  let dbMember = null;
  try {
    dbMember = await prisma.teamMember.findUnique({
      where: { id },
    });
  } catch {}

  if (dbMember) {
    const maskedPhone = dbMember.phone ? dbMember.phone.replace(/(\d{6})\d{4}/, "xxxxxx$2") : "xxxxxx9070";
    const maskedEmail = dbMember.email ? dbMember.email.replace(/(.{2})(.*)(@.*)/, "$1xxxxxx$3") : "xx@gmail.com";

    const member = {
      id: dbMember.id,
      name: dbMember.name,
      role: dbMember.role || "Software Engineering Intern",
      image: dbMember.image || "",
      city: dbMember.city || "Bangalore",
      state: dbMember.state || "Karnataka",
      maskedPhone,
      maskedEmail,
      college: dbMember.college || "JCRM Engineering",
      education: dbMember.education || "Bachelor of Technology",
      experience: dbMember.experience || "Fresher / Intern",
      skills: dbMember.skills && dbMember.skills.length > 0 ? dbMember.skills : ["Full Stack", "JavaScript", "React"],
      bio: dbMember.bio || `${dbMember.name} is a software engineer and contributor at JCRM Technologies.`,
      isVerified: dbMember.isVerified,
    };

    return <CandidateDetailClient member={member} />;
  }

  // 2. Static list check
  const member = getCandidateById(id);

  if (!member) {
    const fallbackMember = {
      id,
      name: id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      role: "Software Engineering Intern",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      city: "Udupi",
      state: "Karnataka",
      maskedPhone: "xxxxxx9070",
      maskedEmail: "akxxxxxxxxxxxx@gmail.com",
      college: "SMVITM Udupi",
      education: "B.E. Computer Science and Engineering",
      experience: "Fresher / Intern",
      skills: ["Python", "React", "Node.js", "Machine Learning"],
      bio: "Software engineering intern trained on enterprise software applications at JCRM Technologies.",
      isVerified: true
    };
    return <CandidateDetailClient member={fallbackMember} />;
  }

  return <CandidateDetailClient member={member} />;
}
