"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function FacultyLayoutClient({
  children,
}: {
  children: React.ReactNode;
  cmsData?: any;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const user = session?.user;
  const userName = user?.name || (user as any)?.fullName || "Instructor";
  const userInitial = userName[0]?.toUpperCase() || "I";

  const navLinks = [
    { name: "Dashboard Overview", href: "/faculty", icon: "📊" },
    { name: "My Courses", href: "/faculty/courses", icon: "📚" },
    { name: "Course Builder & Live", href: "/faculty/courses/builder", icon: "⚙️" },
    { name: "Students", href: "/faculty/students", icon: "👥" },
    { name: "Submissions", href: "/faculty/submissions", icon: "📝", badge: "12" },
    { name: "Analytics & Revenue", href: "/faculty/analytics", icon: "📈" },
    { name: "Announcements", href: "/faculty/announcements", icon: "📢" },
    { name: "Profile & Settings", href: "/faculty/settings", icon: "⚙️" },
  ];

  const isActive = (href: string) => {
    if (href === "/faculty") return pathname === "/faculty";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Profile Card (Yogsathi Style) */}
      <div
        className="p-5 rounded-2xl border shadow-sm"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
      >
        <div className="flex items-center gap-3.5 mb-4">
          {user?.image ? (
            <img
              src={user.image}
              alt={userName}
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black text-lg flex items-center justify-center shadow-md">
              {userInitial}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{userName}</h3>
            <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 mt-0.5">
              EXPERT
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-gray-800 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Profile Type</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Instructor / Tech Faculty</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Approved
            </span>
          </div>
        </div>
      </div>

      {/* Expert Panel Menu (Yogsathi Style) */}
      <div
        className="p-4 rounded-2xl border shadow-sm space-y-1.5"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
      >
        <div className="px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Expert Panel</span>
          <span className="text-base">✨</span>
        </div>

        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileDrawerOpen(false)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                active
                  ? "bg-[#0055FF] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-[#0055FF]"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-sm">{link.icon}</span>
                <span className="truncate">{link.name}</span>
              </div>
              {link.badge && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white text-blue-600" : "bg-rose-500 text-white"
                  }`}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50/60 dark:bg-black/40">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Open Sidebar Button */}
        <div className="lg:hidden mb-4">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm"
          >
            <span>☰ Open Expert Menu</span>
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 p-4 shadow-2xl overflow-y-auto pt-24">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <span className="font-bold text-sm">Instructor Navigation</span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}

        {/* 2-Column Grid (Like Yogsathi.com) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Rail (4 cols on lg, 3 on xl) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-28 self-start space-y-6">
            {sidebarContent}
          </aside>

          {/* Main Dashboard Content (8 cols on lg, 9 on xl) */}
          <main className="lg:col-span-8 xl:col-span-9 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

