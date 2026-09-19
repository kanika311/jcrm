"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export interface CourseModule {
  title: string;
  topics: string[];
  expanded?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: string | number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  level?: string | null;
  tags?: string[];
  badge?: string | null;
  image?: string | null;
  instructor?: string | null;
  instructorRole?: string | null;
  duration?: string | null;
  whatYouLearn?: string[];
  curriculum?: CourseModule[] | any;
  createdAt: string;
  faculty: {
    id: string;
    fullName: string | null;
    email: string;
  };
}

const DEFAULT_MODULES_FOR_TITLE = (title: string): CourseModule[] => {
  const cleanTitle = title.trim() || "Technology";
  return [
    {
      title: `Module 1: Introduction & Fundamentals of ${cleanTitle}`,
      expanded: true,
      topics: [
        `Foundations & Core Principles of ${cleanTitle}`,
        "Development Environment & Tooling Installation",
        "Essential Syntax, Data Structures & Architecture",
        "Hands-on Lab Exercises & Best Practices",
      ],
    },
    {
      title: `Module 2: Advanced Architecture & Hands-on Implementation`,
      expanded: false,
      topics: [
        "Advanced Design Patterns & Scalability",
        "State Management & API Communication",
        "Security, Authentication & Error Handling Patterns",
        "Practical Problem Solving & Code Reviews",
      ],
    },
    {
      title: `Module 3: Enterprise Capstone Project & Cloud Deployment`,
      expanded: false,
      topics: [
        "Full End-to-End Enterprise Project Building",
        "Unit Testing, Automated CI/CD Pipelines",
        "Cloud Hosting, Monitoring & Performance Optimization",
        "Resume Preparation & Technical Interview Readiness",
      ],
    },
  ];
};

const DEFAULT_WHAT_YOU_LEARN = (title: string): string => {
  const clean = title.trim() || "modern software engineering";
  return [
    `Master foundational to advanced concepts in ${clean}`,
    "Build enterprise-grade, production-ready portfolio projects",
    "Learn industry-standard architectural best practices from mentors",
    "100% placement preparation and referral assistance",
  ].join("\n");
};

