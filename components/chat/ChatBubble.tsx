"use client";

import type { ChatAttachment } from "@/lib/chatAttachments";

export default function ChatBubble({
  mine,
  text,
  attachments = [],
}: {
  mine: boolean;
  text: string;
  attachments?: ChatAttachment[];
}) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm space-y-2 ${
          mine ? "bg-[#0055FF] text-white" : "bg-slate-100 text-slate-800"
        }`}
      >
        {attachments.map((file) => (
          <div key={`${file.url}-${file.name}`}>
            {file.kind === "image" ? (
              <a href={file.url} target="_blank" rel="noreferrer">
                <img src={file.url} alt={file.name} className="max-h-52 rounded-xl object-cover" />
              </a>
            ) : file.kind === "audio" ? (
              <audio controls src={file.url} className="w-56 max-w-full" />
            ) : (
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 underline ${mine ? "text-white" : "text-[#0055FF]"}`}
              >
                PDF · {file.name}
              </a>
            )}
          </div>
        ))}
        {text ? <div>{text}</div> : null}
      </div>
    </div>
  );
}
