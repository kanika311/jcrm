"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  FiSearch,
  FiCheck,
  FiGlobe,
  FiAward,
} from "react-icons/fi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: FiGrid },
    { name: "Users", href: "/admin/users", icon: FiUsers },
    { name: "Courses", href: "/admin/courses", icon: FiBookOpen },
    { name: "Our Team", href: "/admin/team", icon: FiUserCheck },
    { name: "ERP Solutions", href: "/admin/erp", icon: FiLayers },
    { name: "Sponsored", href: "/admin/sponsored", icon: FiAward },
    { name: "CMS", href: "/admin/cms", icon: FiEdit3 },
    { name: "Messages", href: "/admin/messages", icon: FiMail },
    { name: "Leads", href: "/admin/leads", icon: FiTarget },
    { name: "Settings", href: "/admin/settings", icon: FiSettings },
  ];

  const filteredNavLinks = navLinks.filter((link) =>
    link.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const adminName = session?.user?.name || "Admin";
  const initials =
    adminName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  const renderNavItems = (onItemClick?: () => void) => (
    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      {filteredNavLinks.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname === link.href || pathname?.startsWith(link.href + "/");

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? "bg-[#F97316] text-white shadow-md shadow-orange-500/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
            <span>{link.name}</span>
          </Link>
        );
      })}

      {filteredNavLinks.length === 0 && (
        <div className="px-3 py-6 text-xs text-slate-500 text-center">
          No matching tabs found
        </div>
      )}
    </div>
  );

  const renderSidebarFooter = () => (
    <div className="p-3 border-t border-slate-800/80 space-y-1 shrink-0">
      <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-400">
        <span className="flex items-center gap-2">
          <FiGlobe className="w-4 h-4 text-slate-400" />
          <span>EN</span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Online
        </span>
      </div>

      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
      >
        <FiExternalLink className="w-4 h-4 text-blue-400" />
        <span>Live Site</span>
      </Link>

      <button
        onClick={() => signOut({ callbackUrl: "/auth" })}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
      >
        <FiLogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* Desktop Left Sidebar (Yogsathi Style) */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 flex-col bg-[#0F172A] text-slate-300 border-r border-slate-800 shrink-0 z-40 select-none">
        {/* Header / Logo */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm shrink-0 border border-slate-700">
              <img
                src="/logo - JCRM.jpeg"
                alt="JCRM Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm tracking-tight leading-tight">
                Admin Panel
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                JCRM Console
              </span>
            </div>
          </Link>
        </div>

        {/* Tab Search Filter */}
        <div className="px-3 pt-3.5 pb-2 shrink-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tabs..."
              className="w-full bg-[#1E293B] text-slate-200 placeholder-slate-400 text-xs rounded-xl pl-9 pr-7 py-2 border border-slate-700/60 focus:outline-none focus:border-orange-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Nav Links */}
        {renderNavItems()}

        {/* Footer info & Logout */}
        {renderSidebarFooter()}
      </aside>

      {/* Mobile Drawer Navigation (Left-aligned) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0F172A] text-slate-300 shadow-2xl flex flex-col z-50">
            {/* Mobile Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/logo - JCRM.jpeg"
                    alt="JCRM Logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <span className="font-bold text-white text-sm">Admin Panel</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Search Filter */}
            <div className="px-3 pt-3.5 pb-2 shrink-0">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tabs..."
                  className="w-full bg-[#1E293B] text-slate-200 placeholder-slate-400 text-xs rounded-xl pl-9 pr-7 py-2 border border-slate-700/60 focus:outline-none focus:border-orange-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Nav Links */}
            {renderNavItems(() => setMobileMenuOpen(false))}

            {/* Mobile Footer */}
            {renderSidebarFooter()}
          </div>
        </div>
      )}

      {/* Main Content Area (Right of Sidebar) */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {/* Breadcrumb / Active Tab Name */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm hidden sm:inline">
                JCRM Console
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="text-xs font-bold text-[#0055FF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                {navLinks.find((l) =>
                  l.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === l.href || pathname?.startsWith(l.href + "/")
                )?.name || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Site Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Open public website in new tab"
            >
              <FiExternalLink className="w-3.5 h-3.5 text-[#0055FF]" />
              <span>Live Site</span>
            </Link>

            {/* Yogsathi-style "Welcome, Admin!" Green Badge */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#10B981] text-white shadow-xs">
              <FiCheck className="w-4 h-4 stroke-[3]" />
              <span>Welcome, {adminName}!</span>
            </div>

            {/* Admin Avatar */}
            <Link
              href="/admin/settings"
              className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-orange-400 transition"
              title="Account Settings"
            >
              {initials}
            </Link>
          </div>
        </header>

        {/* Child Pages Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1700px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}