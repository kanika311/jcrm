import LandingPageClient from "@/components/LandingPageClient";
import { getSiteContent } from "@/lib/cms";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PLACED_CANDIDATES } from "@/app/api/admin/team/placement/route";
import { DEFAULT_CLIENTS_PROJECTS } from "@/lib/clientsProjectsData";
import { sanitizeCandidateImage } from "@/lib/imageCleanServer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cmsData, placedData, homepageMembers, clientsProjectsData] = await Promise.all([
    getSiteContent("public-home"),
    getSiteContent("placed-candidates", { candidates: DEFAULT_PLACED_CANDIDATES }),
    prisma.teamMember.findMany({
      where: { status: { in: ["PLACED", "ALUMNI"] } },
      select: {
        id: true,
        name: true,
        role: true,
        image: true,
        company: true,
        department: true,
      },
      orderBy: { updatedAt: "desc" },
    }).catch(() => []),
    getSiteContent("clients-projects", { projects: DEFAULT_CLIENTS_PROJECTS }),
  ]);

  const fromTeam = await Promise.all(
    homepageMembers.map(async (m) => ({
      name: m.name,
      role: m.role,
      image: await sanitizeCandidateImage(m.id, m.image),
      company: (m as any).company || m.department || "",
    }))
  );

  const fromCms = Array.isArray(placedData?.candidates) ? placedData.candidates : [];
  const rawCandidates =
    fromTeam.length > 0 ? fromTeam : fromCms.length > 0 ? fromCms : DEFAULT_PLACED_CANDIDATES;

  // Sanitize and ensure WebP compressed image delivery for every candidate
  const placedCandidates = await Promise.all(
    rawCandidates.map(async (c: any, idx: number) => ({
      ...c,
      image: await sanitizeCandidateImage(c.id || `candidate-${idx}`, c.image),
    }))
  );

  const rawProjects = Array.isArray(clientsProjectsData?.projects)
    ? clientsProjectsData.projects
    : DEFAULT_CLIENTS_PROJECTS;
  const clientsProjects = rawProjects.length > 0 ? rawProjects : DEFAULT_CLIENTS_PROJECTS;

  return (
    <LandingPageClient
      initialData={cmsData}
      initialPlacedCandidates={placedCandidates}
      initialClientsProjects={clientsProjects}
    />
  );
}
