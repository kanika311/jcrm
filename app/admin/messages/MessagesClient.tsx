"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatComposer from "@/components/chat/ChatComposer";
import { chatPreview, mergeInboxThreads, type ChatAttachment } from "@/lib/chatAttachments";

interface Instructor {
  id: string;
  fullName: string | null;
  name: string | null;
  email: string;
}

type Thread = {
  id: string;
  threadKey?: string;
  name: string;
  subtitle: string;
  type: "instructor" | "student" | "course";
  image?: string | null;
  unread?: number;
  messages: {
    id: string;
    senderRole: string;
    text: string;
    attachments?: ChatAttachment[];
    createdAt: string;
  }[];
};

function notifyUnread(count: number) {
  window.dispatchEvent(new CustomEvent("jcrm-admin-unread", { detail: count }));
}

function MessagesClientInner({ instructors }: { instructors: Instructor[] }) {
  const searchParams = useSearchParams();
  const chatWith = searchParams.get("chatWith");

  const starter: Thread[] = instructors.map((inst) => ({
    id: `admin-faculty:${inst.id}`,
    threadKey: `admin-faculty:${inst.id}`,
    name: inst.fullName || inst.name || inst.email,
    subtitle: "Instructor · JCRM Admin chat",
    type: "instructor",
    messages: [],
  }));

  const [threads, setThreads] = useState(starter);
  const [activeId, setActiveId] = useState(chatWith || starter[0]?.id || "");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const active = threads.find((t) => t.id === activeId || t.threadKey === activeId) || threads[0];

  const loadThreads = (preferLatest = false) => {
    fetch("/api/admin/messages")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.threads?.length) return;
        setThreads((prev) => mergeInboxThreads(prev, data.threads));
        if (typeof data.unread === "number") notifyUnread(data.unread);
        if (chatWith && data.threads.some((t: Thread) => t.id === chatWith || t.threadKey === chatWith)) {
          setActiveId(chatWith);
        } else if (preferLatest) {
          const latest = data.threads.find((t: Thread) => (t.unread || 0) > 0) || data.threads.find((t: Thread) => t.messages.length);
          if (latest) setActiveId(latest.id);
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
    if (!active?.threadKey) return;
    if (!(active.unread || 0)) return;
    fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadKey: active.threadKey }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.unread === "number") notifyUnread(data.unread);
        setThreads((prev) => prev.map((t) => (t.id === active.id ? { ...t, unread: 0 } : t)));
      })
      .catch(() => {});
  }, [active?.id, active?.threadKey, active?.unread]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages?.length, activeId]);

  const send = async (trimmed: string, attachments: ChatAttachment[]) => {
    if (!active) return;
    setSending(true);
    const optimistic = {
      id: `tmp-${Date.now()}`,
      senderRole: active.type === "student" ? "support" : "admin",
      text: trimmed,
      attachments,
      createdAt: new Date().toISOString(),
    };
    setThreads((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, messages: [...t.messages, optimistic] } : t))
    );
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: active.id,
          threadKey: active.threadKey,
          type: active.type,
          text: trimmed,
          attachments,
        }),
      });
      const data = await res.json();
      if (typeof data.unread === "number") notifyUnread(data.unread);
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
    <div className="pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Messages</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Every student and instructor chat with JCRM Admin lands here.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[560px]">
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 text-xs font-black uppercase tracking-wider text-slate-400">
            Conversations
          </div>
          {threads.map((thread) => {
            const last = thread.messages[thread.messages.length - 1];
            const selected = activeId === thread.id || activeId === thread.threadKey;
            return (
              <button
                key={thread.threadKey || thread.id}
                type="button"
                onClick={() => setActiveId(thread.id)}
                className={`w-full text-left px-4 py-3.5 flex items-center gap-3 border-b border-slate-50 ${
                  selected ? "bg-blue-50" : "hover:bg-slate-50"
                }`}
              >
                {thread.image ? (
                  <img src={thread.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${
                      thread.type === "instructor" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-[#0055FF]"
                    }`}
                  >
                    {thread.name[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 truncate">{thread.name}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {chatPreview(last?.text || "", last?.attachments) || thread.subtitle}
                  </div>
                </div>
                {(thread.unread || 0) > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                    {thread.unread}
                  </span>
                )}
              </button>
            );
          })}
        </aside>
        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col min-h-[560px]">
          {active ? (
            <>
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-extrabold text-slate-900">{active.name}</h2>
                <p className="text-xs text-slate-500">{active.subtitle}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {active.messages.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-12">No messages yet. Start the conversation.</p>
                )}
                {active.messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    mine={message.senderRole === "admin" || message.senderRole === "support"}
                    text={message.text}
                    attachments={message.attachments}
                  />
                ))}
                <div ref={endRef} />
              </div>
              <ChatComposer placeholder="Type a reply..." sending={sending} onSend={send} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
              No conversations yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function MessagesClient({ instructors }: { instructors: Instructor[] }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading chats...</div>}>
      <MessagesClientInner instructors={instructors} />
    </Suspense>
  );
}
