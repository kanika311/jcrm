"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CoursesClient({
  cmsData,
  initialCourses = [],
}: {
  cmsData: any;
  initialCourses?: any[];
}) {
  const [filter, setFilter] = useState("all");
  const [courses, setCourses] = useState(initialCourses);
  const router = useRouter();

  const togglePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "DRAFT" : "PUBLISHED";
    try {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus.toLowerCase() } : c
        )
      );

      // Make API call
      const res = await fetch(`/api/admin/courses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) {
        router.refresh();
      }
    } catch {
      router.refresh();
    }
  };

  const filteredCourses = courses.filter(
    (c) => filter === "all" || c.status === filter
  );

  return (
    <div className="space-y-5 pb-10">
      

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex p-1 rounded-xl overflow-x-auto no-scrollbar"
          style={{ background: "var(--bg-surface)" }}
        >
          {[
            { id: "all", label: "All" },
            { id: "published", label: "Published" },
            { id: "draft", label: "Drafts" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                filter === f.id
                  ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Link
          href="/faculty/create"
          className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/faculty/create"
          className="p-5 rounded-2xl flex flex-col items-center justify-center min-h-[280px] border-2 border-dashed group cursor-pointer transition-colors"
          style={{ borderColor: "var(--border-soft)", background: "var(--bg-card)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
            style={{
              background: "color-mix(in srgb, var(--accent-primary) 10%, transparent)",
              color: "var(--accent-primary)",
            }}
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="heading-font text-lg font-bold mb-1 text-center group-hover:text-[var(--accent-primary)] transition-colors">
            Create New Course
          </h3>
          <p className="text-xs text-center px-4" style={{ color: "var(--text-secondary)" }}>
            Start building a new learning program for students.
          </p>
        </Link>

        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="p-5 rounded-2xl flex flex-col min-w-0 h-full card-hover"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
          >
            <div className="flex justify-between items-start gap-2 mb-3">
              <button
                type="button"
                onClick={() => togglePublish(course.id, course.status)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all shrink-0 ${
                  course.status === "published"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20"
                }`}
                title="Click to toggle Draft / Published"
              >
                ● {course.status === "published" ? "Published (Live)" : "Draft (Hidden)"}
              </button>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                {course.level}
              </span>
            </div>

            <h3 className="heading-font text-lg font-bold mb-1.5 leading-snug line-clamp-2">
              {course.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-4 min-h-[2rem]">
              {course.description}
            </p>

            <div
              className="grid grid-cols-3 gap-1 mb-4 p-3 rounded-xl mt-auto"
              style={{ background: "var(--bg-surface)" }}
            >
              <div className="min-w-0 text-center px-1">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">
                  Enrolled
                </span>
                <span className="heading-font text-base font-extrabold text-slate-800 block truncate">
                  {course.students}
                </span>
              </div>
              <div className="min-w-0 text-center px-1 border-x border-slate-200/80">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">
                  Price
                </span>
                <span className="heading-font text-base font-extrabold text-[#0055FF] block truncate">
                  ₹{Number(course.price || 0).toLocaleString()}
                </span>
              </div>
              <div className="min-w-0 text-center px-1">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">
                  Revenue
                </span>
                <span className="heading-font text-base font-extrabold text-emerald-600 block truncate">
                  {course.revenue}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <Link
                href={`/courses/${course.id}`}
                target="_blank"
                className="py-2 px-3 text-center text-xs font-bold rounded-lg bg-blue-50 text-[#0055FF] hover:bg-blue-100 transition-colors shrink-0"
                title="Preview public course page"
              >
                View
              </Link>
              <Link
                href={`/faculty/courses/builder?id=${course.id}`}
                className="flex-1 min-w-0 py-2 px-3 text-center text-xs font-bold rounded-lg bg-[#0055FF] text-white hover:bg-blue-700 transition-colors shadow-sm truncate"
              >
                Manage Modules & Live
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
