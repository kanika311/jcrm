import type { Metadata } from "next";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import { getSiteContent } from "@/lib/cms";
import Footer from "@/components/Footer";
import ClientOverlays from "@/components/ClientOverlays";
import CookieConsent from "@/components/CookieConsent";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getSeoMetadata } from "@/lib/seoConfig";

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
  ...getSeoMetadata("/"),
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Read per-request nonce generated in proxy.ts
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

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
        alternateName: ["JCRM"],
        url: "https://www.jcrm.in",
        logo: "https://www.jcrm.in/logo-jcrm.webp",
        image: "https://www.jcrm.in/og-image.png",
        description:
          globalSettings?.tagline ||
          footerConfig?.brandDescription ||
          "JCRM Technologies provides enterprise ERP software, industry-grade engineering education, internship programs, and placement assistance.",
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
        {nonce && <meta name="csp-nonce" content={nonce} />}
        {/* Google Consent Mode v2 default declaration - denied until user grants consent */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied'});`,
          }}
        />
        <script
          nonce={nonce}
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
          <CookieConsent />
        </AuthProvider>
        {gaId ? <GoogleAnalytics gaId={gaId} nonce={nonce} /> : null}
      </body>
    </html>
  );
}
