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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="heading-font text-3xl font-bold mb-2">
            {cmsData?.heading || "Course Management"}
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your instructor courses, curriculum modules, live sessions, and students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/faculty/create"
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Create Course
          </Link>

          <div
            className="flex p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar"
            style={{ background: "var(--bg-surface)" }}
          >
            {[
              { id: "all", label: "All Courses" },
              { id: "published", label: "Published" },
              { id: "draft", label: "Drafts" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                  filter === f.id
                    ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Create New Card */}
        <Link
          href="/faculty/create"
          className="p-6 rounded-[24px] flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed group cursor-pointer transition-colors"
          style={{ borderColor: "var(--border-soft)", background: "var(--bg-card)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
            style={{
              background: "color-mix(in srgb, var(--accent-primary) 10%, transparent)",
              color: "var(--accent-primary)",
            }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="heading-font text-xl font-bold mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
            Create New Course
          </h3>
          <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
            Start building a new learning program for students.
          </p>
        </Link>

        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="p-6 rounded-[24px] flex flex-col h-full card-hover"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
          >
            <div className="flex justify-between items-start mb-4">
              <button
                type="button"
                onClick={() => togglePublish(course.id, course.status)}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                  course.status === "published"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20"
                }`}
                title="Click to toggle Draft / Published"
              >
                ● {course.status === "published" ? "Published (Live)" : "Draft (Hidden)"}
              </button>

              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {course.level}
              </span>
            </div>

            <h3 className="heading-font text-xl font-bold mb-2">{course.title}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-4">
              {course.description}
            </p>

            <div
              className="grid grid-cols-3 gap-2 mb-6 p-4 rounded-xl mt-auto"
              style={{ background: "var(--bg-surface)" }}
            >
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">ENROLLED</span>
                <span className="heading-font text-lg font-extrabold text-slate-800">
                  {course.students}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">PRICE</span>
                <span className="heading-font text-lg font-extrabold text-[#0055FF]">
                  ₹{Number(course.price || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">REVENUE</span>
                <span className="heading-font text-lg font-extrabold text-emerald-600">
                  {course.revenue}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <Link
                href={`/courses/${course.id}`}
                target="_blank"
                className="py-2 px-3 text-center text-xs font-bold rounded-lg bg-blue-50 text-[#0055FF] hover:bg-blue-100 transition-colors"
                title="Preview public course page"
              >
                View ↗
              </Link>
              <Link
                href={`/faculty/courses/builder?id=${course.id}`}
                className="flex-1 py-2 px-3 text-center text-xs font-bold rounded-lg bg-[#0055FF] text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>⚙️ Manage Modules & Live</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
