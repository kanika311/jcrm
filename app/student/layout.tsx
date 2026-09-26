import StudentLayoutClient from "./StudentLayoutClient";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth?callbackUrl=/student");
  }

  const enrollmentCount = await prisma.enrollment
    .count({
      where: {
        studentId: session.user.id,
        paymentStatus: "COMPLETED",
      },
    })
    .catch(() => 0);

  // Admins/instructors who just bought a course must reach the classroom.
  // Only bounce them to their own dashboard when they have no enrollment.
  if (enrollmentCount === 0) {
    if (session.user.role === "INSTRUCTOR") {
      redirect("/faculty");
    }
    if (session.user.role === "ADMIN") {
      redirect("/admin");
    }
  }

  const cmsData = await getSiteContent("student-navbar");

  return (
    <StudentLayoutClient cmsData={cmsData} hasEnrollment={enrollmentCount > 0}>
      {children}
    </StudentLayoutClient>
  );
}