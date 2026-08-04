import ProjectsClient from "./ProjectsClient";
import { getSiteContent } from "@/lib/cms";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const cmsData = await getSiteContent("public-projects");
  return <ProjectsClient initialData={cmsData} />;
}
