"use client";

import { useState } from "react";

type FacultyAssignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  course: { id: string; title: string };
  submissions: {
    id: string;
    status: string;
    grade: string | null;
    student: { name: string | null; fullName: string | null; email: string };
  }[];
};

export default function SubmissionsClient({
  cmsData,
  courses,
  initialAssignments,
}: {
  cmsData: any;
  courses: { id: string; title: string }[];
  initialAssignments: FacultyAssignment[];
}) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title.trim()) {
      setMessage("Select a course and enter a title.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/faculty/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, courseId, dueDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to assign");
      setAssignments((prev) => [data.assignment, ...prev]);
      setTitle("");
      setDescription("");
      setDueDate("");
      setMessage("Assignment assigned to this course. Enrolled students will see it now.");
    } catch (err: any) {
      setMessage(err.message || "Failed to assign");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this assignment from the course?")) return;
    const res = await fetch(`/api/faculty/assignments?id=${id}`, { method: "DELETE" });
    if (res.ok) setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{cmsData?.heading || "Assignments"}</h1>
        <p className="text-sm text-slate-500 font-medium">
          Assign work to a specific course. Only enrolled students of that course will see it.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
      >
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Assign new work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Course *</label>
            <select
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white"
            >
              {courses.length === 0 && <option value="">No courses yet</option>}
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Title *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build the checkout API"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Instructions</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What students should submit for this course..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white"
          />
        </div>
        {message && <p className="text-sm font-semibold text-slate-700">{message}</p>}
        <button
          type="submit"
          disabled={saving || courses.length === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#0055FF] text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? "Assigning..." : "Assign to course"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">Assigned to your courses</h2>
        {assignments.length === 0 ? (
          <div className="p-8 rounded-2xl border border-slate-200 bg-white text-slate-500 text-sm">
            No assignments yet. Create one above — students will only see it on that course.
          </div>
        ) : (
          assignments.map((a) => (
            <div key={a.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#0055FF] mb-1">{a.course?.title}</p>
                  <h3 className="font-bold text-slate-900">{a.title}</h3>
                  {a.description && <p className="text-sm text-slate-500 mt-1">{a.description}</p>}
                  <p className="text-xs text-slate-400 mt-2">
                    {a.dueDate ? `Due ${new Date(a.dueDate).toLocaleDateString()}` : "No due date"} ·{" "}
                    {a.submissions?.length || 0} submission{(a.submissions?.length || 0) === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg"
                >
                  Remove
                </button>
              </div>
              {(a.submissions?.length || 0) > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  {a.submissions.map((s) => (
                    <div key={s.id} className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">
                        {s.student.fullName || s.student.name || s.student.email}
                      </span>
                      <span className="text-slate-500">
                        {s.status === "GRADED" ? s.grade || "Graded" : "Submitted"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
