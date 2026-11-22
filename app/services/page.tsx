import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SERVICES, ServiceCategory } from "@/lib/servicesData";
import ServicesClient from "./ServicesClient";
import { getSeoMetadata } from "@/lib/seoConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = getSeoMetadata("/services");

export default async function ServicesPage() {
  let services: ServiceCategory[] = DEFAULT_SERVICES;

  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "services-config" },
    });

    if (record && Array.isArray(record.content) && record.content.length > 0) {
      services = record.content as unknown as ServiceCategory[];
    }
  } catch (err) {
    console.error("Failed to load services:", err);
  }

  const activeServices = services.filter((s) => s.isActive !== false);

  return (
    <ServicesClient
      services={activeServices.length > 0 ? activeServices : DEFAULT_SERVICES}
      activeSlug="seo"
    />
  );
}
