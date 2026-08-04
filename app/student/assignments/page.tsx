import AssignmentsClient from "./AssignmentsClient";
import { getSiteContent } from "@/lib/cms";

export default async function AssignmentsPage() {
  const cmsData = await getSiteContent("student-assignments");

  return <AssignmentsClient cmsData={cmsData} />;
}