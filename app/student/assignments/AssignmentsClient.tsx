"use client";

import { useMemo, useState } from "react";

export type StudentAssignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  courseId: string;
  course: string;
  status: "pending" | "submitted" | "graded" | string;
  grade: string | null;
  feedback: string | null;
};

function dueLabel(dueDate: string | null) {
  if (!dueDate) return "No due date";
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

function urgency(dueDate: string | null, status: string) {
  if (status !== "pending") return "neutral";
  if (!dueDate) return "neutral";
  const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 2) return "danger";
  if (days <= 5) return "warning";
  return "neutral";
}

export default function AssignmentsClient({
  cmsData,
  initialAssignments,
}: {
  cmsData: any;
  initialAssignments: StudentAssignment[];
}) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [filter, setFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [work, setWork] = useState<Record<string, string>>({});

  const courses = useMemo(
    () => Array.from(new Map(assignments.map((a) => [a.courseId, a.course])).entries()),
    [assignments]
  );

  const filtered = assignments.filter((a) => {
    const matchesStatus = filter === "all" || a.status === filter;
    const matchesCourse = courseFilter === "all" || a.courseId === courseFilter;
    return matchesStatus && matchesCourse;
  });

  const handleSubmit = async (id: string) => {
    const content = (work[id] || "").trim();
    if (!content) {
      alert("Please add your work link or notes before submitting.");
      return;
    }
    setSubmittingId(id);
    try {
      const res = await fetch(`/api/student/assignments/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Submit failed");
      }
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "submitted" } : a))
      );
    } catch (err: any) {
      alert(err.message || "Could not submit assignment");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="heading-font text-3xl font-bold mb-2">{cmsData?.heading || "Assignments"}</h1>
          <p className="text-slate-500 text-sm font-medium">
            Only work assigned by your course instructor is shown here.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {courses.length > 1 && (
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-700"
            >
              <option value="all">All courses</option>
              {courses.map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          )}
          <div className="flex p-1 rounded-xl bg-slate-100">
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Due Soon" },
              { id: "submitted", label: "Submitted" },
              { id: "graded", label: "Graded" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  filter === f.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 rounded-2xl border border-slate-200 bg-white text-center">
          <p className="text-slate-800 font-bold mb-1">No assignments yet</p>
          <p className="text-sm text-slate-500">
            Your instructor has not assigned any work for this course. When they do, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((assignment) => {
            const u = urgency(assignment.dueDate, assignment.status);
            return (
              <div
                key={assignment.id}
                className="p-6 rounded-[24px] flex flex-col h-full bg-white border border-slate-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4 gap-2">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-blue-50 text-[#0055FF]">
                    {assignment.course}
                  </span>
                  {assignment.status === "graded" ? (
                    <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700">
                      {assignment.grade || "Graded"}
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-bold ${
                        u === "danger" ? "text-rose-500" : u === "warning" ? "text-amber-500" : "text-slate-400"
                      }`}
                    >
                      {dueLabel(assignment.dueDate)}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{assignment.title}</h3>
                {assignment.description && (
                  <p className="text-sm text-slate-500 mb-4">{assignment.description}</p>
                )}

                <div className="mt-auto pt-4 border-t border-slate-100">
                  {assignment.status === "pending" && (
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400"
                        placeholder="Paste your GitHub / Drive link or write notes..."
                        value={work[assignment.id] || ""}
                        onChange={(e) => setWork((prev) => ({ ...prev, [assignment.id]: e.target.value }))}
                      />
                      <button
                        type="button"
                        disabled={submittingId === assignment.id}
                        onClick={() => handleSubmit(assignment.id)}
                        className="w-full py-2.5 rounded-xl text-sm font-bold bg-[#0055FF] text-white hover:bg-blue-600 disabled:opacity-50"
                      >
                        {submittingId === assignment.id ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  )}

                  {assignment.status === "submitted" && (
                    <button className="w-full py-2 rounded-lg text-sm font-bold bg-slate-100 text-slate-500 cursor-not-allowed">
                      Under Review
                    </button>
                  )}

                  {assignment.status === "graded" && (
                    <p className="text-sm text-slate-600">
                      {assignment.feedback || "Your instructor has graded this assignment."}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
