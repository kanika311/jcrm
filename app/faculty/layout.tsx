import FacultyLayoutClient from "./FacultyLayoutClient";
import { getSiteContent } from "@/lib/cms";

export default async function FacultyLayout({ children }: { children: React.ReactNode }) {
  const cmsData = await getSiteContent("faculty-navbar");

  return (
    <FacultyLayoutClient cmsData={cmsData}>
      {children}
    </FacultyLayoutClient>
  );
}