"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TeamMemberItem } from "../TeamManagementClient";

const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5 tracking-normal";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium tracking-normal focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white";

export default function TeamEditClient({ initialMember }: { initialMember: TeamMemberItem }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<TeamMemberItem>(initialMember);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const update = <K extends keyof TeamMemberItem>(key: K, value: TeamMemberItem[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be under 5MB.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          update("image", data.url);
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = (e) => update("image", e.target?.result as string);
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => update("image", e.target?.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          department: form.department,
          image: form.image,
          city: form.city,
          state: form.state,
          country: form.country,
          college: form.college,
          education: form.education,
          experience: form.experience,
          skills: form.skills,
          bio: form.bio,
          company: form.company,
          status: form.status,
          isVerified: form.isVerified,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update member");

      setFeedback({ type: "success", text: `"${form.name}" updated successfully.` });
      router.refresh();
      setTimeout(() => router.push("/admin/team"), 800);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to update member" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-sans tracking-normal">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link href="/admin/team" className="hover:text-slate-900 font-medium">
            Team
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Edit member</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="heading-font text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Team Member
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Update profile details, skills, and approval status.
            </p>
          </div>
          <Link
            href="/admin/team"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
          >
            ← Back to team
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full name *</label>
            <input
              type="text"
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Email address *</label>
            <input
              type="email"
              required
              className={inputClass}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone number</label>
            <input
              type="text"
              className={inputClass}
              value={form.phone || ""}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Role / designation *</label>
            <input
              type="text"
              required
              className={inputClass}
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Department</label>
            <input
              type="text"
              className={inputClass}
              value={form.department || ""}
              onChange={(e) => update("department", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              className={inputClass}
              value={form.city || ""}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              type="text"
              className={inputClass}
              value={form.state || ""}
              onChange={(e) => update("state", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>College / institution</label>
            <input
              type="text"
              className={inputClass}
              value={form.college || ""}
              onChange={(e) => update("college", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Education / degree</label>
            <input
              type="text"
              className={inputClass}
              value={form.education || ""}
              onChange={(e) => update("education", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Key skills (comma-separated)</label>
          <input
            type="text"
            className={inputClass}
            value={Array.isArray(form.skills) ? form.skills.join(", ") : form.skills || ""}
            onChange={(e) =>
              update(
                "skills",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>

        <div>
          <label className={labelClass}>Bio / summary</label>
          <textarea
            rows={4}
            className={`${inputClass} resize-y min-h-[110px]`}
            value={form.bio || ""}
            onChange={(e) => update("bio", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Profile picture</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white">
              {form.image ? (
                <img src={form.image} alt={form.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-400 flex items-center justify-center h-full">No photo</span>
              )}
            </div>
            <div className="flex-1 w-full space-y-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#0055FF] text-white hover:bg-blue-600 disabled:opacity-60"
              >
                {isUploadingImage ? "Uploading..." : "Upload photo"}
              </button>
              <input
                type="url"
                className={inputClass}
                placeholder="Or paste image URL"
                value={form.image || ""}
                onChange={(e) => update("image", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Company / placed at</label>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. Infosys, TCS, Amazon"
            value={form.company || ""}
            onChange={(e) => update("company", e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-1">
            Required for homepage when status is Placed or Alumni.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={
                form.status === "APPROVED"
                  ? "STUDENT"
                  : form.status === "PENDING" || form.status === "REJECTED"
                  ? "CANDIDATE"
                  : form.status
              }
              onChange={(e) => update("status", e.target.value as TeamMemberItem["status"])}
            >
              <option value="CANDIDATE">Candidate</option>
              <option value="STUDENT">Student</option>
              <option value="PLACED">Placed</option>
              <option value="ALUMNI">Alumni</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Placed and Alumni appear on the home page.
            </p>
          </div>
          <div className="flex items-center gap-2.5 pt-7">
            <input
              type="checkbox"
              id="editIsVerified"
              checked={form.isVerified}
              onChange={(e) => update("isVerified", e.target.checked)}
              className="w-4 h-4 rounded text-[#0055FF] cursor-pointer"
            />
            <label htmlFor="editIsVerified" className="text-sm font-semibold text-slate-700 cursor-pointer tracking-normal">
              Mark profile as verified
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <Link
            href="/admin/team"
            className="px-5 py-3 rounded-xl text-sm font-semibold text-center border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#0055FF] hover:bg-blue-600 disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
