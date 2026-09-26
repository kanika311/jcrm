"use client";

import { useMemo, useState } from "react";

export type FacultyStudentRow = {
  id: string;
  studentId: string;
  name: string;
  email: string;
  image: string | null;
  courseId: string;
  course: string;
  enrolledAt: string;
  progress: number;
  grade: string;
};

export default function StudentsClient({
  students,
  courses,
}: {
  students: FacultyStudentRow[];
  courses: { id: string; title: string }[];
}) {
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((row) => {
      const matchesCourse = courseId === "all" || row.courseId === courseId;
      const matchesSearch =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.course.toLowerCase().includes(q);
      return matchesCourse && matchesSearch;
    });
  }, [students, search, courseId]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Student Directory</h1>
          <p className="text-sm font-medium text-slate-500">
            Students who purchased and enrolled in your courses.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="pl-9 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 bg-white text-slate-900 w-full md:w-64"
            />
          </div>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-800"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-[24px] overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="p-4">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Enroll Date</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Avg Grade</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm font-medium text-slate-500">
                    {students.length === 0
                      ? "No students have enrolled in your courses yet."
                      : "No students match this search."}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {row.image ? (
                          <img src={row.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#0055FF] text-white text-xs font-black flex items-center justify-center">
                            {row.name[0]?.toUpperCase() || "S"}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-sm text-slate-900">{row.name}</div>
                          <div className="text-xs text-slate-500">{row.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-600">{row.course}</td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(row.enrolledAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#0055FF]"
                            style={{ width: `${row.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold w-8 text-slate-700">{row.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{row.grade}</td>
                    <td className="p-4">
                      <a
                        href={`/faculty/messages?student=${row.studentId}`}
                        className="text-sm font-semibold text-[#0055FF] hover:underline"
                      >
                        Message
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
