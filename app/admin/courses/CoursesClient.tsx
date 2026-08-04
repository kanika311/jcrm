"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  createdAt: string;
  faculty: {
    id: string;
    fullName: string | null;
    email: string;
  };
}

export default function CoursesClient({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [filter, setFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();

  const handleUpdateStatus = async (id: string, newStatus: "PUBLISHED" | "DRAFT" | "ARCHIVED") => {
    setIsUpdating(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setCourses(prev =>
        prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setIsUpdating(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCourse.id,
          title: editingCourse.title,
          description: editingCourse.description,
          price: Number(editingCourse.price),
          status: editingCourse.status,
        }),
      });
      if (!res.ok) throw new Error("Failed to save changes");

      setCourses(prev =>
        prev.map(c => (c.id === editingCourse.id ? { ...editingCourse } : c))
      );
      setEditingCourse(null);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.faculty.fullName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "ALL" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="heading-font text-3xl font-extrabold mb-2">Global Course Catalog</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Review, approve, reject, or edit faculty courses across the platform.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="input-premium px-4 py-2 rounded-lg text-sm"
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published / Approved</option>
            <option value="DRAFT">Drafts / Pending Review</option>
          </select>
          <input
            type="text"
            placeholder="Search courses..."
            className="input-premium px-4 py-2 rounded-lg text-sm flex-1 md:w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="rounded-[24px] overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
        <div className="overflow-x-auto">
          <table className="data-table w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border-soft)" }}>
                <th className="p-4">Course Info</th>
                <th className="p-4">Instructor</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr
                  key={course.id}
                  className="border-b last:border-0 hover:bg-white/5 transition-colors"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <td className="p-4 max-w-xs">
                    <div className="font-bold text-sm truncate">{course.title}</div>
                    <div className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">{course.description}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-semibold">{course.faculty.fullName || "Sarah Jenkins"}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{course.faculty.email}</div>
                  </td>
                  <td className="p-4 font-bold text-sm">
                    ₹{Number(course.price).toLocaleString()}
                  </td>
                  <td className="p-4">
                    {course.status === "PUBLISHED" ? (
                      <span className="badge-success px-2 py-1 rounded text-xs font-bold">Approved & Published</span>
                    ) : (
                      <span className="badge-warning px-2 py-1 rounded text-xs font-bold">Pending Review</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end items-center">
                      {course.status !== "PUBLISHED" ? (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(course.id, "PUBLISHED")}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(course.id, "DRAFT")}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Unpublish
                        </button>
                      )}
                      
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          const name = course.faculty.fullName || "Instructor";
                          const prefillMsg = `[Discussion about Course: ${course.title} (ID: ${course.id})]: `;
                          router.push(`/admin/messages?chatWith=${course.faculty.id}&prefill=${encodeURIComponent(prefillMsg)}`);
                        }}
                        className="btn-primary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Message
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No courses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
            <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: "var(--border-soft)" }}>
              <h3 className="text-xl font-bold">Edit Course Details</h3>
              <button onClick={() => setEditingCourse(null)} className="p-2 rounded-lg hover:bg-white/10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                  value={editingCourse.title}
                  onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                  value={editingCourse.description}
                  onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                    value={editingCourse.price}
                    onChange={e => setEditingCourse({ ...editingCourse, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="select-premium w-full px-4 py-2 rounded-xl text-sm"
                    value={editingCourse.status}
                    onChange={e => setEditingCourse({ ...editingCourse, status: e.target.value as any })}
                  >
                    <option value="DRAFT">Draft / Under Review</option>
                    <option value="PUBLISHED">Published / Approved</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t" style={{ borderColor: "var(--border-soft)" }}>
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="btn-secondary px-4 py-2 rounded-xl text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary px-4 py-2 rounded-xl text-sm font-bold"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
