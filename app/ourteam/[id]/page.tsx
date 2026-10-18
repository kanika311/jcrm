import { getCandidateById, TEAM_MEMBERS, maskEmail, maskPhone } from "@/lib/teamData";
import CandidateDetailClient from "../../im/[id]/CandidateDetailClient";
import { prisma } from "@/lib/prisma";
import { isOurTeamStatus } from "@/lib/teamStatus";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

export const dynamicParams = true;

export async function generateStaticParams() {
  const staticList = TEAM_MEMBERS.map((member) => ({
    id: member.id,
  }));

  try {
    const dbMembers = await prisma.teamMember.findMany({
      where: {
        status: { in: ["STUDENT", "APPROVED", "PLACED", "ALUMNI"] },
      },
      select: { id: true },
    });
    return [...staticList, ...dbMembers.map((m) => ({ id: m.id }))];
  } catch {
    return staticList;
  }
}

export default async function OurTeamCandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Try finding in DB first
  let dbMember = null;
  try {
    dbMember = await prisma.teamMember.findUnique({
      where: { id },
    });
  } catch {}

  if (dbMember) {
    const isPubliclyActive = isOurTeamStatus(dbMember.status);
    if (!isPubliclyActive) {
      const session = await getServerSession(authOptions).catch(() => null);
      const isAdmin = session?.user?.role === "ADMIN";
      if (!isAdmin) {
        return (
          <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Profile Under Review</h2>
            <p className="text-sm text-slate-600 mb-6">
              This candidate application is currently inactive and awaiting admin activation.
            </p>
            <Link href="/ourteam" className="text-sm font-bold text-[#0055FF] hover:underline">
              ← Back to Our Team
            </Link>
          </div>
        );
      }
    }

    const maskedPhone = maskPhone(dbMember.phone);
    const maskedEmail = maskEmail(dbMember.email);

    const member = {
      id: dbMember.id,
      name: dbMember.name,
      role: dbMember.role || "Software Engineering Intern",
      image: dbMember.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
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
