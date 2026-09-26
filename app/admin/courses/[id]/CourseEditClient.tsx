"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type Course,
  type CourseModule,
  DEFAULT_MODULES_FOR_TITLE,
  DEFAULT_WHAT_YOU_LEARN,
} from "../CoursesClient";

const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5 tracking-normal";
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium tracking-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:border-[#0055FF]";

function parseCurriculum(raw: Course["curriculum"], title: string): CourseModule[] {
  let parsed: CourseModule[] = [];
  if (Array.isArray(raw)) parsed = raw;
  else if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = [];
    }
  }
  if (!parsed || parsed.length === 0) return DEFAULT_MODULES_FOR_TITLE(title);
  return parsed.map((mod) => ({
    ...mod,
    topics: Array.isArray(mod.topics) ? mod.topics : [],
  }));
}

function LightCurriculumEditor({
  modules,
  onChange,
  courseTitle,
}: {
  modules: CourseModule[];
  onChange: (mods: CourseModule[]) => void;
  courseTitle: string;
}) {
  const [topicInputs, setTopicInputs] = useState<Record<number, string>>({});

  const addModule = () => {
    onChange([
      ...modules,
      {
        title: `Module ${modules.length + 1}: Core Concepts & Lab`,
        expanded: true,
        topics: ["Core Principles & Setup", "Hands-on Implementation Lab"],
      },
    ]);
  };

  const removeModule = (index: number) => {
    onChange(modules.filter((_, i) => i !== index));
  };

  const updateModuleTitle = (index: number, title: string) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], title };
    onChange(updated);
  };

  const handleAddTopic = (modIdx: number) => {
    const text = (topicInputs[modIdx] || "").trim();
    if (!text) return;
    const updated = [...modules];
    const currentTopics = Array.isArray(updated[modIdx].topics) ? updated[modIdx].topics : [];
    updated[modIdx] = { ...updated[modIdx], topics: [...currentTopics, text] };
    onChange(updated);
    setTopicInputs((prev) => ({ ...prev, [modIdx]: "" }));
  };

  const removeTopic = (modIdx: number, topicIdx: number) => {
    const updated = [...modules];
    const currentTopics = Array.isArray(updated[modIdx].topics) ? updated[modIdx].topics : [];
    updated[modIdx] = {
      ...updated[modIdx],
      topics: currentTopics.filter((_, i) => i !== topicIdx),
    };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Course Modules & Syllabus ({modules.length} modules)
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Create structured modules and add lesson topics that appear on the course detail page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(DEFAULT_MODULES_FOR_TITLE(courseTitle))}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200"
          >
            Auto-Fill Template
          </button>
          <button
            type="button"
            onClick={addModule}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0055FF] text-white hover:bg-blue-600"
          >
            + Add Module
          </button>
        </div>
      </div>

      {modules.length === 0 && (
        <div className="p-6 rounded-2xl border border-dashed border-slate-300 text-center bg-slate-50">
          <p className="text-sm text-slate-600 mb-2">No modules defined yet for this course.</p>
          <button
            type="button"
            onClick={() => onChange(DEFAULT_MODULES_FOR_TITLE(courseTitle))}
            className="text-sm font-bold text-[#0055FF] hover:underline"
          >
            Generate standard curriculum modules
          </button>
        </div>
      )}

      <div className="space-y-3">
        {modules.map((mod, modIdx) => (
          <div key={modIdx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#0055FF] border border-blue-200 flex items-center justify-center text-xs font-extrabold shrink-0">
                {modIdx + 1}
              </span>
              <input
                type="text"
                required
                className={inputClass + " flex-1 !py-2"}
                placeholder={`e.g. Module ${modIdx + 1}: Core Concepts & Lab`}
                value={mod.title}
                onChange={(e) => updateModuleTitle(modIdx, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeModule(modIdx)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 shrink-0"
              >
                Delete
              </button>
            </div>

            <div className="pl-9 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {(mod.topics || []).map((topic, topicIdx) => (
                  <span
                    key={topicIdx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800"
                  >
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={() => removeTopic(modIdx, topicIdx)}
                      className="text-slate-400 hover:text-rose-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  className={inputClass + " flex-1 !py-2"}
                  placeholder="+ Add syllabus lesson / topic (press Enter)..."
                  value={topicInputs[modIdx] || ""}
                  onChange={(e) => setTopicInputs({ ...topicInputs, [modIdx]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTopic(modIdx);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddTopic(modIdx)}
                  className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-700 shrink-0"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CourseEditClient({ initialCourse }: { initialCourse: Course }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Course>({
    ...initialCourse,
    instructorRole: initialCourse.instructorRole || "Senior Tech Lead & Industry Practitioner",
    duration: initialCourse.duration || "3 Months • 120 Hours",
  });
  const [whatYouLearn, setWhatYouLearn] = useState(
    Array.isArray(initialCourse.whatYouLearn) && initialCourse.whatYouLearn.length > 0
      ? initialCourse.whatYouLearn.join("\n")
      : DEFAULT_WHAT_YOU_LEARN(initialCourse.title)
  );
  const [curriculum, setCurriculum] = useState<CourseModule[]>(
    parseCurriculum(initialCourse.curriculum, initialCourse.title)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const update = <K extends keyof Course>(key: K, value: Course[K]) => {
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
      const parsedWhatYouLearn = whatYouLearn
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          title: form.title,
          description: form.description,
          price: Number(form.price),
          status: form.status,
          level: form.level,
          badge: form.badge,
          instructor: form.instructor,
          instructorRole: form.instructorRole,
          duration: form.duration,
          image: form.image,
          tags: form.tags,
          whatYouLearn: parsedWhatYouLearn,
          curriculum,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save changes");

      setFeedback({ type: "success", text: `Course "${form.title}" updated successfully.` });
      router.refresh();
      setTimeout(() => router.push("/admin/courses"), 800);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to update course" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-theme="light"
      className="max-w-4xl mx-auto space-y-6 pb-16 font-sans tracking-normal text-slate-900"
      style={{ colorScheme: "light", color: "#0f172a" }}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link href="/admin/courses" className="hover:text-slate-900 font-medium">
            Courses
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Edit course</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Course & Syllabus
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Update course curriculum modules, learning takeaways, and metadata.
            </p>
          </div>
          <Link
            href="/admin/courses"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
          >
            ← Back to courses
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

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-xs space-y-8">
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[#0055FF] uppercase tracking-wider">1. Course Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Course Title *</label>
              <input required className={inputClass} value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Instructor Name</label>
              <input className={inputClass} value={form.instructor || ""} onChange={(e) => update("instructor", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Instructor Role / Title</label>
              <input className={inputClass} value={form.instructorRole || ""} onChange={(e) => update("instructorRole", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Duration & Hours</label>
              <input className={inputClass} value={form.duration || ""} onChange={(e) => update("duration", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              required
              rows={3}
              className={inputClass}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Price (₹)</label>
              <input
                type="number"
                required
                className={inputClass}
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Level</label>
              <select
                className={inputClass}
                value={form.level || "Beginner"}
                onChange={(e) => update("level", e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Beginner to Advanced">Beginner to Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Specialized">Specialized</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => update("status", e.target.value as Course["status"])}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge</label>
              <input className={inputClass} value={form.badge || ""} onChange={(e) => update("badge", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Tags (comma-separated)</label>
              <input
                className={inputClass}
                value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags || ""}
                onChange={(e) =>
                  update(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  )
                }
              />
            </div>
          </div>
        </section>

        <section className="space-y-3 pt-2 border-t border-slate-200">
          <h2 className="text-xs font-bold text-[#0055FF] uppercase tracking-wider">2. Course Thumbnail Image</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
            <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0">
              {form.image ? (
                <img src={form.image} alt="Course preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-400">No Image</span>
              )}
            </div>
            <div className="flex-1 space-y-2 w-full">
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
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0055FF] text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {isUploadingImage ? "Uploading..." : "Upload Image from Device"}
                </button>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => update("image", "")}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                inputMode="url"
                className={inputClass}
                placeholder="https://images.unsplash.com/..."
                value={form.image || ""}
                onChange={(e) => update("image", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-bold text-[#0055FF] uppercase tracking-wider">
              3. What You&apos;ll Learn (Outcomes)
            </h2>
            <button
              type="button"
              onClick={() => setWhatYouLearn(DEFAULT_WHAT_YOU_LEARN(form.title))}
              className="text-xs font-bold text-violet-700 hover:underline"
            >
              Reset Suggestions
            </button>
          </div>
          <p className="text-xs text-slate-500">Enter each learning takeaway on a new line.</p>
          <textarea
            rows={4}
            className={inputClass + " font-mono leading-relaxed"}
            placeholder={"Master key technical skills\nBuild real-world production projects"}
            value={whatYouLearn}
            onChange={(e) => setWhatYouLearn(e.target.value)}
          />
        </section>

        <section className="pt-2 border-t border-slate-200">
          <h2 className="text-xs font-bold text-[#0055FF] uppercase tracking-wider mb-4">4. Course Modules & Syllabus</h2>
          <LightCurriculumEditor modules={curriculum} onChange={setCurriculum} courseTitle={form.title} />
        </section>

        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <Link
            href="/admin/courses"
            className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0055FF] text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
