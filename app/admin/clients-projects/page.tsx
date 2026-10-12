import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CLIENTS_PROJECTS, ClientProjectItem } from "@/lib/clientsProjectsData";
import ClientsProjectsClient from "./ClientsProjectsClient";

export const dynamic = "force-dynamic";

export default async function AdminClientsProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/jcrm-sushant");
  }

  let projects: ClientProjectItem[] = DEFAULT_CLIENTS_PROJECTS;

  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "clients-projects" },
    });

    if (record && record.content && Array.isArray((record.content as any).projects)) {
      projects = (record.content as any).projects;
    } else {
      await prisma.siteContent.upsert({
        where: { pageId: "clients-projects" },
        create: {
          pageId: "clients-projects",
          category: "public",
          content: { projects: DEFAULT_CLIENTS_PROJECTS } as any,
        },
        update: {},
      });
    }
  } catch (error) {
    console.error("Failed to load clients-projects data for admin:", error);
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-24">
      <ClientsProjectsClient initialProjects={projects} />
    </div>
  );
}
