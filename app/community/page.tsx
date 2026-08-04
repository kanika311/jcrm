import CommunityClient from "./CommunityClient";
import { getSiteContent } from "@/lib/cms";

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const cmsData = await getSiteContent("public-community");
  return <CommunityClient initialData={cmsData} />;
}
