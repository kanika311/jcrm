"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  FiGrid,
  FiUsers,
  FiBookOpen,
  FiUserCheck,
  FiLayers,
  FiMail,
  FiEdit3,
  FiTarget,
  FiBarChart2,
  FiSettings,
  FiExternalLink,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
} from "react-icons/fi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Overview", href: "/admin", icon: FiGrid },
    { name: "Users", href: "/admin/users", icon: FiUsers },
    { name: "Courses", href: "/admin/courses", icon: FiBookOpen },
    { name: "Our Team", href: "/admin/team", icon: FiUserCheck },
    { name: "ERP Solutions", href: "/admin/erp", icon: FiLayers },
    { name: "CMS", href: "/admin/cms", icon: FiEdit3 },
    { name: "Messages", href: "/admin/messages", icon: FiMail },
    { name: "Leads", href: "/admin/leads", icon: FiTarget },
    { name: "Reports", href: "/admin/reports", icon: FiBarChart2 },
    { name: "Settings", href: "/admin/settings", icon: FiSettings },
  ];

  const adminName = session?.user?.name || "Admin";
  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      {/* Top Admin Navigation Header (Pure Light Theme) */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl ${
          scrolled ? "shadow-md" : "shadow-xs"
        }`}
      >
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Admin Branding */}
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2.5">
                <img
                  src="/logo - JCRM.jpeg"
                  alt="JCRM Technologies"
                  className="h-9 w-9 rounded-full object-contain bg-white shrink-0 p-0.5 border border-slate-200"
                />
                <span className="heading-font text-lg font-black tracking-tight hidden sm:block text-slate-900">
                  JCRM <span className="text-[#0055FF]">Admin</span>
                </span>
              </Link>
              <span className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                <FiShield className="w-3 h-3 text-rose-600" />
                <span>Console</span>
              </span>
            </div>

            {/* Desktop Navigation Links (Admin CRUD & CMS) */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === link.href || pathname?.startsWith(link.href + "/");

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#0055FF] text-white shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              
              {/* Button to View Public Website */}
              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition"
                title="Open live website in new tab"
              >
                <span>Live Site</span>
                <FiExternalLink className="w-3.5 h-3.5 text-[#0055FF]" />
              </Link>

              {/* Admin Avatar */}
              <Link href="/admin/settings" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0055FF] border border-blue-200 flex items-center justify-center font-bold text-xs shadow-xs">
                  {initials}
                </div>
              </Link>

              {/* Sign Out */}
              <button
                onClick={() => signOut({ callbackUrl: "/auth" })}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors hover:bg-rose-50 text-rose-600 border border-rose-200"
                title="Sign out of admin"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6 text-slate-800" />}
              </button>
            </div>

          </div>
        </div>

        {/* Secondary Navigation Row for Large Screens that are not xl */}
        <div className="hidden lg:flex xl:hidden border-t border-slate-200 bg-white px-4 py-2 overflow-x-auto gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname === link.href || pathname?.startsWith(link.href + "/");

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-[#0055FF] text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l border-slate-200 shadow-2xl flex flex-col p-5">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="font-bold text-sm text-slate-900">Admin Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === link.href || pathname?.startsWith(link.href + "/");

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? "bg-[#0055FF] text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <FiExternalLink className="w-4 h-4 text-[#0055FF]" />
                    Live Website
                  </span>
                  <span>↗</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth" })}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}