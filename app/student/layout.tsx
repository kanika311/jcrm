import StudentLayoutClient from "./StudentLayoutClient";
import { getSiteContent } from "@/lib/cms";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const cmsData = await getSiteContent("student-navbar");

  return (
    <StudentLayoutClient cmsData={cmsData}>
      {children}
    </StudentLayoutClient>
  );
}