import LandingPageClient from "@/components/LandingPageClient";
import { getSiteContent } from "@/lib/cms";
import { DEFAULT_PLACED_CANDIDATES } from "@/app/api/admin/team/placement/route";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cmsData, placedData] = await Promise.all([
    getSiteContent("public-home"),
    getSiteContent("placed-candidates", { candidates: DEFAULT_PLACED_CANDIDATES }),
  ]);

  const placedCandidates =
    Array.isArray(placedData?.candidates) && placedData.candidates.length > 0
      ? placedData.candidates
      : DEFAULT_PLACED_CANDIDATES;

  return (
    <LandingPageClient
      initialData={cmsData}
      initialPlacedCandidates={placedCandidates}
    />
  );
}
