import EngineerPortfolioClient from "./EngineerPortfolioClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function slugify(value?: string | null) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default async function EngineerPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let faculty = await prisma.user.findFirst({
    where: {
      id,
      role: "INSTRUCTOR",
      isBlocked: false,
    },
    include: {
      profile: true,
      courses: { where: { status: "PUBLISHED" } },
    },
  }).catch(() => null);

  if (!faculty) {
    const instructors = await prisma.user.findMany({
      where: { role: "INSTRUCTOR", isBlocked: false },
      include: {
        profile: true,
        courses: { where: { status: "PUBLISHED" } },
      },
    });
    faculty =
      instructors.find(
        (u) => slugify(u.fullName) === id || slugify(u.name) === id || u.id === id
      ) || null;
  }

  if (!faculty) {
    const displayName = id
      .split("-")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const namedCourses = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
    }).catch(() => []);

    const courses = namedCourses.filter((c) => slugify(c.instructor) === id);

    if (!displayName) {
      notFound();
    }

    faculty = {
      id,
      fullName: displayName,
      name: displayName,
      image: null,
      email: "",
      profile: {
        bio: `${displayName} is a JCRM instructor. View their courses and teaching profile below.`,
        organization: "JCRM Technologies",
      },
      courses,
    } as any;
  }

  return <EngineerPortfolioClient faculty={faculty} />;
}
