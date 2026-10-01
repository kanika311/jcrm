import FacultyLayoutClient from "./FacultyLayoutClient";
import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SPONSORED_AD, SponsoredAd } from "@/lib/sponsoredAd";

async function loadSponsoredAd(): Promise<SponsoredAd> {
  try {
    const adRecord = await prisma.siteContent.findUnique({
      where: { pageId: "sponsored-ads-list" },
    });
    if (adRecord && Array.isArray(adRecord.content) && adRecord.content.length > 0) {
      const ads = adRecord.content as unknown as SponsoredAd[];
      return ads.find((a) => a.isActive) || ads[0] || DEFAULT_SPONSORED_AD;
    }

    const legacyRecord = await prisma.siteContent.findUnique({
      where: { pageId: "ourteam-sponsored-ad" },
    });
    if (legacyRecord?.content && typeof legacyRecord.content === "object") {
      return legacyRecord.content as unknown as SponsoredAd;
    }
  } catch (error) {
    console.error("Failed to load faculty sponsored ad:", error);
  }
  return DEFAULT_SPONSORED_AD;
}

export default async function FacultyLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth?callbackUrl=/faculty");
  }

  // If a student tries to access /faculty, redirect them to student dashboard
  if (session.user.role === "STUDENT") {
    redirect("/student");
  }

  const facultyFilter =
    session.user.role === "ADMIN" ? {} : { course: { facultyId: session.user.id } };

  const [studentCount, paidEnrollments, cmsData, sponsoredAd] = await Promise.all([
    prisma.enrollment
      .count({
        where: {
          paymentStatus: "COMPLETED",
          ...facultyFilter,
        },
      })
      .catch(() => 0),
    prisma.enrollment
      .findMany({
        where: {
          paymentStatus: "COMPLETED",
          ...facultyFilter,
        },
        include: { course: { select: { price: true } } },
      })
      .catch(() => [] as { course: { price: number } }[]),
    getSiteContent("faculty-navbar"),
    loadSponsoredAd(),
  ]);

  const hasRevenue = paidEnrollments.some((row) => Number(row.course?.price || 0) > 0);

  return (
    <FacultyLayoutClient
      cmsData={cmsData}
      hasStudents={studentCount > 0}
      hasRevenue={hasRevenue}
      sponsoredAd={sponsoredAd}
    >
      {children}
    </FacultyLayoutClient>
  );
}