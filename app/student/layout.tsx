import StudentLayoutClient from "./StudentLayoutClient";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth?callbackUrl=/student");
  }

  // If a teacher logs in and tries to access /student, redirect them to their faculty portal
  if (session.user.role === "INSTRUCTOR") {
    redirect("/faculty");
  }

  // If an admin accesses /student, redirect them to admin console
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  const cmsData = await getSiteContent("student-navbar");

  return (
    <StudentLayoutClient cmsData={cmsData}>
      {children}
    </StudentLayoutClient>
  );
}