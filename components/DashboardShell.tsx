"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  showDot?: boolean;
};

type DashboardShellProps = {
  role: string;
  navItems: NavItem[];
  settingsHref?: string;
  userInitials?: string;
  welcomeName?: string;
  children: ReactNode;
};

export default function DashboardShell({
  role,
  navItems,
  settingsHref,
  userInitials = "SG",
  welcomeName,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#0B0F19] font-sans text-txt-secondary selection:bg-violet-500/30 overflow-hidden">
      
      {/* Animated Background Blob behind Sidebar */}
      <div className="absolute top-0 left-0 w-64 h-full bg-violet-900/10 blur-[100px] pointer-events-none z-0"></div>

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-[260px] bg-[#0B0F19]/80 backdrop-blur-2xl border-r border-bdr-soft h-full flex flex-col hidden lg:flex relative z-20 shrink-0 shadow-2xl">
        <div className="pt-8 pb-6 px-6 border-b border-bdr-soft">
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <img
              src="/logo - JCRM.jpeg"
              alt="JCRM Technologies"
              className="w-9 h-9 rounded-full object-contain bg-white shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-bold text-txt-primary tracking-tight heading-font">JCRM Technology</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-surf-elevated border border-bdr-soft text-[10px] font-bold text-violet-300 uppercase tracking-widest shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            {role}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? "text-txt-primary bg-surf-hover border border-bdr-soft shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                    : "text-txt-secondary hover:text-txt-primary hover:bg-surf-elevated border border-transparent"
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-500 rounded-r-md shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
                )}
                
                {/* Active Glow Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent pointer-events-none"></div>
                )}

                <div className="flex items-center gap-3 relative z-10">
                  <span className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-violet-400 opacity-100" : "opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:text-violet-300"}`}>
                    {item.icon}
                  </span>
                  <span className={isActive ? "font-bold" : ""}>{item.label}</span>
                </div>
                
                <div className="flex items-center gap-2 relative z-10">
                  {item.showDot && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                  )}
                  {typeof item.badge === "number" && (
                    <span className="bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-inner">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {settingsHref && (
            <div className="pt-4 mt-6 border-t border-bdr-soft">
              <Link
                href={settingsHref}
                className="flex items-center gap-3 px-4 py-3 text-txt-secondary hover:text-txt-primary hover:bg-surf-elevated rounded-xl font-medium transition-all group border border-transparent"
              >
                <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </div>
          )}
        </nav>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        <header className="h-20 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-bdr-soft flex items-center justify-between px-8 z-30 sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
            {welcomeName && (
              <h2 className="text-2xl font-bold text-txt-primary tracking-tight hidden md:block heading-font animate-fade-in-up">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{welcomeName}</span> 👋
              </h2>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary group-focus-within:text-violet-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <label htmlFor="dashboard-search" className="sr-only">
                Search
              </label>
              <input
                id="dashboard-search"
                type="text"
                placeholder="Search courses, students..."
                className="w-72 pl-11 pr-12 py-2.5 bg-[#131B2F] border border-bdr-soft rounded-full text-sm text-txt-primary placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
                <kbd className="px-1.5 py-0.5 rounded-md bg-surf-hover border border-bdr-soft text-[10px] font-mono">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded-md bg-surf-hover border border-bdr-soft text-[10px] font-mono">K</kbd>
              </div>
            </div>

            <button aria-label="Notifications" className="relative text-txt-secondary hover:text-txt-primary transition-colors group p-2 rounded-full hover:bg-surf-elevated">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-[#0B0F19] rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
            </button>

            <div className="flex items-center gap-3 cursor-pointer pl-6 border-l border-bdr-soft">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-txt-primary font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-shadow border border-bdr-soft transform hover:scale-105">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative z-10 [&::-webkit-scrollbar]:hidden">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}