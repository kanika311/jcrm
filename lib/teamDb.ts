import { prisma } from "@/lib/prisma";
import { toCandidateSlug } from "@/lib/teamData";

export async function findTeamMemberByIdOrSlug(identifier: string) {
  if (!identifier) return null;
  const decoded = decodeURIComponent(identifier).trim();

  // 1. If it's a 24-character hex ObjectId, search by ID first
  if (/^[0-9a-fA-F]{24}$/.test(decoded)) {
    try {
      const byId = await prisma.teamMember.findUnique({ where: { id: decoded } });
      if (byId) return byId;
    } catch (err) {
      console.warn("[findTeamMemberByIdOrSlug] ID lookup warn:", err);
    }
  }

  // 2. Search database by slug or name match
  const targetSlug = toCandidateSlug(decoded);

  try {
    // Check all active members first
    const activeMembers = await prisma.teamMember.findMany({
      where: {
        status: { in: ["STUDENT", "APPROVED", "PLACED", "ALUMNI"] },
      },
    });

    const matched = activeMembers.find((m) => {
      return (
        m.id === decoded ||
        toCandidateSlug(m.name) === targetSlug ||
        m.name.toLowerCase() === decoded.toLowerCase()
      );
    });

    if (matched) return matched;

    // Fallback: check all members regardless of status
    const allMembers = await prisma.teamMember.findMany();
    const fallbackMatched = allMembers.find((m) => {
      return (
        m.id === decoded ||
        toCandidateSlug(m.name) === targetSlug ||
        m.name.toLowerCase() === decoded.toLowerCase()
      );
    });

    if (fallbackMatched) return fallbackMatched;
  } catch (err) {
    console.error("[findTeamMemberByIdOrSlug] Error:", err);
  }

  return null;
}
