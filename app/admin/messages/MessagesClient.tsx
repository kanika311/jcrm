"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Instructor {
  id: string;
  fullName: string | null;
  name: string | null;
  email: string;
}

interface Message {
  sender: "admin" | "instructor";
  text: string;
  time: string;
}

interface Chat {
  id: string;
  name: string;
  email: string;
  messages: Message[];
  unread: number;
}

function MessagesClientInner({ instructors }: { instructors: Instructor[] }) {
  const searchParams = useSearchParams();
  const chatWith = searchParams.get("chatWith");
  const prefill = searchParams.get("prefill");

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize chats
  useEffect(() => {
    const initialChats: Chat[] = instructors.map((inst, index) => {
      const name = inst.fullName || inst.name || "Instructor";
      return {
        id: inst.id,
        name,
        email: inst.email,
        unread: inst.id === chatWith ? 0 : (index === 0 ? 2 : 0),
        messages: [
          {
            sender: "instructor",
            text: `Hello Admin, this is ${name}. Please let me know if you have any feedback on my courses!`,
            time: "Yesterday",
          },
        ],
      };
    });

    setChats(initialChats);

    // If chatWith query param is set, make it active; otherwise default to first
    if (chatWith && instructors.some((i) => i.id === chatWith)) {
      setActiveChatId(chatWith);
    } else if (initialChats.length > 0) {
      setActiveChatId(initialChats[0].id);
    }
  }, [instructors, chatWith]);

  // Set prefill text and focus input
  useEffect(() => {
    if (prefill) {
      setInputText(prefill);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [prefill, activeChatId]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId]);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const newMessage: Message = {
      sender: "admin",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, newMessage] }
          : c
      )
    );
    setInputText("");

    // Simulate instructor reply after 1.5 seconds
    setTimeout(() => {
      const replyMessage: Message = {
        sender: "instructor",
        text: `Understood, Admin. I will review the changes and submit the updates for approval shortly.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, messages: [...c.messages, replyMessage] }
            : c
        )
      );
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-20" style={{ height: "calc(100vh - 180px)" }}>
      {/* Sidebar - Instructors list */}
      <div className="w-full lg:w-96 flex flex-col min-h-0 rounded-[24px]" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
        <div className="p-6 border-b" style={{ borderColor: "var(--border-soft)" }}>
          <h2 className="heading-font text-2xl font-bold mb-4">Faculty Chats</h2>
          <input
            type="text"
            placeholder="Search instructors..."
            className="input-premium w-full px-4 py-2 text-sm rounded-lg"
          />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                // Clear unread
                setChats((prev) =>
                  prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
                );
              }}
              className={`p-4 border-b flex items-center gap-4 cursor-pointer transition-colors ${
                activeChatId === chat.id ? "bg-[var(--bg-surface)]" : "hover:bg-black/5 dark:hover:bg-surf-elevated"
              }`}
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                {chat.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm truncate">{chat.name}</h4>
                  <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
                    {chat.messages[chat.messages.length - 1]?.time || "Now"}
                  </span>
                </div>
                <p className={`text-xs truncate ${chat.unread > 0 ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                  {chat.messages[chat.messages.length - 1]?.text || "No messages yet"}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-txt-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
          {chats.length === 0 && (
            <div className="p-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
              No instructors available to chat.
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 rounded-[24px] overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-6 border-b flex items-center gap-4" style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                {activeChat.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold">{activeChat.name}</h3>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{activeChat.email} • Faculty</p>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {activeChat.messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "instructor" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
                      {activeChat.name.charAt(0)}
                    </div>
                  )}
                  <div className="max-w-[70%] flex flex-col">
                    <div
                      className={`p-4 rounded-2xl text-sm ${
                        msg.sender === "admin"
                          ? "rounded-tr-none text-txt-primary"
                          : "rounded-tl-none"
                      }`}
                      style={{
                        background: msg.sender === "admin" ? "var(--accent-primary)" : "var(--bg-surface)",
                        border: msg.sender === "admin" ? "none" : "1px solid var(--border-soft)",
                      }}
                    >
                      {msg.text}
                    </div>
                    <div className={`text-[10px] mt-1 font-semibold ${msg.sender === "admin" ? "text-right" : ""}`} style={{ color: "var(--text-tertiary)" }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t" style={{ borderColor: "var(--border-soft)" }}>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type feedback or message..."
                  className="w-full bg-black/5 dark:bg-surf-elevated py-3 pl-4 pr-12 rounded-xl focus:outline-none focus:ring-2 ring-[var(--accent-primary)] text-sm"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--accent-primary)] hover:text-[var(--accent-light)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <svg className="w-16 h-16 text-[var(--text-tertiary)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="font-bold text-lg mb-2">No Active Chat</h3>
            <p className="max-w-xs text-sm" style={{ color: "var(--text-secondary)" }}>
              Select a faculty member from the list to start discussing course updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesClient({ instructors }: { instructors: Instructor[] }) {
  return (
    <Suspense fallback={<div>Loading chats...</div>}>
      <MessagesClientInner instructors={instructors} />
    </Suspense>
  );
}
