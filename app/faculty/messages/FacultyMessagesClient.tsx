"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatComposer from "@/components/chat/ChatComposer";
import { chatPreview, mergeInboxThreads, type ChatAttachment } from "@/lib/chatAttachments";

export type FacultyThread = {
  id: string;
  threadKey?: string;
  name: string;
  subtitle: string;
  type: "admin" | "student";
  image?: string | null;
  messages: {
    id: string;
    senderRole: string;
    text: string;
    attachments?: ChatAttachment[];
    createdAt: string;
  }[];
};

function latestThreadId(threads: FacultyThread[], fallback: string) {
  let best = fallback;
  let bestTime = 0;
  for (const thread of threads) {
    if (thread.type !== "student" || !thread.messages.length) continue;
    const last = thread.messages[thread.messages.length - 1];
    const time = new Date(last.createdAt).getTime();
    if (time >= bestTime) {
      bestTime = time;
      best = thread.id;
    }
  }
  return best;
}

export default function FacultyMessagesClient({ initialThreads }: { initialThreads: FacultyThread[] }) {
  const searchParams = useSearchParams();
  const chatWith = searchParams.get("student") || searchParams.get("chatWith");
  const [threads, setThreads] = useState(initialThreads);
  const [activeId, setActiveId] = useState(
    chatWith || latestThreadId(initialThreads, initialThreads[0]?.id || "jcrm-admin")
  );
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = threads.find((t) => t.id === activeId) || threads[0];

  const loadThreads = (selectLatest = false) => {
    fetch("/api/faculty/messages")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.threads?.length) return;
        setThreads((prev) => mergeInboxThreads(prev, data.threads));
        if (chatWith && data.threads.some((t: FacultyThread) => t.id === chatWith)) {
          setActiveId(chatWith);
        } else if (selectLatest) {
          setActiveId((current) => latestThreadId(data.threads, current));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadThreads(true);
    const timer = window.setInterval(() => loadThreads(false), 4000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatWith]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages?.length, activeId]);

  const send = async (trimmed: string, attachments: ChatAttachment[]) => {
    if (!active) return;
    setSending(true);
    const optimistic = {
      id: `tmp-${Date.now()}`,
      senderRole: "instructor",
      text: trimmed,
      attachments,
      createdAt: new Date().toISOString(),
    };
    setThreads((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, messages: [...t.messages, optimistic] } : t))
    );

    try {
      const res = await fetch("/api/faculty/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: active.id,
          threadKey: active.threadKey,
          text: trimmed,
          attachments,
        }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setThreads((prev) =>
          prev.map((t) =>
            t.id === active.id
              ? { ...t, messages: t.messages.map((m) => (m.id === optimistic.id ? data.message : m)) }
              : t
          )
        );
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-full min-h-[540px] lg:min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3">
        <aside className="lg:w-[260px] xl:w-[280px] shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col min-h-0 max-h-48 lg:max-h-none lg:h-full overflow-hidden">
          <div className="px-3 py-2.5 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
            Conversations
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {threads.map((thread) => {
              const last = thread.messages[thread.messages.length - 1];
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveId(thread.id)}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 border-b border-slate-50 ${
                    activeId === thread.id ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  {thread.image ? (
                    <img src={thread.image} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        thread.type === "admin" ? "bg-[#0055FF] text-white" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {thread.name[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{thread.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {chatPreview(last?.text || "", last?.attachments) || thread.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex-1 min-w-0 min-h-0 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[58vh] lg:h-full overflow-hidden">
          {active ? (
            <>
              <div className="px-4 py-3 border-b border-slate-100 shrink-0">
                <h2 className="font-extrabold text-sm text-slate-900 truncate">{active.name}</h2>
                <p className="text-[11px] text-slate-500 truncate">{active.subtitle}</p>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3">
                {active.messages.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-12">
                    {active.type === "admin"
                      ? "Chat with JCRM admin about courses, payouts, or account issues."
                      : "This student bought your course. Reply to their doubts here."}
                  </p>
                )}
                {active.messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    mine={message.senderRole === "instructor"}
                    text={message.text}
                    attachments={message.attachments}
                  />
                ))}
                <div ref={endRef} />
              </div>
              <div className="shrink-0">
                <ChatComposer
                  placeholder={active.type === "admin" ? "Reply to JCRM admin..." : "Reply to student..."}
                  sending={sending}
                  onSend={send}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 text-center m-auto">Select a conversation to start chatting.</p>
          )}
        </section>
      </div>
    </div>
  );
}
