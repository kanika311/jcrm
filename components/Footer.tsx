"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function Footer({ cmsData, siteName }: { cmsData?: any, siteName?: string }) {
  const pathname = usePathname();
  const bannerText = cmsData?.bannerText || "Empowering Businesses with Smart ERP Solutions";
  const brandDescription =
    cmsData?.brandDescription ||
    cmsData?.footerDescription ||
    "We build powerful ERP systems and digital solutions that help businesses scale, automate workflows, and achieve operational excellence.";
  const locationText =
    cmsData?.locationText ||
    "404, 1st floor, 4th A Cross Rd, HRBR Layout 2nd Block, HRBR Layout, Kalyan Nagar, Bengaluru, Karnataka 560043";
  const contactEmail = cmsData?.contactEmail || "hr@jcrm.in";
  const contactPhone = cmsData?.contactPhone || "+91 8310531309";
  const copyright =
    cmsData?.copyright ||
    cmsData?.copyrightText ||
    "© 2026 JCRM TECHNOLOGIES • All Rights Reserved";
  const isPublicPage =
    
    !pathname?.startsWith("/admin") &&
    !pathname?.startsWith("/auth") &&
    !pathname?.startsWith("/jcrm-sushant");

  if (!isPublicPage) return null;

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
              <img
                src="/logo - JCRM.jpeg"
                alt="JCRM Logo"
                className="w-10 h-10 object-contain rounded-full bg-white p-0.5 shadow-md border border-blue-100"
              />
              <span className="heading-font text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-[#0055FF] transition-colors">
                {siteName || "JCRM TECHNOLOGIES"}
              </span>
            </Link>
            <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3">
              {brandDescription}
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://youtube.com"
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
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-blue-100 text-slate-700 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all shadow-xs flex items-center justify-center"
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
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
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-blue-100 text-slate-700 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all shadow-xs flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 flex-1 min-w-0">
            <div>
              <h4 className="heading-font text-slate-900 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest mb-2.5 pb-1 border-b-2 border-[#0055FF] inline-block">
                COMPANY
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li><Link href="/about" className="hover:text-[#0055FF] transition-colors">About Us</Link></li>
                <li><Link href="/courses" className="hover:text-[#0055FF] transition-colors">Courses</Link></li>
                <li><Link href="/ourteam" className="hover:text-[#0055FF] transition-colors">Our Team</Link></li>
                <li><Link href="/joinus" className="hover:text-[#0055FF] transition-colors">Join Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#0055FF] transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="heading-font text-slate-900 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest mb-2.5 pb-1 border-b-2 border-[#0055FF] inline-block">
                SOLUTIONS
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li><Link href="/erp-solutions" className="hover:text-[#0055FF] transition-colors">ERP Software</Link></li>
                <li><Link href="/erp-solutions" className="hover:text-[#0055FF] transition-colors">Automation</Link></li>
                <li><Link href="/erp-solutions" className="hover:text-[#0055FF] transition-colors">Cloud Services</Link></li>
                <li><Link href="/workshop" className="hover:text-[#0055FF] transition-colors">Workshop</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="heading-font text-slate-900 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest mb-2.5 pb-1 border-b-2 border-[#0055FF] inline-block">
                CONTACT
              </h4>
              <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
                <p className="line-clamp-3">{locationText}</p>
                <a href={`mailto:${contactEmail}`} className="block hover:text-[#0055FF] transition-colors font-bold text-slate-900 break-all">{contactEmail}</a>
                <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className="block hover:text-[#0055FF] transition-colors font-bold text-slate-900">{contactPhone}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500 font-semibold">
          <div>
            {copyright}
          </div>

          <div className="flex items-center gap-3">
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
