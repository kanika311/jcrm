"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  scheduledAt: string;
  duration: number;
  meetingUrl: string;
  description?: string;
  status: "SCHEDULED" | "LIVE_NOW" | "COMPLETED";
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  image?: string;
  curriculum?: {
    modules?: Module[];
    liveSessions?: LiveSession[];
  };
}

export default function ClassroomClient({
  initialCourseId,
  enrolledCourses,
}: {
  initialCourseId?: string;
  enrolledCourses: { id: string; title: string }[];
}) {
  const searchParams = useSearchParams();
  const queryCourseId = searchParams.get("courseId") || initialCourseId || enrolledCourses[0]?.id;

  const [courseId, setCourseId] = useState<string>(queryCourseId || "");
  const [course, setCourse] = useState<CourseData | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/student/classroom/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.course) {
          setCourse(data.course);
          const curr = data.course.curriculum || {};
          const loadedMods = curr.modules || [];
          setModules(loadedMods);
          setLiveSessions(curr.liveSessions || []);

          // Auto-select first lesson if available
          if (loadedMods.length > 0 && loadedMods[0].lessons?.length > 0) {
            setActiveLesson(loadedMods[0].lessons[0]);
          }

          // Expand all modules by default
          const exp: Record<string, boolean> = {};
          loadedMods.forEach((m: Module) => {
            exp[m.id] = true;
          });
          setExpandedModules(exp);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [courseId]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  // Check for upcoming or live class
  const activeOrUpcomingLive = liveSessions.find(
    (s) => s.status === "LIVE_NOW" || s.status === "SCHEDULED"
  );

  // Helper to format countdown
  const getCountdownText = (scheduledAt: string) => {
    const diff = new Date(scheduledAt).getTime() - Date.now();
    if (diff <= 0) return "Class Starting Now!";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `Starts in ${days} day${days > 1 ? "s" : ""}`;
    }
    if (hours > 0) {
      return `Starts in ${hours} hr ${mins} min`;
    }
    return `Starts in ${mins} minutes`;
  };

  // Video embed helper
  const renderVideoPlayer = (url: string) => {
    if (!url) {
      return (
        <div className="w-full aspect-video rounded-2xl bg-black flex flex-col items-center justify-center text-slate-400 p-6">
          <span className="text-4xl mb-2">📹</span>
          <p className="text-sm font-semibold">No video URL linked for this lecture yet.</p>
        </div>
      );
    }

    // YouTube embed
    let youtubeId = "";
    if (url.includes("youtube.com/watch?v=")) {
      youtubeId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      youtubeId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/embed/")) {
      youtubeId = url.split("embed/")[1]?.split("?")[0];
    }

    if (youtubeId) {
      return (
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
            title={activeLesson?.title || "Video Player"}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // Vimeo embed
    if (url.includes("vimeo.com/")) {
      const vimeoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return (
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title={activeLesson?.title || "Video Player"}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // Direct MP4 or default video
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
        <video
          src={url}
          controls
          className="w-full h-full"
          poster={course?.image || ""}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  if (enrolledCourses.length === 0) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto rounded-3xl mt-12" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
        <span className="text-5xl block mb-4">🎓</span>
        <h2 className="heading-font text-2xl font-bold mb-2">You Have Not Enrolled in Any Courses Yet</h2>
        <p className="text-slate-500 mb-6">Browse our available tech courses and enroll to access live classrooms and recorded lectures.</p>
        <Link href="/courses" className="btn-primary px-6 py-3 rounded-xl font-bold inline-block">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Bar with Course Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: "var(--border-soft)" }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
            <Link href="/student/courses" className="hover:text-[var(--accent-primary)]">My Courses</Link>
            <span>/</span>
            <span>Classroom & Lectures</span>
          </div>
          <h1 className="heading-font text-2xl font-bold">{course?.title || "Classroom"}</h1>
          <p className="text-xs text-slate-500">Instructor: {course?.instructor || "JCRM Faculty"}</p>
        </div>

        {enrolledCourses.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Course:</span>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              {enrolledCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* LIVE CLASS NOTIFICATION BANNER */}
      {activeOrUpcomingLive && (
        <div
          className={`p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg ${
            activeOrUpcomingLive.status === "LIVE_NOW"
              ? "bg-gradient-to-r from-rose-500 to-red-600 text-white"
              : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/20">
                  {activeOrUpcomingLive.status === "LIVE_NOW" ? "🔴 Live Now" : "🕒 Upcoming Live Class"}
                </span>
                <span className="text-xs font-bold opacity-90">
                  {activeOrUpcomingLive.status === "LIVE_NOW"
                    ? "Interactive Session In Progress"
                    : getCountdownText(activeOrUpcomingLive.scheduledAt)}
                </span>
              </div>
              <h3 className="heading-font text-lg font-bold mt-0.5">{activeOrUpcomingLive.title}</h3>
              {activeOrUpcomingLive.description && (
                <p className="text-xs opacity-80 line-clamp-1">{activeOrUpcomingLive.description}</p>
              )}
            </div>
          </div>

          <a
            href={activeOrUpcomingLive.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl font-extrabold text-xs bg-white text-slate-900 hover:bg-slate-100 transition-transform hover:scale-105 shrink-0 text-center shadow"
          >
            🎥 Join Live Class Now ↗
          </a>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-[#0055FF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold">Loading classroom lectures...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column: Video Player & Lecture Notes (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeLesson ? (
              <>
                {renderVideoPlayer(activeLesson.videoUrl)}

                <div
                  className="p-6 rounded-2xl space-y-4"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-gray-800">
                    <div>
                      <span className="text-xs font-bold text-[#0055FF] block mb-1">
                        ⏱️ Duration: {activeLesson.duration}
                      </span>
                      <h2 className="heading-font text-2xl font-bold">{activeLesson.title}</h2>
                      {activeLesson.recordedDate && (
                        <p className="text-xs text-slate-400 mt-1">
                          Recorded Date: {activeLesson.recordedDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {activeLesson.notes ? (
                    <div>
                      <h3 className="heading-font text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Lecture Notes & Resources
                      </h3>
                      <div className="p-4 rounded-xl text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-sans whitespace-pre-line" style={{ background: "var(--bg-surface)" }}>
                        {activeLesson.notes}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes attached for this lecture.</p>
                  )}
                </div>
              </>
            ) : (
              <div
                className="p-12 rounded-2xl text-center space-y-3"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
              >
                <span className="text-4xl block">🎬</span>
                <h3 className="heading-font text-xl font-bold">No Recorded Lectures Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  The instructor is currently preparing curriculum modules and recorded classes. Check back soon or join upcoming live sessions!
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Curriculum Modules & Recorded Lessons (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className="p-4 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
            >
              <h3 className="heading-font text-base font-bold mb-3 flex items-center justify-between">
                <span>Course Modules</span>
                <span className="text-xs text-slate-400 font-semibold">{modules.length} Modules</span>
              </h3>

              {modules.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  Curriculum under preparation by faculty.
                </p>
              ) : (
                <div className="space-y-3">
                  {modules.map((mod, mIndex) => {
                    const isExpanded = !!expandedModules[mod.id];
                    const isUpcoming = mod.releaseDate && new Date(mod.releaseDate) > new Date();

                    return (
                      <div
                        key={mod.id}
                        className="rounded-xl overflow-hidden border border-slate-200 dark:border-gray-800"
                      >
                        <button
                          type="button"
                          onClick={() => toggleModule(mod.id)}
                          className="w-full p-3.5 flex items-center justify-between text-left transition-colors hover:bg-slate-50 dark:hover:bg-gray-800/50"
                          style={{ background: "var(--bg-surface)" }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#0055FF]/10 text-[#0055FF] text-[11px] font-bold flex items-center justify-center shrink-0">
                              {mIndex + 1}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                {mod.title}
                              </h4>
                              {isUpcoming ? (
                                <span className="text-[10px] text-amber-500 font-bold block">
                                  📅 Available on: {mod.releaseDate}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 block">
                                  {mod.lessons?.length || 0} lecture{mod.lessons?.length === 1 ? "" : "s"}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="p-2 space-y-1 bg-white dark:bg-gray-900">
                            {(!mod.lessons || mod.lessons.length === 0) ? (
                              <p className="text-[11px] text-slate-400 p-2 italic">
                                No lectures added yet.
                              </p>
                            ) : (
                              mod.lessons.map((les) => {
                                const isSelected = activeLesson?.id === les.id;
                                return (
                                  <button
                                    key={les.id}
                                    type="button"
                                    onClick={() => setActiveLesson(les)}
                                    className={`w-full p-2.5 rounded-lg text-left text-xs font-medium flex items-center justify-between gap-2 transition-all ${
                                      isSelected
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-[#0055FF] font-bold"
                                        : "hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-600 dark:text-slate-300"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <span className="text-xs shrink-0">▶</span>
                                      <span className="truncate">{les.title}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                      {les.duration}
                                    </span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Live Link */}
            <div
              className="p-4 rounded-2xl flex items-center justify-between gap-3"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Live Classes & Cohort</h4>
                <p className="text-[11px] text-slate-400">View live schedule and past recordings</p>
              </div>
              <Link
                href="/student/live"
                className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold shrink-0"
              >
                Go to Live →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
