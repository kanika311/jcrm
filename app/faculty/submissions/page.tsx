import SubmissionsClient from "./SubmissionsClient";
import { getSiteContent } from "@/lib/cms";

export default async function SubmissionsPage() {
  const cmsData = await getSiteContent("faculty-submissions");

  return <SubmissionsClient cmsData={cmsData} />;
}