// Interactive Curriculum / Modules Builder
function CurriculumEditor({
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
    const nextIdx = modules.length + 1;
    onChange([
      ...modules,
      {
        title: `Module ${nextIdx}: Core Concepts & Lab`,
        expanded: true,
        topics: [
          "Core Principles & Setup",
          "Hands-on Implementation Lab",
        ],
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
    updated[modIdx] = {
      ...updated[modIdx],
      topics: [...currentTopics, text],
    };
    onChange(updated);
    setTopicInputs(prev => ({ ...prev, [modIdx]: "" }));
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

  const autoFillTemplate = () => {
    onChange(DEFAULT_MODULES_FOR_TITLE(courseTitle));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Course Modules & Syllabus ({modules.length} Modules)
          </label>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            Create structured modules and add lesson topics that appear on the course detail page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={autoFillTemplate}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 transition-colors flex items-center gap-1 cursor-pointer"
            title="Automatically generate modules based on course title"
          >
            <span>✨ Auto-Fill Template</span>
          </button>

          <button
            type="button"
            onClick={addModule}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0055FF] text-white hover:bg-blue-600 transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <span>+ Add Module</span>
          </button>
        </div>
      </div>

      {modules.length === 0 && (
        <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center space-y-2 bg-black/10">
          <p className="text-xs text-[var(--text-secondary)]">No modules defined yet for this course.</p>
          <button
            type="button"
            onClick={autoFillTemplate}
            className="text-xs font-bold text-[#0055FF] hover:underline cursor-pointer"
          >
            ✨ Click here to generate standard curriculum modules
          </button>
        </div>
      )}

      <div className="space-y-3">
        {modules.map((mod, modIdx) => (
          <div
            key={modIdx}
            className="p-4 rounded-2xl border space-y-3 transition-all"
            style={{ background: "var(--bg-base)", borderColor: "var(--border-soft)" }}
          >
            {/* Module Title Bar */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#0055FF]/20 text-[#0055FF] border border-[#0055FF]/30 flex items-center justify-center text-xs font-extrabold shrink-0">
                {modIdx + 1}
              </span>

              <input
                type="text"
                required
                className="input-premium flex-1 px-3 py-1.5 rounded-xl text-xs font-bold"
                placeholder={`e.g. Module ${modIdx + 1}: Core Concepts & Lab`}
                value={mod.title}
                onChange={e => updateModuleTitle(modIdx, e.target.value)}
              />

              <button
                type="button"
                onClick={() => removeModule(modIdx)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer shrink-0"
                title="Delete this module"
              >
                🗑
              </button>
            </div>

            {/* Topics inside this Module */}
            <div className="pl-9 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {(mod.topics || []).map((topic, topicIdx) => (
                  <span
                    key={topicIdx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-200"
                  >
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={() => removeTopic(modIdx, topicIdx)}
                      className="text-slate-400 hover:text-red-400 font-bold ml-1 cursor-pointer"
                      title="Remove topic"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add New Topic Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  className="input-premium flex-1 px-3 py-1 rounded-lg text-xs"
                  placeholder="+ Add syllabus lesson / topic (press Enter)..."
                  value={topicInputs[modIdx] || ""}
                  onChange={e => setTopicInputs({ ...topicInputs, [modIdx]: e.target.value })}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTopic(modIdx);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddTopic(modIdx)}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
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

export default function CoursesClient({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [filter, setFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form states for New Course
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newLevel, setNewLevel] = useState("Beginner to Advanced");
  const [newInstructor, setNewInstructor] = useState("Aisha Verma");
  const [newInstructorRole, setNewInstructorRole] = useState("Senior Tech Lead & Industry Practitioner");
  const [newDuration, setNewDuration] = useState("3 Months • 120 Hours");
  const [newBadge, setNewBadge] = useState("100% Placement");
  const [newTags, setNewTags] = useState("React, TypeScript, Next.js");
  const [newImage, setNewImage] = useState(
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
  );
  const [newStatus, setNewStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [newWhatYouLearn, setNewWhatYouLearn] = useState<string>(DEFAULT_WHAT_YOU_LEARN("Frontend Development"));
  const [newCurriculum, setNewCurriculum] = useState<CourseModule[]>(DEFAULT_MODULES_FOR_TITLE("Frontend Development"));

  // State for Edit Course specific fields
  const [editWhatYouLearn, setEditWhatYouLearn] = useState<string>("");
  const [editCurriculum, setEditCurriculum] = useState<CourseModule[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scrolling when any modal is open
  useEffect(() => {
    if (isAddModalOpen || editingCourse) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAddModalOpen, editingCourse]);

  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // Open Edit Modal with initialized values
  const startEditing = (course: Course) => {
    let parsedCurriculum: CourseModule[] = [];
    if (Array.isArray(course.curriculum)) {
      parsedCurriculum = course.curriculum;
    } else if (typeof course.curriculum === "string") {
      try {
        parsedCurriculum = JSON.parse(course.curriculum);
      } catch {
        parsedCurriculum = [];
      }
    }
    if (!parsedCurriculum || parsedCurriculum.length === 0) {
      parsedCurriculum = DEFAULT_MODULES_FOR_TITLE(course.title);
    }

    const learnText = Array.isArray(course.whatYouLearn) && course.whatYouLearn.length > 0
      ? course.whatYouLearn.join("\n")
      : DEFAULT_WHAT_YOU_LEARN(course.title);

    setEditWhatYouLearn(learnText);
    setEditCurriculum(parsedCurriculum);
    setEditingCourse({
      ...course,
      instructorRole: course.instructorRole || "Senior Tech Lead & Industry Practitioner",
      duration: course.duration || "3 Months • 120 Hours",
    });
  };

  // Handle Image File Upload
  const handleImageFileUpload = async (file: File, target: "add" | "edit") => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP, etc.)");
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
          if (target === "add") setNewImage(data.url);
          else if (editingCourse) setEditingCourse({ ...editingCourse, image: data.url });
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        if (target === "add") setNewImage(url);
        else if (editingCourse) setEditingCourse({ ...editingCourse, image: url });
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        if (target === "add") setNewImage(url);
        else if (editingCourse) setEditingCourse({ ...editingCourse, image: url });
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle Quick Status Toggle
  const handleUpdateStatus = async (id: string, newStatus: "PUBLISHED" | "DRAFT" | "ARCHIVED") => {
    setIsSubmitting(true);
    setFeedbackMsg(null);
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
      setFeedbackMsg({ type: "success", text: `Course status updated to ${newStatus}.` });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "An error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Add New Course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const parsedWhatYouLearn = newWhatYouLearn
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          price: Number(newPrice),
          level: newLevel,
          instructor: newInstructor,
          instructorRole: newInstructorRole,
          duration: newDuration,
          badge: newBadge,
          tags: newTags,
          image: newImage,
          status: newStatus,
          whatYouLearn: parsedWhatYouLearn,
          curriculum: newCurriculum,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create course");

      setCourses(prev => [data.course, ...prev]);
      setIsAddModalOpen(false);
      setFeedbackMsg({ type: "success", text: `Course "${newTitle}" created successfully!` });

      // Reset form
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewTags("");
      setNewWhatYouLearn(DEFAULT_WHAT_YOU_LEARN(""));
      setNewCurriculum(DEFAULT_MODULES_FOR_TITLE(""));
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to create course" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Course Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const parsedWhatYouLearn = editWhatYouLearn
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCourse.id,
          title: editingCourse.title,
          description: editingCourse.description,
          price: Number(editingCourse.price),
          status: editingCourse.status,
          level: editingCourse.level,
          badge: editingCourse.badge,
          instructor: editingCourse.instructor,
          instructorRole: editingCourse.instructorRole,
          duration: editingCourse.duration,
          image: editingCourse.image,
          tags: editingCourse.tags,
          whatYouLearn: parsedWhatYouLearn,
          curriculum: editCurriculum,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save changes");

      setCourses(prev =>
        prev.map(c =>
          c.id === editingCourse.id
            ? {
                ...c,
                ...editingCourse,
                whatYouLearn: parsedWhatYouLearn,
                curriculum: editCurriculum,
              }
            : c
        )
      );
      setEditingCourse(null);
      setFeedbackMsg({ type: "success", text: `Course "${editingCourse.title}" updated successfully!` });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to update course" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this course? This action cannot be undone.")) {
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete course");

      setCourses(prev => prev.filter(c => c.id !== id));
      setFeedbackMsg({ type: "success", text: "Course deleted successfully!" });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to delete course" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.instructor || c.faculty?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "ALL" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="heading-font text-3xl font-extrabold mb-2">Course Management</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Create, edit curriculum modules, set instructor details, and manage course catalog.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setNewCurriculum(DEFAULT_MODULES_FOR_TITLE("Frontend Development"));
              setNewWhatYouLearn(DEFAULT_WHAT_YOU_LEARN("Frontend Development"));
              setIsAddModalOpen(true);
            }}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <span className="text-lg leading-none">+</span> Add New Course
          </button>

          <select
            className="input-premium px-4 py-2.5 rounded-xl text-sm font-medium"
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
          >
            <option value="ALL">All Statuses ({courses.length})</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
          </select>

          <input
            type="text"
            placeholder="Search courses..."
            className="input-premium px-4 py-2.5 rounded-xl text-sm flex-1 md:w-60"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between gap-3 ${
            feedbackMsg.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="opacity-60 hover:opacity-100 text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Courses Table */}
      <div
        className="rounded-[24px] overflow-hidden shadow-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
      >
        <div className="overflow-x-auto">
          <table className="data-table w-full text-left">
            <thead>
              <tr
                className="border-b text-xs uppercase"
                style={{ borderColor: "var(--border-soft)", color: "var(--text-secondary)" }}
              >
                <th className="p-4 font-bold">Course</th>
                <th className="p-4 font-bold">Instructor & Level</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
              {filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      {course.image && (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                      )}
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{course.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {course.description}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {course.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30">
                              {course.badge}
                            </span>
                          )}
                          {course.duration && (
                            <span className="text-[10px] font-semibold text-slate-400">
                              ⏱ {course.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="text-sm font-semibold">
                      {course.instructor || course.faculty?.fullName || "Faculty"}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">{course.level || "Beginner"}</div>
                  </td>

                  <td className="p-4 font-bold text-sm text-emerald-400">
                    ₹{Number(course.price).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {course.status === "PUBLISHED" ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Published
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Draft
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end items-center">
                      {/* View live course detail page */}
                      <a
                        href={`/courses/${course.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0055FF]/15 hover:bg-[#0055FF]/25 text-[#38bdf8] border border-[#0055FF]/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        title="View Live Course Page"
                      >
                        <span>View</span>
                        <span className="text-[10px]">↗</span>
                      </a>

                      {course.status !== "PUBLISHED" ? (
                        <button
                          disabled={isSubmitting}
                          onClick={() => handleUpdateStatus(course.id, "PUBLISHED")}
                          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          disabled={isSubmitting}
                          onClick={() => handleUpdateStatus(course.id, "DRAFT")}
                          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Unpublish
                        </button>
                      )}

                      <button
                        onClick={() => startEditing(course)}
                        className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        disabled={isSubmitting}
                        onClick={() => handleDeleteCourse(course.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    No courses found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD NEW COURSE */}
      {mounted &&
        isAddModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
            style={{ margin: 0 }}
            onClick={() => setIsAddModalOpen(false)}
          >
            <div
              className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden m-auto"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex justify-between items-center px-6 py-4 border-b shrink-0"
                style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
              >
                <div>
                  <h3 className="text-xl font-bold">Add New Course & Curriculum</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Build course details, learning outcomes, and module syllabus.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Body + Footer */}
              <form onSubmit={handleAddCourse} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
                  {/* Basic Details Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#0055FF] uppercase tracking-wider">
                      1. Basic Course Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Course Title *
                        </label>
                        <input
                          type="text"
                          required
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          placeholder="e.g. Next.js & Full-Stack AI Mastery"
                          value={newTitle}
                          onChange={e => setNewTitle(e.target.value)}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Instructor Name
                        </label>
                        <input
                          type="text"
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          placeholder="e.g. Aisha Verma"
                          value={newInstructor}
                          onChange={e => setNewInstructor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Instructor Role / Title
                        </label>
                        <input
                          type="text"
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          placeholder="e.g. Senior Frontend Lead @ JCRM Technologies"
                          value={newInstructorRole}
                          onChange={e => setNewInstructorRole(e.target.value)}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Duration & Hours
                        </label>
                        <input
                          type="text"
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          placeholder="e.g. 3 Months • 120 Hours"
                          value={newDuration}
                          onChange={e => setNewDuration(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold mb-1 uppercase"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                        placeholder="Brief overview of curriculum, hands-on projects, and learning outcomes..."
                        value={newDescription}
                        onChange={e => setNewDescription(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          placeholder="14999"
                          value={newPrice}
                          onChange={e => setNewPrice(e.target.value)}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Level
                        </label>
                        <select
                          className="select-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={newLevel}
                          onChange={e => setNewLevel(e.target.value)}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Beginner to Advanced">Beginner to Advanced</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Specialized">Specialized</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Status
                        </label>
                        <select
                          className="select-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={newStatus}
                          onChange={e => setNewStatus(e.target.value as any)}
                        >
                          <option value="PUBLISHED">Published</option>
                          <option value="DRAFT">Draft</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Badge (e.g. 100% Placement)
                        </label>
                        <input
                          type="text"
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          placeholder="e.g. 100% Placement Track, Best Seller"
                          value={newBadge}
                          onChange={e => setNewBadge(e.target.value)}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          placeholder="React, Frontend, Next.js"
                          value={newTags}
                          onChange={e => setNewTags(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--border-soft)" }}>
                    <h4 className="text-xs font-bold text-[#0055FF] uppercase tracking-wider">
                      2. Course Thumbnail Image
                    </h4>

                    <div
                      className="space-y-3 p-4 rounded-2xl border"
                      style={{ background: "var(--bg-base)", borderColor: "var(--border-soft)" }}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div
                          className="relative w-28 h-20 rounded-xl overflow-hidden border shrink-0 bg-black/10 flex items-center justify-center"
                          style={{ borderColor: "var(--border-soft)" }}
                        >
                          {newImage ? (
                            <img src={newImage} alt="Course preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-400">No Image</span>
                          )}
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              ref={addFileInputRef}
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleImageFileUpload(file, "add");
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => addFileInputRef.current?.click()}
                              disabled={isUploadingImage}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0055FF] text-white hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                            >
                              {isUploadingImage ? "Uploading..." : "📁 Upload Image from Device"}
                            </button>

                            {newImage && (
                              <button
                                type="button"
                                onClick={() => setNewImage("")}
                                className="px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--text-tertiary)]">PNG, JPG, WEBP up to 5MB.</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t" style={{ borderColor: "var(--border-soft)" }}>
                        <input
                          type="url"
                          className="input-premium w-full px-3 py-2 rounded-xl text-xs"
                          placeholder="Or paste image URL: https://images.unsplash.com/..."
                          value={newImage}
                          onChange={e => setNewImage(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* What You'll Learn Section */}
                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--border-soft)" }}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#0055FF] uppercase tracking-wider">
                        3. What You'll Learn (Outcomes)
                      </h4>
                      <button
                        type="button"
                        onClick={() => setNewWhatYouLearn(DEFAULT_WHAT_YOU_LEARN(newTitle))}
                        className="text-xs font-bold text-purple-400 hover:underline cursor-pointer"
                      >
                        ✨ Reset Suggestions
                      </button>
                    </div>
                    <p className="text-[11px] text-[var(--text-tertiary)]">
                      Enter each learning takeaway on a new line. These display as checkmark bullets on the course detail page.
                    </p>
                    <textarea
                      rows={4}
                      className="input-premium w-full px-4 py-2.5 rounded-xl text-xs font-mono leading-relaxed"
                      placeholder="Master modern frontend development&#10;Build 5 production-grade portfolio applications&#10;100% placement assistance & mentorship"
                      value={newWhatYouLearn}
                      onChange={e => setNewWhatYouLearn(e.target.value)}
                    />
                  </div>

                  {/* Curriculum Modules Section */}
                  <div className="pt-2 border-t" style={{ borderColor: "var(--border-soft)" }}>
                    <CurriculumEditor
                      modules={newCurriculum}
                      onChange={setNewCurriculum}
                      courseTitle={newTitle}
                    />
                  </div>
                </div>

                {/* Sticky Footer */}
                <div
                  className="px-6 py-4 border-t flex justify-end gap-3 shrink-0"
                  style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
                >
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? "Creating..." : "Add Course & Modules"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL: EDIT COURSE */}
      {mounted &&
        editingCourse &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
            style={{ margin: 0 }}
            onClick={() => setEditingCourse(null)}
          >
            <div
              className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden m-auto"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex justify-between items-center px-6 py-4 border-b shrink-0"
                style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
              >
                <div>
                  <h3 className="text-xl font-bold">Edit Course & Syllabus</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Update course curriculum modules, learning takeaways, and metadata.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Body + Footer */}
              <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
                  {/* Basic Details Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#0055FF] uppercase tracking-wider">
                      1. Course Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Course Title *
                        </label>
                        <input
                          type="text"
                          required
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={editingCourse.title}
                          onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Instructor Name
                        </label>
                        <input
                          type="text"
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={editingCourse.instructor || ""}
                          onChange={e => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Instructor Role / Title
                        </label>
                        <input
                          type="text"
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={editingCourse.instructorRole || ""}
                          onChange={e => setEditingCourse({ ...editingCourse, instructorRole: e.target.value })}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Duration & Hours
                        </label>
                        <input
                          type="text"
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={editingCourse.duration || ""}
                          onChange={e => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold mb-1 uppercase"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                        value={editingCourse.description}
                        onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          required
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={editingCourse.price}
                          onChange={e => setEditingCourse({ ...editingCourse, price: e.target.value })}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Level
                        </label>
                        <select
                          className="select-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={editingCourse.level || "Beginner"}
                          onChange={e => setEditingCourse({ ...editingCourse, level: e.target.value })}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Beginner to Advanced">Beginner to Advanced</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Specialized">Specialized</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Status
                        </label>
                        <select
                          className="select-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={editingCourse.status}
                          onChange={e => setEditingCourse({ ...editingCourse, status: e.target.value as any })}
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Badge
                        </label>
                        <input
                          type="text"
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={editingCourse.badge || ""}
                          onChange={e => setEditingCourse({ ...editingCourse, badge: e.target.value })}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-bold mb-1 uppercase"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                          value={
                            Array.isArray(editingCourse.tags)
                              ? editingCourse.tags.join(", ")
                              : editingCourse.tags || ""
                          }
                          onChange={e =>
                            setEditingCourse({
                              ...editingCourse,
                              tags: e.target.value
                                .split(",")
                                .map(t => t.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--border-soft)" }}>
                    <h4 className="text-xs font-bold text-[#0055FF] uppercase tracking-wider">
                      2. Course Thumbnail Image
                    </h4>

                    <div
                      className="space-y-3 p-4 rounded-2xl border"
                      style={{ background: "var(--bg-base)", borderColor: "var(--border-soft)" }}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div
                          className="relative w-28 h-20 rounded-xl overflow-hidden border shrink-0 bg-black/10 flex items-center justify-center"
                          style={{ borderColor: "var(--border-soft)" }}
                        >
                          {editingCourse.image ? (
                            <img
                              src={editingCourse.image}
                              alt="Course preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">No Image</span>
                          )}
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              ref={editFileInputRef}
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleImageFileUpload(file, "edit");
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => editFileInputRef.current?.click()}
                              disabled={isUploadingImage}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0055FF] text-white hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                            >
                              {isUploadingImage ? "Uploading..." : "📁 Upload Image from Device"}
                            </button>

                            {editingCourse.image && (
                              <button
                                type="button"
                                onClick={() => setEditingCourse({ ...editingCourse, image: "" })}
                                className="px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--text-tertiary)]">PNG, JPG, WEBP up to 5MB.</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t" style={{ borderColor: "var(--border-soft)" }}>
                        <input
                          type="url"
                          className="input-premium w-full px-3 py-2 rounded-xl text-xs"
                          placeholder="https://images.unsplash.com/..."
                          value={editingCourse.image || ""}
                          onChange={e => setEditingCourse({ ...editingCourse, image: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* What You'll Learn Section */}
                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--border-soft)" }}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#0055FF] uppercase tracking-wider">
                        3. What You'll Learn (Outcomes)
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditWhatYouLearn(DEFAULT_WHAT_YOU_LEARN(editingCourse.title))}
                        className="text-xs font-bold text-purple-400 hover:underline cursor-pointer"
                      >
                        ✨ Reset Suggestions
                      </button>
                    </div>
                    <p className="text-[11px] text-[var(--text-tertiary)]">
                      Enter each learning takeaway on a new line.
                    </p>
                    <textarea
                      rows={4}
                      className="input-premium w-full px-4 py-2.5 rounded-xl text-xs font-mono leading-relaxed"
                      placeholder="Master key technical skills&#10;Build real-world production projects"
                      value={editWhatYouLearn}
                      onChange={e => setEditWhatYouLearn(e.target.value)}
                    />
                  </div>

                  {/* Curriculum Modules Section */}
                  <div className="pt-2 border-t" style={{ borderColor: "var(--border-soft)" }}>
                    <CurriculumEditor
                      modules={editCurriculum}
                      onChange={setEditCurriculum}
                      courseTitle={editingCourse.title}
                    />
                  </div>
                </div>

                {/* Sticky Footer */}
                <div
                  className="px-6 py-4 border-t flex justify-end gap-3 shrink-0"
                  style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
                >
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
