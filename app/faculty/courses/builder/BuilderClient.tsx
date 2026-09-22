"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  recordedDate?: string;
  notes?: string;
}

interface Module {
  id: string;
  title: string;
  releaseDate?: string;
  description?: string;
  lessons: Lesson[];
}

interface LiveSession {
  id: string;
  title: string;
  scheduledAt: string; // ISO string or YYYY-MM-DDTHH:mm
  duration: number; // minutes
  meetingUrl: string;
  description?: string;
  status: "SCHEDULED" | "LIVE_NOW" | "COMPLETED";
  recordingUrl?: string;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  status: string;
  instructor: string;
  curriculum?: {
    modules?: Module[];
    liveSessions?: LiveSession[];
  };
}

export default function BuilderClient({ initialCourses }: { initialCourses: { id: string; title: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("id");

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    requestedId || initialCourses[0]?.id || ""
  );
  const [course, setCourse] = useState<CourseData | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"modules" | "live">("modules");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // New module modal / form state
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModTitle, setNewModTitle] = useState("");
  const [newModDate, setNewModDate] = useState("");
  const [newModDesc, setNewModDesc] = useState("");

  // New lesson modal / form state
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("45 mins");
  const [newLessonDate, setNewLessonDate] = useState("");
  const [newLessonNotes, setNewLessonNotes] = useState("");

  // New live session modal / form state
  const [showAddLive, setShowAddLive] = useState(false);
  const [newLiveTitle, setNewLiveTitle] = useState("");
  const [newLiveDateTime, setNewLiveDateTime] = useState("");
  const [newLiveDuration, setNewLiveDuration] = useState(60);
  const [newLiveMeetingUrl, setNewLiveMeetingUrl] = useState("");
  const [newLiveDesc, setNewLiveDesc] = useState("");

  // Load course details when selectedCourseId changes
  useEffect(() => {
    if (!selectedCourseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/faculty/courses/${selectedCourseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.course) {
          setCourse(data.course);
          const curr = data.course.curriculum || {};
          setModules(curr.modules || []);
          setLiveSessions(curr.liveSessions || []);
        } else {
          setMessage({ text: data.error || "Failed to load course", type: "error" });
        }
      })
      .catch(err => {
        console.error(err);
        setMessage({ text: "Network error loading course", type: "error" });
      })
      .finally(() => setLoading(false));
  }, [selectedCourseId]);

  // Handle course switch
  const handleCourseSwitch = (id: string) => {
    setSelectedCourseId(id);
    router.push(`/faculty/courses/builder?id=${id}`);
  };

  // Save all curriculum changes
  const saveCurriculum = async () => {
    if (!selectedCourseId) return;
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        curriculum: {
          modules,
          liveSessions,
        }
      };

      const res = await fetch(`/api/faculty/courses/${selectedCourseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Course curriculum and live sessions saved successfully!", type: "success" });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ text: data.error || "Failed to save", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: "Error saving course changes", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Add a new module (supports advance modules for upcoming days)
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTitle.trim()) return;

    const newMod: Module = {
      id: "mod_" + Date.now().toString(36),
      title: newModTitle.trim(),
      releaseDate: newModDate || new Date().toISOString().split("T")[0],
      description: newModDesc.trim(),
      lessons: [],
    };

    setModules([...modules, newMod]);
    setNewModTitle("");
    setNewModDate("");
    setNewModDesc("");
    setShowAddModule(false);
    setMessage({ text: "Module added! Remember to click 'Save All Changes'.", type: "success" });
  };

  // Delete a module
  const handleDeleteModule = (modId: string) => {
    if (confirm("Are you sure you want to delete this module and all its lessons?")) {
      setModules(modules.filter(m => m.id !== modId));
    }
  };

  // Add recorded lecture to a module
  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModuleForLesson || !newLessonTitle.trim()) return;

    const newLesson: Lesson = {
      id: "les_" + Date.now().toString(36),
      title: newLessonTitle.trim(),
      videoUrl: newLessonVideoUrl.trim(),
      duration: newLessonDuration.trim() || "45 mins",
      recordedDate: newLessonDate || new Date().toISOString().split("T")[0],
      notes: newLessonNotes.trim(),
    };

    setModules(modules.map(mod => {
      if (mod.id === activeModuleForLesson) {
        return {
          ...mod,
          lessons: [...(mod.lessons || []), newLesson],
        };
      }
      return mod;
    }));

    setNewLessonTitle("");
    setNewLessonVideoUrl("");
    setNewLessonDuration("45 mins");
    setNewLessonDate("");
    setNewLessonNotes("");
    setActiveModuleForLesson(null);
    setMessage({ text: "Recorded lecture added! Click 'Save All Changes' to make it live.", type: "success" });
  };

  // Delete a lesson
  const handleDeleteLesson = (modId: string, lessonId: string) => {
    setModules(modules.map(mod => {
      if (mod.id === modId) {
        return {
          ...mod,
          lessons: mod.lessons.filter(l => l.id !== lessonId),
        };
      }
      return mod;
    }));
  };

  // Schedule a new live session
  const handleAddLiveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiveTitle.trim() || !newLiveDateTime) return;

    const autoRoomUrl = newLiveMeetingUrl.trim() || `https://meet.jit.si/jcrm-live-${selectedCourseId}-${Date.now().toString(36)}`;

    const newSession: LiveSession = {
      id: "live_" + Date.now().toString(36),
      title: newLiveTitle.trim(),
      scheduledAt: newLiveDateTime,
      duration: Number(newLiveDuration) || 60,
      meetingUrl: autoRoomUrl,
      description: newLiveDesc.trim(),
      status: "SCHEDULED",
    };

    setLiveSessions([...liveSessions, newSession]);
    setNewLiveTitle("");
    setNewLiveDateTime("");
    setNewLiveDuration(60);
    setNewLiveMeetingUrl("");
    setNewLiveDesc("");
    setShowAddLive(false);
    setMessage({ text: "Live class scheduled! Click 'Save All Changes' to notify students.", type: "success" });
  };

  // Update live session status
  const updateSessionStatus = (sessionId: string, newStatus: "SCHEDULED" | "LIVE_NOW" | "COMPLETED") => {
    setLiveSessions(liveSessions.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  // Delete live session
  const handleDeleteSession = (sessionId: string) => {
    if (confirm("Delete this live session?")) {
      setLiveSessions(liveSessions.filter(s => s.id !== sessionId));
    }
  };

  if (!initialCourses || initialCourses.length === 0) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto rounded-3xl mt-12" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
        <h2 className="heading-font text-2xl font-bold mb-2">No Courses Found</h2>
        <p className="text-slate-500 mb-6">You need to create a course before adding modules or scheduling live classes.</p>
        <Link href="/faculty/create" className="btn-primary px-6 py-3 rounded-xl font-bold inline-block">
          + Create Your First Course
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header and Course Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: "var(--border-soft)" }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
            <Link href="/faculty/courses" className="hover:text-[var(--accent-primary)]">My Courses</Link>
            <span>/</span>
            <span>Course Builder & Live Manager</span>
          </div>
          <h1 className="heading-font text-2xl sm:text-3xl font-bold">
            {course?.title || "Course Builder"}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Select Course dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Switch Course:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseSwitch(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none"
            >
              {initialCourses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <button
            onClick={saveCurriculum}
            disabled={saving || loading}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              <>
                <span>💾 Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center justify-between transition-all ${
          message.type === "success"
            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
            : "bg-rose-500/10 text-rose-600 border border-rose-500/30"
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b gap-6" style={{ borderColor: "var(--border-soft)" }}>
        <button
          onClick={() => setActiveTab("modules")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "modules"
              ? "border-[#0055FF] text-[#0055FF]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span>📚 Curriculum & Modules</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-[#0055FF]">
            {modules.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("live")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "live"
              ? "border-[#0055FF] text-[#0055FF]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span>🔴 Live Class Scheduler</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-rose-50 text-rose-600">
            {liveSessions.length}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-[#0055FF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold">Loading course curriculum...</p>
        </div>
      ) : activeTab === "modules" ? (
        /* ================= TAB 1: CURRICULUM & MODULES ================= */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
            <div>
              <h2 className="heading-font text-lg font-bold">Course Modules & Recorded Lectures</h2>
              <p className="text-xs text-slate-500">
                Create modules for upcoming days in advance, and upload previous days&apos; recorded lectures.
              </p>
            </div>
            <button
              onClick={() => setShowAddModule(true)}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0"
            >
              + Add New Module / Day
            </button>
          </div>

          {/* Module List */}
          {modules.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-gray-800">
              <span className="text-4xl mb-3 block">📖</span>
              <h3 className="heading-font text-lg font-bold mb-1">No Modules Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Start structuring your course by adding Day 1, Day 2, or custom topic modules. You can also prepare advance modules for tomorrow.
              </p>
              <button
                onClick={() => setShowAddModule(true)}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold"
              >
                + Create First Module
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {modules.map((mod, index) => (
                <div
                  key={mod.id}
                  className="rounded-2xl p-6 transition-all"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
                >
                  {/* Module Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-gray-800 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#0055FF] font-black text-sm flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-base flex items-center gap-2">
                          <span>{mod.title}</span>
                          {mod.releaseDate && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-gray-800 text-slate-500">
                              📅 Available: {mod.releaseDate}
                            </span>
                          )}
                        </h3>
                        {mod.description && (
                          <p className="text-xs text-slate-400 mt-0.5">{mod.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActiveModuleForLesson(mod.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-[#0055FF] hover:bg-blue-100 transition-colors flex items-center gap-1"
                      >
                        + Add Recorded Lecture
                      </button>
                      <button
                        onClick={() => handleDeleteModule(mod.id)}
                        className="p-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete Module"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Lessons list inside this module */}
                  <div className="space-y-3 pl-2 sm:pl-4">
                    {(!mod.lessons || mod.lessons.length === 0) ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        No recorded lectures added in this module yet. Click &apos;+ Add Recorded Lecture&apos; to link a video.
                      </p>
                    ) : (
                      mod.lessons.map((les) => (
                        <div
                          key={les.id}
                          className="p-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)" }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              ▶
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm">{les.title}</h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0055FF]">
                                  ⏱️ {les.duration}
                                </span>
                                {les.recordedDate && (
                                  <span className="text-[10px] text-slate-400">
                                    Recorded: {les.recordedDate}
                                  </span>
                                )}
                              </div>
                              {les.videoUrl && (
                                <a
                                  href={les.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#0055FF] hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  🔗 Video Link: <span className="truncate max-w-xs">{les.videoUrl}</span>
                                </a>
                              )}
                              {les.notes && (
                                <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-mono">
                                  Notes: {les.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            <button
                              onClick={() => handleDeleteLesson(mod.id, les.id)}
                              className="text-xs text-rose-500 hover:text-rose-700 p-1 opacity-70 group-hover:opacity-100"
                              title="Delete lecture"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ================= TAB 2: LIVE CLASS SCHEDULER ================= */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
            <div>
              <h2 className="heading-font text-lg font-bold">Live Classes & Online Sessions</h2>
              <p className="text-xs text-slate-500">
                Schedule live classes with interactive video rooms. Enrolled students will get countdown alerts to join!
              </p>
            </div>
            <button
              onClick={() => setShowAddLive(true)}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 bg-rose-600 hover:bg-rose-700"
            >
              + Schedule Live Class
            </button>
          </div>

          {liveSessions.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-gray-800">
              <span className="text-4xl mb-3 block">🔴</span>
              <h3 className="heading-font text-lg font-bold mb-1">No Live Classes Scheduled</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Schedule a live Q&A, project walkthrough, or doubt session. Students will see a countdown in their portal and both teacher and students can join with 1 click.
              </p>
              <button
                onClick={() => setShowAddLive(true)}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold"
              >
                + Schedule Live Class Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {liveSessions.map((session) => {
                const sessionDate = new Date(session.scheduledAt);
                const isLiveNow = session.status === "LIVE_NOW";
                const isCompleted = session.status === "COMPLETED";

                return (
                  <div
                    key={session.id}
                    className="p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
                    style={{
                      background: "var(--bg-card)",
                      border: isLiveNow ? "2px solid #ef4444" : "1px solid var(--border-soft)"
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isLiveNow ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white flex items-center gap-1.5 animate-pulse shadow-md shadow-rose-500/30">
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                            LIVE NOW
                          </span>
                        ) : isCompleted ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                            ✓ Completed
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0055FF]">
                            🕒 Scheduled
                          </span>
                        )}

                        <span className="text-xs font-bold text-slate-500">
                          ⏱️ {session.duration} mins
                        </span>
                      </div>

                      <h3 className="heading-font text-xl font-bold text-slate-900 dark:text-white">
                        {session.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          📅 {isNaN(sessionDate.getTime()) ? session.scheduledAt : sessionDate.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                        {session.description && (
                          <span className="italic">{session.description}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {/* Teacher Join Live Class Button */}
                      <a
                        href={session.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-white shadow-md transition-transform hover:scale-105 ${
                          isLiveNow ? "bg-rose-600 hover:bg-rose-700" : "bg-[#0055FF] hover:bg-blue-700"
                        }`}
                      >
                        <span>🎥 Start / Join Live Room ↗</span>
                      </a>

                      {/* Status Toggle Buttons */}
                      <select
                        value={session.status}
                        onChange={(e) => updateSessionStatus(session.id, e.target.value as any)}
                        className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="LIVE_NOW">🔴 Set Live Now</option>
                        <option value="COMPLETED">Completed</option>
                      </select>

                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="p-2 text-xs text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Delete Session"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD MODULE */}
      {showAddModule && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-slate-200 dark:border-gray-800 space-y-4">
            <h3 className="heading-font text-lg font-bold">Add New Course Module / Day</h3>
            <p className="text-xs text-slate-500">
              You can create advance modules scheduled for tomorrow or upcoming days.
            </p>

            <form onSubmit={handleAddModule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Module Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Day 2: React State & Hooks or Module 3: Database"
                  value={newModTitle}
                  onChange={(e) => setNewModTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Release / Available Date (Advance Scheduling)
                </label>
                <input
                  type="date"
                  value={newModDate}
                  onChange={(e) => setNewModDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description / Overview
                </label>
                <textarea
                  rows={2}
                  placeholder="What will students learn in this module?"
                  value={newModDesc}
                  onChange={(e) => setNewModDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModule(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Add Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RECORDED LECTURE */}
      {activeModuleForLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-slate-200 dark:border-gray-800 space-y-4">
            <h3 className="heading-font text-lg font-bold">Add Recorded Lecture to Module</h3>
            <p className="text-xs text-slate-500">
              Upload previous days&apos; recordings or add video links (YouTube, Vimeo, MP4, Loom, Drive).
            </p>

            <form onSubmit={handleAddLesson} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lecture / Class Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Day 1: Setup & Architecture - Full Recording"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Video URL (YouTube, Vimeo, Loom, or MP4 URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                  value={newLessonVideoUrl}
                  onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (e.g. 50 mins)
                  </label>
                  <input
                    type="text"
                    value={newLessonDuration}
                    onChange={(e) => setNewLessonDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Recorded Date
                  </label>
                  <input
                    type="date"
                    value={newLessonDate}
                    onChange={(e) => setNewLessonDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lesson Notes & Code Links (Markdown/Text)
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of topics covered, GitHub repository links, or resources..."
                  value={newLessonNotes}
                  onChange={(e) => setNewLessonNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModuleForLesson(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Add Recorded Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE LIVE CLASS */}
      {showAddLive && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-slate-200 dark:border-gray-800 space-y-4">
            <h3 className="heading-font text-lg font-bold flex items-center gap-2">
              <span className="text-rose-500">🔴</span> Schedule Live Class
            </h3>
            <p className="text-xs text-slate-500">
              Set the class date & time. Enrolled students will receive countdown notifications to join the class!
            </p>

            <form onSubmit={handleAddLiveSession} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Live Class Topic / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Day 3: Live Code Review & Doubt Solving"
                  value={newLiveTitle}
                  onChange={(e) => setNewLiveTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newLiveDateTime}
                    onChange={(e) => setNewLiveDateTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={newLiveDuration}
                    onChange={(e) => setNewLiveDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Room Link (Optional — auto-generated if blank)
                </label>
                <input
                  type="url"
                  placeholder="Leave blank for automatic Jitsi Live room or paste Google Meet/Zoom"
                  value={newLiveMeetingUrl}
                  onChange={(e) => setNewLiveMeetingUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  If left empty, an instant live video room with webcam & screen share will be automatically created.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Agenda / Description for Students
                </label>
                <textarea
                  rows={2}
                  placeholder="Topics to discuss, homework review, etc."
                  value={newLiveDesc}
                  onChange={(e) => setNewLiveDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLive(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700"
                >
                  Schedule Live Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
