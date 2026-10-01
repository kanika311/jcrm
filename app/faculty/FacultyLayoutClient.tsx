"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FiGrid,
  FiBookOpen,
  FiVideo,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiBell,
  FiMessageSquare,
  FiSettings,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiTag,
  FiExternalLink,
} from "react-icons/fi";
import { DEFAULT_SPONSORED_AD, SponsoredAd } from "@/lib/sponsoredAd";

const STUDENT_ONLY_PATHS = [
  "/faculty/students",
  "/faculty/submissions",
];
const REVENUE_ONLY_PATHS = ["/faculty/analytics"];

export default function FacultyLayoutClient({
  children,
  hasStudents = false,
  hasRevenue = false,
  sponsoredAd = DEFAULT_SPONSORED_AD,
}: {
  children: React.ReactNode;
  cmsData?: any;
  hasStudents?: boolean;
  hasRevenue?: boolean;
  sponsoredAd?: SponsoredAd;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const user = session?.user;
  const userName = user?.name || (user as any)?.fullName || "Instructor";
  const userInitial = userName[0]?.toUpperCase() || "I";

  useEffect(() => {
    if (!hasStudents && STUDENT_ONLY_PATHS.some((path) => pathname.startsWith(path))) {
      router.replace("/faculty");
      return;
    }
    if (!hasRevenue && REVENUE_ONLY_PATHS.some((path) => pathname.startsWith(path))) {
      router.replace("/faculty");
    }
  }, [hasStudents, hasRevenue, pathname, router]);

  const navLinks = [
    { name: "Dashboard Overview", href: "/faculty", icon: FiGrid },
    { name: "My Courses", href: "/faculty/courses", icon: FiBookOpen },
    { name: "Course Builder & Live", href: "/faculty/courses/builder", icon: FiVideo },
    { name: "Students", href: "/faculty/students", icon: FiUsers, requiresStudents: true },
    { name: "Messages", href: "/faculty/messages", icon: FiMessageSquare },
    { name: "Assignments", href: "/faculty/submissions", icon: FiFileText, requiresStudents: true },
    { name: "Analytics & Revenue", href: "/faculty/analytics", icon: FiBarChart2, requiresRevenue: true },
    { name: "Announcements", href: "/faculty/announcements", icon: FiBell },
    { name: "Profile & Settings", href: "/faculty/settings", icon: FiSettings },
  ].filter((link) => {
    if (link.requiresStudents && !hasStudents) return false;
    if (link.requiresRevenue && !hasRevenue) return false;
    return true;
  });

  const isActive = (href: string) => {
    if (href === "/faculty") return pathname === "/faculty";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="space-y-3">
      <div
        className="p-3 rounded-2xl border shadow-sm"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
      >
        <div className="flex items-center gap-2.5">
          {user?.image ? (
            <img
              src={user.image}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border-2 border-amber-500/40 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
              {userInitial}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">{userName}</h3>
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-600">
              <FiCheckCircle className="w-3 h-3 text-emerald-500" />
              Expert
            </span>
          </div>
        </div>
      </div>

      <div
        className="p-2 rounded-2xl border shadow-sm space-y-0.5"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
      >
        <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
          Expert Panel
        </div>

        {navLinks.map((link) => {
          const active = isActive(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileDrawerOpen(false)}
              className={`w-full flex items-center px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                active
                  ? "bg-[#0055FF] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-[#0055FF]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 mr-2 ${active ? "text-white" : "text-slate-500"}`} />
              <span className="truncate">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  const isWideWorkspace =
    pathname.startsWith("/faculty/courses/builder") ||
    pathname.startsWith("/faculty/create");
  const isChatWorkspace = pathname.startsWith("/faculty/messages");
  const ad = sponsoredAd?.isActive ? sponsoredAd : DEFAULT_SPONSORED_AD;

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-slate-50/60 dark:bg-black/40">
      <div className="lg:h-[calc(100dvh-5rem)] lg:overflow-hidden bg-slate-50/60 dark:bg-black/40">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-5 py-3 lg:h-full lg:min-h-0">
        <div className="lg:hidden mb-3">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm"
          >
            <FiMenu className="w-4 h-4" />
            <span>Open Expert Menu</span>
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
                <span className="font-bold text-sm">Instructor Navigation</span>
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

        <div className="flex gap-3 items-stretch lg:h-full lg:min-h-0">
          <aside className="hidden lg:block w-[250px] xl:w-[270px] shrink-0 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain">
            {sidebarContent}
          </aside>

          <main
            className={`flex-1 min-w-0 min-h-0 lg:h-full ${
              isChatWorkspace
                ? "lg:overflow-hidden flex flex-col"
                : "lg:overflow-y-scroll lg:overscroll-contain pb-16"
            }`}
          >
            {children}
          </main>

          <aside
            className={`${
              isWideWorkspace ? "hidden" : "hidden lg:flex"
            } w-[240px] xl:w-[260px] shrink-0 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain flex-col`}
          >
            <div className="bg-white border border-[#D4E8F8] rounded-2xl shadow-xs p-4 space-y-3 overflow-hidden group hover:border-[#0055FF]/40 transition-all">
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0055FF] border border-[#D4E8F8] text-[9px] font-black tracking-wider uppercase inline-flex items-center gap-1">
                <FiTag className="w-3 h-3" />
                {ad.badge || "SPONSORED"}
              </span>

              {ad.image && (
                <div className="w-full h-28 rounded-xl overflow-hidden border border-[#D4E8F8] bg-slate-50">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 group-hover:text-[#0055FF] leading-snug line-clamp-2">
                  {ad.title}
                </h4>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed line-clamp-3">
                  {ad.description}
                </p>
              </div>

              {ad.ctaLink && (
                <a
                  href={ad.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="truncate">{ad.ctaText || "Learn More"}</span>
                  <FiExternalLink className="w-3 h-3 shrink-0" />
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
      </div>
    </div>
  );
}
