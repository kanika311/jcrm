import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import DynamicBackgroundExtract from "@/components/DynamicBackgroundExtract";

const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const fontButton = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-button",
  weight: ["600", "700"],
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
    "JCRM Technologies (Jain CRM) offers engineering courses, enterprise ERP software, internship and training with 100% placement assistance in India.",
  keywords: [
    "JCRM Technologies",
    "Jain CRM",
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
      "JCRM Technologies (Jain CRM) offers engineering courses, enterprise ERP software, internship and training with 100% placement assistance in India.",
    url: "https://www.jcrm.in",
    siteName: "JCRM Technologies",
    images: [
      {
        url: "https://www.jcrm.in/logo-jcrm.webp",
        width: 640,
        height: 640,
        alt: "JCRM Technologies Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JCRM Technologies | Engineering Courses & ERP Software",
    description:
      "JCRM Technologies (Jain CRM) offers engineering courses, enterprise ERP software, internship and training with 100% placement assistance in India.",
    images: ["https://www.jcrm.in/logo-jcrm.webp"],
  },
};

import AuthProvider from "@/components/AuthProvider";
import { getSiteContent } from "@/lib/cms";
import Footer from "@/components/Footer";
import GlobalWhatsAppWidget from "@/components/GlobalWhatsAppWidget";
import { GoogleAnalytics } from "@next/third-parties/google";

export const revalidate = 3600;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "EducationalOrganization", "LocalBusiness"],
      "@id": "https://www.jcrm.in/#organization",
      name: "JCRM Technologies",
      alternateName: ["Jain CRM", "JCRM"],
      url: "https://www.jcrm.in",
      logo: "https://www.jcrm.in/logo-jcrm.webp",
      image: "https://www.jcrm.in/logo-jcrm.webp",
      description:
        "JCRM Technologies (Jain CRM) provides enterprise ERP software, industry-grade engineering education, internship programs, and placement assistance.",
      telephone: "+91-8310531309",
      email: "hr@jcrm.in",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Chak Goraiya, Sikhar",
        addressLocality: "Mirzapur",
        addressRegion: "Uttar Pradesh",
        postalCode: "231306",
        addressCountry: "IN",
      },
      sameAs: [
        "https://www.linkedin.com/company/jcrm-technologies",
        "https://x.com/jcrm_tech",
        "https://www.instagram.com/jcrm_tech",
        "https://www.facebook.com/jcrmtech",
        "https://www.youtube.com/@jcrmtechnologies",
      ],
      priceRange: "₹₹",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [globalSettings, navbarConfig, footerConfig] = await Promise.all([
    getSiteContent("global-settings"),
    getSiteContent("public-navbar"),
    getSiteContent("global-footer"),
  ]);

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en-IN" data-theme="dark" className={`${fontHeading.variable} ${fontBody.variable} ${fontButton.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-transparent" style={{ color: "var(--text-primary)" }}>
        <AuthProvider>
          <DynamicBackgroundExtract />
          <Navbar siteName={globalSettings.siteName} links={navbarConfig.links} logoUrl={globalSettings.logoUrl} />
          <main className="flex-1 flex flex-col relative z-10 min-h-0">{children}</main>
          <Footer cmsData={footerConfig} siteName={globalSettings.siteName} />
          <GlobalWhatsAppWidget />
        </AuthProvider>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}