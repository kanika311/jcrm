import CoursesClient from "./CoursesClient";
import { getSiteContent } from "@/lib/cms";

export default async function FacultyCoursesPage() {
  const cmsData = await getSiteContent("faculty-courses");

  return <CoursesClient cmsData={cmsData} />;
}