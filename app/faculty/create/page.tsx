import CreateClient from "./CreateClient";
import { getSiteContent } from "@/lib/cms";

export default async function CreateCoursePage() {
  const cmsData = await getSiteContent("faculty-builder");

  return <CreateClient cmsData={cmsData} />;
}