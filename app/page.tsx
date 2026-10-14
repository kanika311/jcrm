import { getSiteContent } from "@/lib/cms";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PLACED_CANDIDATES } from "@/lib/placedCandidatesData";
import { DEFAULT_CLIENTS_PROJECTS } from "@/lib/clientsProjectsData";
import { DEFAULT_REVIEWS } from "@/lib/reviewsData";
import { sanitizeCandidateImage } from "@/lib/imageCleanServer";
import HeroSection from "@/components/home/HeroSection";
import StatsStrip from "@/components/home/StatsStrip";
import MarqueeSection from "@/components/home/MarqueeSection";
import ErpProductsSection from "@/components/home/ErpProductsSection";
import CtaBanner from "@/components/home/CtaBanner";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import TrainingPlacementSection from "@/components/home/TrainingPlacementSection";
import PlacedCandidatesSection from "@/components/home/PlacedCandidatesSection";
import dynamic from "next/dynamic";
const ClientsProjectsSection = dynamic(
  () => import("@/components/ClientsProjectsSection")
);
import TalentNetworkSection from "@/components/home/TalentNetworkSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustAuthoritySection from "@/components/home/TrustAuthoritySection";
import FaqSection, { FAQS } from "@/components/home/FaqSection";

export const revalidate = 3600;

export default async function Home() {
  const [cmsData, placedData, homepageMembers, clientsProjectsData, faqCms, testimonialsRecord] =
    await Promise.all([
      getSiteContent("public-home"),
      getSiteContent("placed-candidates", { candidates: DEFAULT_PLACED_CANDIDATES }),
      prisma.teamMember
        .findMany({
          where: { status: { in: ["PLACED", "ALUMNI"] } },
          select: {
            id: true,
            name: true,
            role: true,
            image: true,
            company: true,
            department: true,
          },
          orderBy: { updatedAt: "desc" },
        })
        .catch(() => []),
      getSiteContent("clients-projects", { projects: DEFAULT_CLIENTS_PROJECTS }),
      getSiteContent("public-faq"),
      getSiteContent("public-testimonials", { reviews: DEFAULT_REVIEWS }),
    ]);

  const fromTeam = await Promise.all(
    homepageMembers.map(async (m) => ({
      name: m.name,
      role: m.role,
      image: await sanitizeCandidateImage(m.id, m.image),
      company: (m as any).company || m.department || "",
    }))
  );

  const fromCms = Array.isArray(placedData?.candidates) ? placedData.candidates : [];
  const rawCandidates =
    fromTeam.length > 0 ? fromTeam : fromCms.length > 0 ? fromCms : DEFAULT_PLACED_CANDIDATES;

  // Sanitize and ensure WebP compressed image delivery for every candidate
  const placedCandidates = await Promise.all(
    rawCandidates.map(async (c: any, idx: number) => ({
      ...c,
      image: await sanitizeCandidateImage(c.id || `candidate-${idx}`, c.image),
    }))
  );

  const rawProjects = Array.isArray(clientsProjectsData?.projects)
    ? clientsProjectsData.projects
    : DEFAULT_CLIENTS_PROJECTS;
  const clientsProjects = rawProjects.length > 0 ? rawProjects : DEFAULT_CLIENTS_PROJECTS;

  const rawReviews = Array.isArray(testimonialsRecord?.reviews)
    ? testimonialsRecord.reviews
    : DEFAULT_REVIEWS;

  const rawFaqs = Array.isArray(faqCms?.faqs) && faqCms.faqs.length > 0 ? faqCms.faqs : FAQS;
  const activeFaqs = rawFaqs.filter((f: any) => f && (f.question || f.answer));
  const finalFaqs = activeFaqs.length > 0 ? activeFaqs : FAQS;

  // 1. FAQPage JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: finalFaqs.map((f: any) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  // 2. Course ItemList JSON-LD Schema
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Engineering Courses & Training at JCRM Technologies",
    description: "Industry-aligned engineering training programs with 100% placement assistance by JCRM Technologies .",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Course",
          name: "Frontend Development",
          description: "Master modern responsive web apps, state management, and Next.js frontend architecture.",
          provider: {
            "@type": "Organization",
            name: "JCRM Technologies",
            sameAs: "https://www.jcrm.in",
          },
          url: "https://www.jcrm.in/courses/frontend-development",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Course",
          name: "Backend Development",
          description: "Build high-scale microservices, REST APIs, Kafka streaming, and robust backend architectures with Java Spring Boot and PostgreSQL.",
          provider: {
            "@type": "Organization",
            name: "JCRM Technologies",
            sameAs: "https://www.jcrm.in",
          },
          url: "https://www.jcrm.in/courses/backend-development",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Course",
          name: "AI & Machine Learning",
          description: "Build Neural Networks, Generative AI models, Retrieval-Augmented Generation (RAG), and autonomous AI agents.",
          provider: {
            "@type": "Organization",
            name: "JCRM Technologies",
            sameAs: "https://www.jcrm.in",
          },
          url: "https://www.jcrm.in/courses/ai-machine-learning",
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Course",
          name: "Data Science",
          description: "Master statistical modeling, data visualization, predictive analytics, and enterprise data warehousing with Python and SQL.",
          provider: {
            "@type": "Organization",
            name: "JCRM Technologies",
            sameAs: "https://www.jcrm.in",
          },
          url: "https://www.jcrm.in/courses/data-science",
        },
      },
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "Course",
          name: "Cloud & DevOps",
          description: "Automate cloud deployment pipelines, container orchestration with Kubernetes, and IaC with Terraform on AWS.",
          provider: {
            "@type": "Organization",
            name: "JCRM Technologies",
            sameAs: "https://www.jcrm.in",
          },
          url: "https://www.jcrm.in/courses/cloud-devops",
        },
      },
      {
        "@type": "ListItem",
        position: 6,
        item: {
          "@type": "Course",
          name: "Cyber Security",
          description: "Master network penetration testing, SOC monitoring, incident response, and ethical hacking protocols.",
          provider: {
            "@type": "Organization",
            name: "JCRM Technologies",
            sameAs: "https://www.jcrm.in",
          },
          url: "https://www.jcrm.in/courses/cyber-security",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      <div className="min-h-screen pt-16 sm:pt-20">
        <HeroSection
          title={cmsData?.heroTitle}
          highlight={cmsData?.heroHighlight}
          subtitle={cmsData?.heroSubtitle}
        />
        <StatsStrip stats={cmsData?.stats} />
        <MarqueeSection
          companies={cmsData?.marquee}
          techStackHeading={cmsData?.techStackHeading}
          techStack={cmsData?.techStackMarquee}
        />
        <ErpProductsSection />
        <CtaBanner />
        <WhyChooseSection />
        <TrainingPlacementSection />
        <PlacedCandidatesSection candidates={placedCandidates} />
        <ClientsProjectsSection initialProjects={clientsProjects} />
        <TalentNetworkSection />
        <TestimonialsSection initialReviews={rawReviews} />
        <TrustAuthoritySection />
        <FaqSection
          badgeText={faqCms?.badgeText}
          headingPrefix={faqCms?.headingPrefix}
          headingHighlight={faqCms?.headingHighlight}
          faqs={finalFaqs}
        />
      </div>
    </>
  );
}
