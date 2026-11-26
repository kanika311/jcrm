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
  let canonicalSlug = slug;
  if (slug === "mobile-app-dev" || slug === "app-development" || slug === "app-dev") {
    canonicalSlug = "mobile-app-development";
  } else if (slug === "web-development" || slug === "website-dev" || slug === "web-dev") {
    canonicalSlug = "website-development";
  } else if (slug === "ai-video" || slug === "video-production" || slug === "video-editing") {
    canonicalSlug = "ai-video-production";
  }
  return getSeoMetadata(`/services/${canonicalSlug}`);
}

export default async function ServiceSlugPage({ params }: PageProps) {
  const { slug } = await params;

  let services: ServiceCategory[] = DEFAULT_SERVICES;

  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "services-config" },
    });

    if (record && Array.isArray(record.content) && record.content.length > 0) {
      const dbServices = record.content as unknown as ServiceCategory[];
      const existingSlugs = new Set(dbServices.map((s) => s.slug));
      const missingDefaults = DEFAULT_SERVICES.filter((ds) => !existingSlugs.has(ds.slug));
      services = [...dbServices, ...missingDefaults];
    }
  } catch (err) {
    console.error("Failed to load services for slug page:", err);
  }

  const activeServices = services.filter((s) => s.isActive !== false);

  let canonicalSlug = slug;
  if (slug === "mobile-app-dev" || slug === "app-development" || slug === "app-dev") {
    canonicalSlug = "mobile-app-development";
  } else if (slug === "web-development" || slug === "website-dev" || slug === "web-dev") {
    canonicalSlug = "website-development";
  } else if (slug === "ai-video" || slug === "video-production" || slug === "video-editing") {
    canonicalSlug = "ai-video-production";
  }

  const found = activeServices.find((s) => s.slug === canonicalSlug);

  if (!found && canonicalSlug !== "seo" && canonicalSlug !== "social-media") {
    notFound();
  }

  return (
    <ServicesClient
      services={activeServices.length > 0 ? activeServices : DEFAULT_SERVICES}
      activeSlug={canonicalSlug}
    />
  );
}
