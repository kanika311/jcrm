"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { FiGrid, FiLogOut, FiChevronDown, FiBookOpen, FiSettings } from "react-icons/fi";

export default function Navbar({
  siteName,
  links,
}: {
  siteName?: string;
  links?: any[];
  logoUrl?: string;
}) {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide on admin console, auth, onboarding, and hidden admin routes
  if (
    pathname === "/admin" ||
    pathname?.startsWith("/admin") ||
    pathname === "/auth" ||
    pathname === "/onboarding" ||
    pathname === "/jcrm-sushant" ||
    pathname?.startsWith("/jcrm-sushant")
  ) {
    return null;
  }

  const defaultLinks = [
    { name: "Home", href: "/", isActive: true },
    { name: "Courses", href: "/courses", isActive: true },
    { name: "Services", href: "/services", isActive: true },
    { name: "ERP Solutions", href: "/erp-solutions", isActive: true },
    { name: "Our Team", href: "/ourteam", isActive: true },
    { name: "Workshop", href: "/workshop", isActive: true },
    { name: "Join Us", href: "/joinus", isActive: true },
    { name: "About Us", href: "/about", isActive: true },
    { name: "Contact", href: "/contact", isActive: true },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/ourteam") {
      return pathname === "/ourteam" || pathname === "/our-team" || pathname?.startsWith("/im");
    }
    if (href === "/joinus") {
      return pathname === "/joinus" || pathname === "/join" || pathname === "/join-us";
    }
    if (href === "/services") {
      return pathname === "/services" || pathname?.startsWith("/services");
    }
    return pathname === href || (href !== "/" && pathname?.startsWith(href));
  };

  const rawLinks = links && links.length > 0 ? [...links] : [...defaultLinks];
  if (!rawLinks.some((l: any) => l.href === "/services")) {
    const cIdx = rawLinks.findIndex((l: any) => l.href === "/courses");
    if (cIdx !== -1) {
      rawLinks.splice(cIdx + 1, 0, { name: "Services", href: "/services", isActive: true });
    } else {
      rawLinks.push({ name: "Services", href: "/services", isActive: true });
    }
  }
  const activeLinks = rawLinks.filter((link: any) => link.isActive !== false);

  const displayLogoUrl = "/logo - JCRM.jpeg";

  const user = session?.user;
  const userFullName = user?.name || (user as any)?.fullName || "User";
  const userFirstName = userFullName.split(" ")[0];
  const userEmail = user?.email || "";
  const userRole = (user?.role || "STUDENT").toUpperCase();

  // Show ONLY ONE dashboard link according to the user's specific role
  let dashboardHref = "/student";
  let dashboardLabel = "Student Dashboard";
  let DashboardIcon = FiBookOpen;

  if (userRole === "INSTRUCTOR") {
    dashboardHref = "/faculty";
    dashboardLabel = "Expert Dashboard";
    DashboardIcon = FiGrid;
  }

  const showDashboardLink = userRole !== "ADMIN";

  const profileHref =
    userRole === "INSTRUCTOR" ? "/faculty/settings" : userRole === "ADMIN" ? "/admin/settings" : "/student/settings";

  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-colors transition-shadow duration-200 bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-gray-800/80 ${
        scrolled
          ? "shadow-[0_4px_25px_rgba(0,85,255,0.12)]"
          : "shadow-xs"
      }`}
    >
      <div className="w-full max-w-[1500px] mx-auto px-3 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group shrink-0 cursor-pointer max-w-[70%] sm:max-w-none">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white/90 shadow-sm bg-white p-0.5 group-hover:scale-105 transition-transform shrink-0">
              <img
                src={displayLogoUrl}
                alt={siteName || "JCRM Logo"}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="heading-font text-base sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-[#0055FF] transition-colors truncate">
                {siteName || "JCRM Technologies"}
              </span>
              <span className="hidden sm:block text-[10px] font-extrabold text-[#0055FF] tracking-wider uppercase -mt-1 truncate">
                Innovate &bull; Build &bull; Scale
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {activeLinks.map((link: any) => {
              const isActive = isLinkActive(link.href);

              if (link.href === "/services") {
                return (
                  <div
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      href="/services/seo"
                      className={`relative px-3.5 py-2 text-sm xl:text-base font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? "text-[#0055FF] bg-blue-50/80 dark:bg-blue-900/30"
                          : "text-slate-700 dark:text-slate-200 hover:text-[#0055FF] hover:bg-slate-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span>{link.name}</span>
                      <FiChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                      {isActive && (
                        <span className="absolute -bottom-2.5 left-0 right-0 h-1 rounded-full bg-[#0055FF] shadow-[0_0_10px_#0055FF]"></span>
                      )}
                    </Link>

                    {/* Services Dropdown Card */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-80 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
                      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-blue-100 dark:border-slate-800 p-2.5 space-y-1">
                        <Link
                          href="/services/seo"
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors group/item"
                        >
                          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#0055FF] flex items-center justify-center font-bold text-xs shrink-0 group-hover/item:scale-105 transition-transform">
                            SEO
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white group-hover/item:text-[#0055FF] transition-colors">
                              AI-Powered SEO Packages
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                              Rank higher on Google, ChatGPT & Gemini
                            </p>
                            <span className="text-[10px] font-extrabold text-blue-600">
                              From ₹8,999/mo + GST
                            </span>
                          </div>
                        </Link>

                        <Link
                          href="/services/social-media"
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors group/item"
                        >
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 group-hover/item:scale-105 transition-transform">
                            SMM
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white group-hover/item:text-[#0055FF] transition-colors">
                              Social Media Management
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                              Facebook, LinkedIn, Instagram & YouTube
                            </p>
                            <span className="text-[10px] font-extrabold text-indigo-600">
                              From ₹8,999/mo + GST
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm xl:text-base font-bold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "text-[#0055FF] bg-blue-50/80 dark:bg-blue-900/30"
                      : "text-slate-700 dark:text-slate-200 hover:text-[#0055FF] hover:bg-slate-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.name}

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-0 right-0 h-1 rounded-full bg-[#0055FF] shadow-[0_0_10px_#0055FF]"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action: User Menu / Get Started */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {user ? (
              /* User Avatar & Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors border border-slate-200 dark:border-gray-800 cursor-pointer"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={userFullName}
                      className="w-9 h-9 rounded-full object-cover border border-blue-500/30"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                      {userFirstName[0]?.toUpperCase() || "U"}
                    </div>
                  )}

                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    {userFirstName}
                  </span>

                  <FiChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Floating User Account Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-[#0055FF] p-4 text-white">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={userFullName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold text-base flex items-center justify-center border border-white/30">
                            {userFirstName[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{userFullName}</p>
                          <p className="text-xs text-blue-200 truncate">{userEmail}</p>
                          {userRole !== "ADMIN" && (
                            <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 mt-1">
                              {userRole}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Single Relevant Dashboard Item + Settings */}
                    {showDashboardLink && (
                    <div className="p-2 space-y-1">
                      <Link
                        href={dashboardHref}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-[#0055FF] transition-colors"
                      >
                        <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0055FF] flex items-center justify-center shrink-0">
                          <DashboardIcon className="w-4 h-4" />
                        </span>
                        <span>{dashboardLabel}</span>
                      </Link>

                      <Link
                        href={profileHref}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                          <FiSettings className="w-4 h-4" />
                        </span>
                        <span>Profile & Settings</span>
                      </Link>
                    </div>
                    )}

                    {/* Sign Out Button */}
                    <div className="p-2 border-t border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-950">
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                      >
                        <span className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                          <FiLogOut className="w-4 h-4" />
                        </span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth?role=student&mode=login"
                  className="px-4 py-2.5 text-sm font-extrabold rounded-xl text-[#0055FF] bg-white border-2 border-[#0055FF] hover:bg-blue-50 transition-all"
                >
                  Student Login
                </Link>
                <Link
                  href="/auth?role=teacher&mode=login"
                  className="px-4 py-2.5 text-sm font-extrabold rounded-xl text-white bg-[#0055FF] hover:bg-blue-600 shadow-md transition-all"
                >
                  Teacher Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-1.5 sm:gap-2 shrink-0">
            {user && showDashboardLink && (
              <Link
                href={dashboardHref}
                className="w-8 h-8 rounded-full bg-[#0055FF] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
              >
                {userFirstName[0]?.toUpperCase()}
              </Link>
            )}
            {user && !showDashboardLink && (
              <div className="w-8 h-8 rounded-full bg-[#0055FF] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {userFirstName[0]?.toUpperCase()}
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-blue-50 text-slate-800 hover:bg-blue-100 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border-b border-blue-100 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="px-5 pt-3 pb-6 space-y-2">
            {user && (
              <div className="p-3 mb-2 rounded-2xl bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40">
                <p className="font-bold text-sm text-slate-900 dark:text-white">{userFullName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userEmail}</p>
                <div className="flex gap-2 mt-2">
                  {showDashboardLink && (
                    <Link
                      href={dashboardHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-1.5 rounded-lg text-center text-xs font-bold bg-[#0055FF] text-white"
                    >
                      {dashboardLabel}
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {activeLinks.map((link: any) => {
              const isActive = isLinkActive(link.href);

              if (link.href === "/services") {
                return (
                  <div key={link.name} className="space-y-1">
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 text-base font-extrabold rounded-xl transition-all ${
                        isActive
                          ? "text-[#0055FF] bg-blue-50/90 border-l-4 border-[#0055FF]"
                          : "text-slate-700 dark:text-slate-300 hover:text-[#0055FF] hover:bg-slate-50"
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0055FF]"></span>
                      )}
                    </Link>
                    <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-blue-100 dark:border-blue-900/40 ml-4">
                      <Link
                        href="/services/seo"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0055FF]"
                      >
                        ⚡ AI-Powered SEO Packages
                      </Link>
                      <Link
                        href="/services/social-media"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0055FF]"
                      >
                        🚀 Social Media Management
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 text-base font-extrabold rounded-xl transition-all ${
                    isActive
                      ? "text-[#0055FF] bg-blue-50/90 border-l-4 border-[#0055FF]"
                      : "text-slate-700 dark:text-slate-300 hover:text-[#0055FF] hover:bg-slate-50"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0055FF]"></span>
                  )}
                </Link>
              );
            })}

            {!user && (
              <div className="pt-3 px-1 grid grid-cols-1 gap-2">
                <Link
                  href="/auth?role=student&mode=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-6 py-3.5 text-base font-extrabold rounded-xl text-[#0055FF] bg-white border-2 border-[#0055FF] block"
                >
                  Student Login
                </Link>
                <Link
                  href="/auth?role=teacher&mode=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-6 py-3.5 text-base font-extrabold rounded-xl text-white bg-[#0055FF] hover:bg-blue-600 shadow-md block"
                >
                  Teacher Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
