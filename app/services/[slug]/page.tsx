import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SERVICES, ServiceCategory } from "@/lib/servicesData";
import ServicesClient from "../ServicesClient";
import { getSeoMetadata } from "@/lib/seoConfig";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getSeoMetadata(`/services/${slug}`);
}

export default async function ServiceSlugPage({ params }: PageProps) {
  const { slug } = await params;

  let services: ServiceCategory[] = DEFAULT_SERVICES;

  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "services-config" },
    });

    if (record && Array.isArray(record.content) && record.content.length > 0) {
      services = record.content as unknown as ServiceCategory[];
    }
  } catch (err) {
    console.error("Failed to load services for slug page:", err);
  }

  const activeServices = services.filter((s) => s.isActive !== false);
  const found = activeServices.find((s) => s.slug === slug);

  if (!found && slug !== "seo" && slug !== "social-media") {
    notFound();
  }

  return (
    <ServicesClient
      services={activeServices.length > 0 ? activeServices : DEFAULT_SERVICES}
      activeSlug={slug}
    />
  );
}
