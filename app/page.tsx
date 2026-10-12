import LandingPageClient from "@/components/LandingPageClient";
import { getSiteContent } from "@/lib/cms";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PLACED_CANDIDATES } from "@/app/api/admin/team/placement/route";
import { DEFAULT_CLIENTS_PROJECTS } from "@/lib/clientsProjectsData";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cmsData, placedData, homepageMembers, clientsProjectsData] = await Promise.all([
    getSiteContent("public-home"),
    getSiteContent("placed-candidates", { candidates: DEFAULT_PLACED_CANDIDATES }),
    prisma.teamMember.findMany({
      where: { status: { in: ["PLACED", "ALUMNI"] } },
      orderBy: { updatedAt: "desc" },
    }).catch(() => []),
    getSiteContent("clients-projects", { projects: DEFAULT_CLIENTS_PROJECTS }),
  ]);

  const fromTeam = homepageMembers.map((m) => ({
    name: m.name,
    role: m.role,
    image: m.image || "",
    company: (m as any).company || m.department || "",
  }));

  const fromCms = Array.isArray(placedData?.candidates) ? placedData.candidates : [];
  const placedCandidates =
    fromTeam.length > 0 ? fromTeam : fromCms.length > 0 ? fromCms : DEFAULT_PLACED_CANDIDATES;

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
