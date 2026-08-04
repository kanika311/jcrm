import ModerationClient from "./ModerationClient";
import { getSiteContent } from "@/lib/cms";

export default async function AdminModerationPage() {
  const cmsData = await getSiteContent("admin-moderation");

  return <ModerationClient cmsData={cmsData} />;
}