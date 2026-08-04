"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Navbar({ siteName, links, logoUrl }: { siteName?: string, links?: any[], logoUrl?: string }) {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide on dashboard, auth, and onboarding routes
  if (pathname === "/auth" || pathname === "/onboarding" || pathname?.startsWith("/student") || pathname?.startsWith("/faculty") || pathname?.startsWith("/admin")) {
    return null;
  }

  const defaultLinks = [
    { name: "Home", href: "/", isActive: true },
    { name: "Courses", href: "/courses", isActive: true },
    { name: "ERP Solutions", href: "/erp-solutions", isActive: true },
    { name: "Our Team", href: "/im", isActive: true },
    { name: "Workshop", href: "/workshop", isActive: true },
    { name: "Join Us", href: "/join", isActive: true },
    { name: "About Us", href: "/about", isActive: true },
    { name: "Contact", href: "/contact", isActive: true },
  ];

  const rawLinks = links && links.length > 0 ? links : defaultLinks;
  const activeLinks = rawLinks.filter((link: any) => link.isActive !== false);

  const displayLogoUrl = logoUrl || "/logo - JCRM.jpeg";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white/85 backdrop-blur-2xl border-b border-white/90 ${
        scrolled
          ? "shadow-[0_8px_35px_rgba(0,85,255,0.12)] bg-white/95"
          : "shadow-[0_4px_30px_rgba(0,85,255,0.08)]"
      }`}
    >
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20 sm:h-22">
          
          {/* Logo & Brand Name - Directly placed image scaled to occupy navbar height */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 group relative z-20">
            {!imgError ? (
              <img
                src={displayLogoUrl}
                alt={siteName || "JCRM Logo"}
                className="h-14 sm:h-16 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0055FF] to-sky-400 flex items-center justify-center font-black text-white text-lg shrink-0">
                JCRM
              </div>
            )}
            
            <span className="heading-font text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#0055FF] transition-colors">
              {siteName || "JCRM Technologies"}
            </span>
          </Link>

          {/* Desktop Links with Glowing Blue Indicator Bar */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {activeLinks.map((link: any) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-2 text-sm xl:text-base transition-all duration-200 ${
                    isActive
                      ? "text-[#0055FF] font-extrabold"
                      : "text-slate-700 font-bold hover:text-[#0055FF]"
                  }`}
                >
                  {link.name}

                  {/* Active Blue Indicator Toggle Bar */}
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-0 right-0 h-1 rounded-full bg-[#0055FF] shadow-[0_0_10px_#0055FF] animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link
              href="/auth"
              className="px-6 py-3 text-sm md:text-base font-extrabold rounded-xl text-white bg-[#0055FF] hover:bg-blue-600 shadow-md hover:shadow-blue-500/25 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-blue-50 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-blue-100 shadow-2xl">
          <div className="px-5 pt-3 pb-6 space-y-2">
            {activeLinks.map((link: any) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 text-base font-extrabold rounded-xl transition-all ${
                    isActive
                      ? "text-[#0055FF] bg-blue-50/90 border-l-4 border-[#0055FF]"
                      : "text-slate-700 hover:text-[#0055FF] hover:bg-slate-50"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0055FF] shadow-[0_0_8px_#0055FF]"></span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 px-1">
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-6 py-3.5 text-base font-extrabold rounded-xl text-white bg-[#0055FF] hover:bg-blue-600 shadow-md block"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}