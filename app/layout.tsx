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
  title: {
    default: "JCRM Technologies — Engineering Education for the Future",
    template: "%s | JCRM Technologies",
  },
  description:
    "Project-based engineering courses taught by the industry's top 1%. Build real products, earn verified credentials, launch your career.",
  keywords: ["LMS", "engineering", "courses", "react", "typescript", "machine learning", "live classes"],
  openGraph: {
    title: "JCRM Technologies — Engineering Education for the Future",
    description: "Project-based engineering courses taught by the industry's top 1%.",
    type: "website",
  },
};

import AuthProvider from "@/components/AuthProvider";
import { getSiteContent } from "@/lib/cms";
import Footer from "@/components/Footer";
import GlobalWhatsAppWidget from "@/components/GlobalWhatsAppWidget";

// CMS + auth are request-time; avoid DB connections during static page generation.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [globalSettings, navbarConfig, footerConfig] = await Promise.all([
    getSiteContent("global-settings"),
    getSiteContent("public-navbar"),
    getSiteContent("global-footer"),
  ]);

  return (
    <html lang="en" data-theme="dark" className={`${fontHeading.variable} ${fontBody.variable} ${fontButton.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-transparent" style={{ color: "var(--text-primary)" }}>
        <AuthProvider>
          <DynamicBackgroundExtract />
          <Navbar siteName={globalSettings.siteName} links={navbarConfig.links} logoUrl={globalSettings.logoUrl} />
          <main className="flex-1 flex flex-col relative z-10">{children}</main>
          <Footer cmsData={footerConfig} siteName={globalSettings.siteName} />
          <GlobalWhatsAppWidget />
        </AuthProvider>
      </body>
    </html>
  );
}