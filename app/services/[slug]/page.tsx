import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SERVICES, ServiceCategory } from "@/lib/servicesData";
import ServicesClient from "../ServicesClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "seo") {
    return {
      title: "AI-Powered SEO Packages | JCRM Technologies",
      description:
        "Dominate search rankings with AI-powered SEO packages from JCRM Technologies. Higher ranks, maximum results.",
    };
  }
  if (slug === "social-media") {
    return {
      title: "Social Media Management Services | JCRM Technologies",
      description:
        "Build brand authority, viral reach, and high ROI on Facebook, LinkedIn, Instagram, and YouTube.",
    };
  }
  return {
    title: "Services & Growth Packages | JCRM Technologies",
  };
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
