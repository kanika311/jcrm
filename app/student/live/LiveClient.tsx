"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LiveSession {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  meetingUrl: string;
  description?: string;
  status: "SCHEDULED" | "LIVE_NOW" | "COMPLETED";
  courseId: string;
  courseTitle: string;
  instructor?: string;
  courseImage?: string;
}

interface PastRecording {
  id: string;
  title: string;
  moduleTitle: string;
  courseId: string;
  courseTitle: string;
  duration: string;
  videoUrl: string;
  notes?: string;
  date?: string;
  courseImage?: string;
}

export default function LiveClient() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [recordings, setRecordings] = useState<PastRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCount, setEnrolledCount] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());

  // Update clock every minute for live countdowns
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/student/live")
      .then((res) => res.json())
      .then((data) => {
        if (data.sessions) {
          setSessions(data.sessions);
          setRecordings(data.pastRecordings || []);
          setEnrolledCount(data.enrolledCoursesCount || 0);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Compute countdown text
  const getSessionStatus = (session: LiveSession) => {
    if (session.status === "LIVE_NOW") {
      return { isLive: true, text: "LIVE NOW" };
    }
    if (session.status === "COMPLETED") {
      return { isLive: false, text: "Completed" };
    }

    const start = new Date(session.scheduledAt).getTime();
    const durationMs = (session.duration || 60) * 60 * 1000;
    const end = start + durationMs;

    // If current time is within [start - 15m, end]
    if (now >= start - 15 * 60 * 1000 && now <= end) {
      return { isLive: true, text: "LIVE NOW" };
    }

    const diff = start - now;
    if (diff <= 0) {
      return { isLive: false, text: "Completed" };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { isLive: false, text: `Starts in ${days} day${days > 1 ? "s" : ""}` };
    }
    if (hours > 0) {
      return { isLive: false, text: `Starts in ${hours} hr ${mins} min` };
    }
    return { isLive: false, text: `Starts in ${mins} minutes` };
  };

  // Find active live session or closest upcoming
  const activeSession = sessions.find((s) => {
    const status = getSessionStatus(s);
    return status.isLive;
  }) || sessions.find((s) => {
    const start = new Date(s.scheduledAt).getTime();
    return start > now;
  });

  const otherUpcomingSessions = sessions.filter((s) => s.id !== activeSession?.id && new Date(s.scheduledAt).getTime() > now);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <div className="w-8 h-8 border-3 border-[#0055FF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold">Loading your live classes...</p>
      </div>
    );
  }

  if (enrolledCount === 0) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto rounded-3xl mt-12" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
        <span className="text-5xl block mb-4">🔴</span>
        <h2 className="heading-font text-2xl font-bold mb-2">No Enrolled Courses Found</h2>
        <p className="text-slate-500 mb-6">
          Live sessions and cohort doubt-clearing rooms are available for enrolled students. Browse courses to get started.
        </p>
        <Link href="/courses" className="btn-primary px-6 py-3 rounded-xl font-bold inline-block">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="heading-font text-3xl font-bold mb-2">Live Classes & Online Cohort</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Join live cohort sessions, interactive project reviews, and watch previous days&apos; recordings.
        </p>
      </div>

      {/* FEATURED / LIVE NOW HERO CARD */}
      {activeSession ? (
        (() => {
          const status = getSessionStatus(activeSession);
          const sessionDate = new Date(activeSession.scheduledAt);

          return (
            <div
              className="p-8 sm:p-10 rounded-[32px] relative overflow-hidden shadow-2xl transition-all"
              style={{
                background: status.isLive
                  ? "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)"
                  : "var(--bg-card)",
                border: status.isLive ? "2px solid #ef4444" : "1px solid var(--border-soft)",
              }}
            >
              {/* Glow effects */}
              <div
                className={`absolute top-0 right-0 w-80 h-80 blur-[100px] pointer-events-none opacity-40 ${
                  status.isLive ? "bg-rose-500" : "bg-blue-500"
                }`}
              ></div>

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    {status.isLive ? (
                      <span className="bg-rose-500 text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-500/40 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        Live Now
                      </span>
                    ) : (
                      <span className="bg-blue-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        🕒 {status.text}
                      </span>
                    )}

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white/90">
                      {activeSession.courseTitle}
                    </span>
                  </div>

                  <h2 className="heading-font text-2xl sm:text-4xl font-extrabold text-white">
                    {activeSession.title}
                  </h2>

                  {activeSession.description && (
                    <p className="text-sm sm:text-base text-slate-300">
                      {activeSession.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2">
                    <span className="flex items-center gap-1.5">
                      📅 {isNaN(sessionDate.getTime()) ? activeSession.scheduledAt : sessionDate.toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      ⏱️ {activeSession.duration} Minutes Session
                    </span>
                    <span className="flex items-center gap-1.5">
                      👨‍🏫 Instructor: {activeSession.instructor || "Faculty"}
                    </span>
                  </div>
                </div>

                {/* Big Join Button */}
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <a
                    href={activeSession.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-8 py-4 rounded-2xl text-base font-extrabold text-white shadow-2xl transition-all hover:scale-105 text-center flex items-center gap-2.5 ${
                      status.isLive
                        ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/40"
                        : "bg-[#0055FF] hover:bg-blue-700 shadow-blue-500/40"
                    }`}
                  >
                    <span>🎥 Join Live Class ↗</span>
                  </a>
                  <span className="text-[11px] text-slate-400">
                    Works in any browser with video, mic & chat
                  </span>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        <div
          className="p-10 rounded-3xl text-center space-y-3"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
        >
          <span className="text-4xl block">📅</span>
          <h3 className="heading-font text-xl font-bold">No Upcoming Live Classes Scheduled</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your instructor will schedule the next live doubt session soon. You can continue watching recorded lectures in your classroom in the meantime!
          </p>
          <Link
            href="/student/classroom"
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold inline-block"
          >
            Go to Classroom Lectures
          </Link>
        </div>
      )}

      {/* OTHER UPCOMING SESSIONS */}
      {otherUpcomingSessions.length > 0 && (
        <div className="space-y-4">
          <h3 className="heading-font text-xl font-bold">Upcoming Live Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherUpcomingSessions.map((session) => {
              const sessionDate = new Date(session.scheduledAt);
              const status = getSessionStatus(session);

              return (
                <div
                  key={session.id}
                  className="p-5 rounded-2xl flex flex-col justify-between gap-4 card-hover"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0055FF]">
                        {session.courseTitle}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {status.text}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {session.title}
                    </h4>

                    {session.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {session.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-800">
                    <span className="text-xs text-slate-400">
                      📅 {isNaN(sessionDate.getTime()) ? session.scheduledAt : sessionDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>

                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0055FF] text-white hover:bg-blue-700 transition-colors"
                    >
                      Join Session ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PAST RECORDINGS & PREVIOUS DAYS LECTURES */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="heading-font text-xl font-bold">Recorded Lectures & Past Classes</h3>
            <p className="text-xs text-slate-500">
              Catch up on previous days&apos; lectures uploaded by your instructors.
            </p>
          </div>
          <Link href="/student/classroom" className="text-xs font-bold text-[#0055FF] hover:underline">
            View All in Player →
          </Link>
        </div>

        {recordings.length === 0 ? (
          <div
            className="p-8 rounded-2xl text-center text-slate-400"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
          >
            <p className="text-xs">No recorded lectures uploaded for your enrolled courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl flex flex-col justify-between gap-3 card-hover group"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                    <span className="text-[#0055FF]">{rec.courseTitle}</span>
                    <span>⏱️ {rec.duration}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0055FF] transition-colors mb-1 line-clamp-2">
                    {rec.title}
                  </h4>

                  <p className="text-[11px] text-slate-400">
                    Module: {rec.moduleTitle}
                  </p>

                  {rec.date && (
                    <span className="text-[10px] text-slate-400 block mt-1">
                      📅 Date: {rec.date}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
                  <Link
                    href={`/student/classroom?courseId=${rec.courseId}`}
                    className="w-full text-center py-2 rounded-xl text-xs font-bold bg-blue-50 text-[#0055FF] hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>▶ Watch Recorded Class</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
