import FacultyLayoutClient from "./FacultyLayoutClient";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function FacultyLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth?callbackUrl=/faculty");
  }

  // If a student tries to access /faculty, redirect them to student dashboard
  if (session.user.role === "STUDENT") {
    redirect("/student");
  }

  const studentCount = await prisma.enrollment
    .count({
      where: {
        paymentStatus: "COMPLETED",
        ...(session.user.role === "ADMIN"
          ? {}
          : { course: { facultyId: session.user.id } }),
      },
    })
    .catch(() => 0);

  const cmsData = await getSiteContent("faculty-navbar");

  return (
    <FacultyLayoutClient cmsData={cmsData} hasStudents={studentCount > 0}>
      {children}
    </FacultyLayoutClient>
  );
}