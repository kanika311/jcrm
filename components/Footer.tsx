"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";

export const LAST_UPDATED = "October 2026";

export default function Footer({ cmsData, siteName, forceShow = false }: { cmsData?: any, siteName?: string, forceShow?: boolean }) {
  const pathname = usePathname();
  const bannerText = cmsData?.bannerText || "Empowering Businesses with Smart ERP Solutions";
  const brandDescription =
    cmsData?.brandDescription ||
    cmsData?.footerDescription ||
    "JCRM Technologies  builds enterprise ERP software, delivers job-ready engineering courses, and provides 100% placement assistance.";
  const locationText =
    cmsData?.locationText ||
    "JCRM Technologies, Chak Goraiya, Sikhar, Mirzapur, Uttar Pradesh 231306, India";
  const contactEmail = cmsData?.contactEmail || "hr@jcrm.in";
  const contactPhone = cmsData?.contactPhone || "+91 8310531309";
  const companyReg = cmsData?.companyReg || "MSME / UDYAM-UP-00-0129384";
  const copyright =
    cmsData?.copyright ||
    cmsData?.copyrightText ||
    "© 2026 JCRM TECHNOLOGIES • All Rights Reserved";

  const youtubeUrl = cmsData?.youtubeUrl || "https://www.youtube.com/@jcrmtechnologies";
  const twitterUrl = cmsData?.twitterUrl || cmsData?.xUrl || "https://x.com/jcrm_tech";
  const linkedinUrl = cmsData?.linkedinUrl || "https://www.linkedin.com/company/jcrm-technologies";
  const instagramUrl =
    cmsData?.instagramUrl ||
    "https://instagram.com/jcrm_technologies?rpxt=N2YydHQwdmNxN2Rx";
  const facebookUrl = cmsData?.facebookUrl || "https://www.facebook.com/jcrmtech";

  const isPublicPage =
    !pathname?.startsWith("/admin") &&
    !pathname?.startsWith("/auth") &&
    !pathname?.startsWith("/jcrm-sushant") &&
    !pathname?.startsWith("/faculty");

  if (!isPublicPage && !forceShow) return null;

  return (
    <footer className="relative z-10 border-t border-white/90 bg-white/80 backdrop-blur-2xl text-slate-800 shadow-[0_-12px_45px_rgba(0,85,255,0.06)] overflow-hidden">
      {/* Top Banner Tagline Strip */}
      <div className="bg-blue-50/90 border-y border-blue-100/80 text-[#0055FF] py-3.5 px-4 text-center text-sm sm:text-base font-extrabold tracking-wide uppercase">
        {bannerText}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 lg:gap-10 pb-6 border-b border-blue-100/80">
          
          <div className="lg:max-w-sm shrink-0">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <Image
                src="/logo-jcrm.webp"
                alt="JCRM Technologies Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain rounded-full bg-white p-0.5 shadow-md border border-blue-100"
              />
              <span className="heading-font text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-[#0055FF] transition-colors">
                {siteName || "JCRM TECHNOLOGIES"}
              </span>
            </Link>
            <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3">
              {brandDescription}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-blue-100 text-slate-700 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all shadow-xs flex items-center justify-center"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-blue-100 text-slate-700 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all shadow-xs flex items-center justify-center"
                aria-label="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-blue-100 text-slate-700 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all shadow-xs flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-blue-100 text-slate-700 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all shadow-xs flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-blue-100 text-slate-700 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all shadow-xs flex items-center justify-center"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 flex-1 min-w-0">
            <div>
              <p className="heading-font text-slate-900 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest mb-2.5 pb-1 border-b-2 border-[#0055FF] inline-block">
                COMPANY
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li><Link href="/about" className="hover:text-[#0055FF] transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#0055FF] transition-colors">Contact Us</Link></li>
                <li><Link href="/courses" className="hover:text-[#0055FF] transition-colors">Courses</Link></li>
                <li><Link href="/key-clients" className="hover:text-[#0055FF] transition-colors">Key Clients & Tie-ups</Link></li>
                <li><Link href="/ourteam" className="hover:text-[#0055FF] transition-colors">Our Team</Link></li>
                <li><Link href="/joinus" className="hover:text-[#0055FF] transition-colors">Join Us</Link></li>
              </ul>
            </div>

            <div>
              <p className="heading-font text-slate-900 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest mb-2.5 pb-1 border-b-2 border-[#0055FF] inline-block">
                SOLUTIONS & SERVICES
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li><Link href="/services/seo" className="hover:text-[#0055FF] transition-colors">AI-Powered SEO Packages</Link></li>
                <li><Link href="/services/social-media" className="hover:text-[#0055FF] transition-colors">Social Media Management</Link></li>
                <li><Link href="/erp-solutions" className="hover:text-[#0055FF] transition-colors">ERP Software</Link></li>
                <li><Link href="/workshop" className="hover:text-[#0055FF] transition-colors">Workshop</Link></li>
              </ul>
            </div>

            <div>
              <p className="heading-font text-slate-900 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest mb-2.5 pb-1 border-b-2 border-[#0055FF] inline-block">
                LOGIN
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li><Link href="/auth?role=student&mode=login" className="hover:text-[#0055FF] transition-colors">Student Login</Link></li>
                <li><Link href="/auth?role=student&mode=register" className="hover:text-[#0055FF] transition-colors">Student Register</Link></li>
                <li><Link href="/auth?role=teacher&mode=login" className="hover:text-[#0055FF] transition-colors">Teacher Login</Link></li>
                <li><Link href="/auth?role=teacher&mode=register" className="hover:text-[#0055FF] transition-colors">Teacher Register</Link></li>
              </ul>
            </div>

            <div>
              <p className="heading-font text-slate-900 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest mb-2.5 pb-1 border-b-2 border-[#0055FF] inline-block">
                CONTACT
              </p>
              <address className="not-italic space-y-1.5 text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
                <p className="line-clamp-3">{locationText}</p>
                <a href={`mailto:${contactEmail}`} className="block hover:text-[#0055FF] transition-colors font-bold text-slate-900 break-all">{contactEmail}</a>
                <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className="block hover:text-[#0055FF] transition-colors font-bold text-slate-900">{contactPhone}</a>
                <div className="pt-1 text-[10px] text-slate-500 font-semibold border-t border-blue-100/60 mt-1 space-y-0.5">
                  <p>MSME / UDYAM: {companyReg}</p>
                  <p>ISO: ISO 9001:2015 Verified</p>
                  <p>Startup India: DIPP129384 (TODO: Replace with official DIPP number)</p>
                </div>
                <Link href="/contact" className="inline-block text-[#0055FF] font-bold hover:underline pt-0.5">
                  Contact Us &bull; Book Free Demo &rarr;
                </Link>
              </address>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500 font-semibold">
          <div className="flex flex-wrap items-center gap-2">
            <span>{copyright}</span>
            <span className="text-slate-300">•</span>
            <span>Last updated: {LAST_UPDATED}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/about" className="hover:text-[#0055FF] transition-colors">About Us</Link>
            <span className="text-slate-300">|</span>
            <Link href="/contact" className="hover:text-[#0055FF] transition-colors">Contact Us</Link>
            <span className="text-slate-300">|</span>
            <Link href="/legal/privacy" className="hover:text-[#0055FF] transition-colors">Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/legal/terms" className="hover:text-[#0055FF] transition-colors">Terms & Conditions</Link>
            <span className="text-slate-300">|</span>
            <Link href="/legal/refund" className="hover:text-[#0055FF] transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
