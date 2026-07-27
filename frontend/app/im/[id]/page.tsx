import { getCandidateById, TEAM_MEMBERS } from "@/lib/teamData";
import CandidateDetailClient from "./CandidateDetailClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return TEAM_MEMBERS.map((member) => ({
    id: member.id,
  }));
}

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = getCandidateById(id);

  if (!member) {
    // If not found in primary list, provide fallback
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
