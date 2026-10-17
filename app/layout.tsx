import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import { getSiteContent } from "@/lib/cms";
import Footer from "@/components/Footer";
import ClientOverlays from "@/components/ClientOverlays";
import { GoogleAnalytics } from "@next/third-parties/google";

const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jcrm.in"),
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
  title: {
    default: "JCRM Technologies | Engineering Courses & ERP Software",
    template: "%s | JCRM Technologies",
  },
  description:
    "JCRM Technologies  offers engineering courses, enterprise ERP software, internship and training with 100% placement assistance in India.",
  keywords: [
    "JCRM Technologies",
    "engineering courses",
    "ERP software",
    "internship and training",
    "placement assistance",
    "full stack web development",
    "machine learning courses",
    "hospital ERP software",
    "LMS software",
  ],
  
  openGraph: {
    title: "JCRM Technologies | Engineering Courses & ERP Software",
    description:
      "JCRM Technologies  offers engineering courses, enterprise ERP software, internship and training with 100% placement assistance in India.",
    url: "https://www.jcrm.in",
    siteName: "JCRM Technologies",
    images: [
      {
        url: "https://www.jcrm.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "JCRM Technologies - Engineering Courses & Enterprise ERP Solutions",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JCRM Technologies | Engineering Courses & ERP Software",
    description:
      "JCRM Technologies  offers engineering courses, enterprise ERP software, internship and training with 100% placement assistance in India.",
    images: [
      {
        url: "https://www.jcrm.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "JCRM Technologies - Engineering Courses & Enterprise ERP Solutions",
      },
    ],
  },
};

export const revalidate = 3600;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [globalSettings, navbarConfig, footerConfig] = await Promise.all([
    getSiteContent("global-settings"),
    getSiteContent("public-navbar"),
    getSiteContent("global-footer"),
  ]);

  const gaId =
    process.env.NEXT_PUBLIC_GA_ID && process.env.NEXT_PUBLIC_GA_ID !== "G-XXXXXXXXXX"
      ? process.env.NEXT_PUBLIC_GA_ID
      : "G-WEC25ESY7B";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "EducationalOrganization", "LocalBusiness"],
        "@id": "https://www.jcrm.in/#organization",
        name: globalSettings?.siteName || "JCRM Technologies",
        alternateName: [ "JCRM"],
        url: "https://www.jcrm.in",
        logo: "https://www.jcrm.in/logo-jcrm.webp",
        image: "https://www.jcrm.in/og-image.png",
        description:
          globalSettings?.tagline ||
          footerConfig?.brandDescription ||
          "JCRM Technologies  provides enterprise ERP software, industry-grade engineering education, internship programs, and placement assistance.",
        telephone: footerConfig?.contactPhone || "+91-8310531309",
        email: footerConfig?.contactEmail || "hr@jcrm.in",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Chak Goraiya, Sikhar",
          addressLocality: "Mirzapur",
          addressRegion: "Uttar Pradesh",
          postalCode: "231306",
          addressCountry: "IN",
        },
        sameAs: [
          footerConfig?.linkedinUrl || "https://www.linkedin.com/company/jcrm-technologies",
          footerConfig?.twitterUrl || "https://x.com/jcrm_tech",
          footerConfig?.instagramUrl || "https://instagram.com/jcrm_technologies?rpxt=N2YydHQwdmNxN2Rx",
          footerConfig?.facebookUrl || "https://www.facebook.com/jcrmtech",
          footerConfig?.youtubeUrl || "https://www.youtube.com/@jcrmtechnologies",
        ],
        priceRange: "₹₹",
      },
    ],
  };

  return (
    <html lang="en-IN" data-theme="dark" className={`${fontHeading.variable} ${fontBody.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-transparent">
        <AuthProvider>
          <ClientOverlays />
          <Navbar siteName={globalSettings.siteName} links={navbarConfig.links} logoUrl={globalSettings.logoUrl} />
          <main className="flex-1 flex flex-col relative z-10 min-h-0">{children}</main>
          <Footer cmsData={footerConfig} siteName={globalSettings.siteName} />
        </AuthProvider>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}