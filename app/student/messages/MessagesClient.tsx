"use client";

import { useEffect, useRef, useState } from "react";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatComposer from "@/components/chat/ChatComposer";
import { chatPreview, mergeInboxThreads, type ChatAttachment } from "@/lib/chatAttachments";

export type InboxThread = {
  id: string;
  threadKey?: string;
  name: string;
  subtitle: string;
  type: "support" | "instructor";
  image?: string | null;
  messages: {
    id: string;
    senderRole: string;
    text: string;
    attachments?: ChatAttachment[];
    createdAt: string;
  }[];
};

export default function MessagesClient({
  cmsData,
  initialThreads,
}: {
  cmsData: any;
  initialThreads: InboxThread[];
}) {
  const [threads, setThreads] = useState(initialThreads);
  const [activeId, setActiveId] = useState(initialThreads[0]?.id || "jcrm-support");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = threads.find((t) => t.id === activeId) || threads[0];

  useEffect(() => {
    const load = () => {
      fetch("/api/student/messages")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.threads?.length) {
            setThreads((prev) => mergeInboxThreads(prev, data.threads));
          }
        })
        .catch(() => {});
    };
    load();
    const timer = window.setInterval(load, 4000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages?.length, activeId]);

  const send = async (trimmed: string, attachments: ChatAttachment[]) => {
    if (!active) return;
    setSending(true);
    const optimistic = {
      id: `tmp-${Date.now()}`,
      senderRole: "student",
      text: trimmed,
      attachments,
      createdAt: new Date().toISOString(),
    };
    setThreads((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, messages: [...t.messages, optimistic] } : t))
    );

    try {
      const res = await fetch("/api/student/messages", {
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
    } catch {
      // keep optimistic message
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">{cmsData?.heading || "Inbox"}</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          JCRM Admin is always here. Course instructors appear after you purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[560px]">
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 text-xs font-black uppercase tracking-wider text-slate-400">
            Conversations
          </div>
          <div className="divide-y divide-slate-100">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => setActiveId(thread.id)}
                className={`w-full text-left px-4 py-3.5 flex items-center gap-3 ${
                  activeId === thread.id ? "bg-blue-50" : "hover:bg-slate-50"
                }`}
              >
                {thread.image ? (
                  <img src={thread.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${
                      thread.type === "support" ? "bg-[#0055FF] text-white" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {thread.type === "support" ? "A" : thread.name[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{thread.name}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {chatPreview(
                      thread.messages[thread.messages.length - 1]?.text || "",
                      thread.messages[thread.messages.length - 1]?.attachments
                    ) || thread.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
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
                  <p className="text-sm text-slate-500 text-center py-12">
                    {active.type === "support"
                      ? "JCRM Admin is always available. Send a message about payments, access, or your account."
                      : "This is your instructor for a purchased course. Ask about lessons, assignments, or class support."}
                  </p>
                )}
                {active.messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    mine={message.senderRole === "student"}
                    text={message.text}
                    attachments={message.attachments}
                  />
                ))}
                <div ref={endRef} />
              </div>

              <ChatComposer
                placeholder={active.type === "support" ? "Message JCRM Admin..." : "Message your instructor..."}
                sending={sending}
                onSend={send}
              />
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
