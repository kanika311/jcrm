import FacultyLayoutClient from "./FacultyLayoutClient";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function FacultyLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth?callbackUrl=/faculty");
  }

  // If a student tries to access /faculty, redirect them to student dashboard
  if (session.user.role === "STUDENT") {
    redirect("/student");
  }

  const cmsData = await getSiteContent("faculty-navbar");

  return (
    <FacultyLayoutClient cmsData={cmsData}>
      {children}
    </FacultyLayoutClient>
  );
}