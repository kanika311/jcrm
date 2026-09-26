"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FiGrid,
  FiBookOpen,
  FiPlayCircle,
  FiRadio,
  FiFileText,
  FiCalendar,
  FiMessageSquare,
  FiSettings,
  FiMenu,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

const COURSE_ONLY_PATHS = [
  "/student/courses",
  "/student/classroom",
  "/student/live",
  "/student/assignments",
  "/student/calendar",
];

export default function StudentLayoutClient({
  children,
  hasEnrollment = false,
}: {
  children: React.ReactNode;
  cmsData?: any;
  hasEnrollment?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const user = session?.user;
  const userName = user?.name || (user as any)?.fullName || "Student";
  const userInitial = userName[0]?.toUpperCase() || "S";

  useEffect(() => {
    if (hasEnrollment) return;
    if (COURSE_ONLY_PATHS.some((path) => pathname.startsWith(path))) {
      router.replace("/student");
    }
  }, [hasEnrollment, pathname, router]);

  const allLinks = [
    { name: "Overview", href: "/student", icon: FiGrid, requiresCourse: false },
    { name: "My Courses", href: "/student/courses", icon: FiBookOpen, requiresCourse: true },
    { name: "Classroom & Player", href: "/student/classroom", icon: FiPlayCircle, requiresCourse: true },
    { name: "Live Sessions", href: "/student/live", icon: FiRadio, requiresCourse: true, hasPulse: true },
    { name: "Assignments", href: "/student/assignments", icon: FiFileText, requiresCourse: true },
    { name: "Calendar", href: "/student/calendar", icon: FiCalendar, requiresCourse: true },
    { name: "Messages", href: "/student/messages", icon: FiMessageSquare, requiresCourse: false },
    { name: "Profile & Settings", href: "/student/settings", icon: FiSettings, requiresCourse: false },
  ];

  const navLinks = allLinks.filter((link) => hasEnrollment || !link.requiresCourse);

  const isActive = (href: string) => {
    if (href === "/student") return pathname === "/student";
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
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/40"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
              {userInitial}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{userName}</h3>
            <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 mt-0.5 border border-blue-500/30">
              STUDENT
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-gray-800 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Profile Type</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Software Engineering Track</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1.5">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Active Learner
            </span>
          </div>
        </div>
      </div>

      {/* Student Panel Menu */}
      <div
        className="p-4 rounded-2xl border shadow-sm space-y-1.5"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
      >
        <div className="px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Student Panel</span>
        </div>

        {navLinks.map((link) => {
          const active = isActive(link.href);
          const Icon = link.icon;

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
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-500"}`} />
                <span className="truncate">{link.name}</span>
                {link.hasPulse && (
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        {!hasEnrollment && (
          <div className="mt-3 px-3 py-3 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-[11px] font-semibold text-slate-600 leading-relaxed mb-2">
              Courses, live classes, assignments, and instructor chat unlock after you buy a course.
            </p>
            <Link
              href="/courses"
              onClick={() => setMobileDrawerOpen(false)}
              className="inline-flex items-center text-[11px] font-extrabold text-[#0055FF]"
            >
              Browse courses →
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-slate-50/60 dark:bg-black/40">
      <div className="lg:h-[calc(100dvh-5rem)] lg:overflow-hidden bg-slate-50/60 dark:bg-black/40">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:h-full lg:min-h-0">
        <div className="lg:hidden mb-4">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm"
          >
            <FiMenu className="w-4 h-4" />
            <span>Open Student Menu</span>
          </button>
        </div>

        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 p-4 shadow-2xl overflow-y-auto pt-24">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <span className="font-bold text-sm">Student Navigation</span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:h-full lg:min-h-0">
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain">
            {sidebarContent}
          </aside>

          <main className="lg:col-span-8 xl:col-span-9 min-w-0 min-h-0 lg:h-full lg:overflow-y-scroll lg:overscroll-contain pb-24 lg:pb-16">
            {children}
          </main>
        </div>
      </div>
      </div>
    </div>
  );
}
