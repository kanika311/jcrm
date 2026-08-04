import EngineerPortfolioClient from "./EngineerPortfolioClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EngineerPortfolioPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const faculty = await prisma.user.findUnique({
    where: { 
      id: id,
      role: "INSTRUCTOR",
      isBlocked: false,
    },
    include: {
      profile: true,
      courses: {
        where: { status: "PUBLISHED" },
      }
    }
  });

  if (!faculty) {
    notFound();
  }

  return <EngineerPortfolioClient faculty={faculty} />;
}
