import { getSiteContent } from "@/lib/cms";
import LeadsClient from "./LeadsClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const cmsData = await getSiteContent("admin-leads");

  let users: any[] = [];
  let contactMessages: any[] = [];
  let careerForms: any[] = [];

  try {
    [users, contactMessages, careerForms] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          createdAt: true,
          role: true,
        },
      }),
      prisma.contactMessage.findMany({}),
      prisma.careerGuidanceForm.findMany({}),
    ]);
  } catch (error) {
    console.error("Failed to load admin leads:", error);
  }

  const leads: any[] = [];

  users.forEach((u) => {
    leads.push({
      id: u.id,
      source: `Signup (${u.role})`,
      name: u.fullName || u.name || "N/A",
      email: u.email,
      phone: u.phoneNumber || "N/A",
      status: "NEW",
      createdAt: u.createdAt,
      details: "Account Creation",
      rawData: u,
    });
  });

  contactMessages.forEach((c) => {
    leads.push({
      id: c.id,
      source: `Contact Form ${c.source ? `(${c.source})` : ""}`,
      name: `${c.firstName} ${c.lastName}`.trim(),
      email: c.email,
      phone: c.phone || "N/A",
      status: c.status,
      createdAt: c.createdAt,
      details: `Subject: ${c.subject}`,
      rawData: c,
    });
  });

  careerForms.forEach((c) => {
    leads.push({
      id: c.id,
      source: "Career Guidance Form",
      name: `${c.firstName} ${c.lastName}`.trim(),
      email: c.email,
      phone: c.phone || "N/A",
      status: c.status,
      createdAt: c.createdAt,
      details: `Degree: ${c.degree}, Location: ${c.location}`,
      rawData: c,
    });
  });

  leads.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <LeadsClient initialLeads={leads} cmsData={cmsData} />;
}
