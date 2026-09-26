"use client";

import { useRef, useState } from "react";
import type { ChatAttachment } from "@/lib/chatAttachments";

export default function ChatComposer({
  placeholder,
  sending,
  onSend,
}: {
  placeholder: string;
  sending: boolean;
  onSend: (text: string, attachments: ChatAttachment[]) => Promise<void> | void;
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<ChatAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    setError("");
    setUploading(true);
    try {
      for (const file of Array.from(list).slice(0, 5 - files.length)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/chat/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok || !data.attachment) {
          setError(data.message || "Could not attach file");
          continue;
        }
        setFiles((prev) => [...prev, data.attachment]);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if ((!trimmed && !files.length) || sending || uploading) return;
    const outgoing = files;
    setText("");
    setFiles([]);
    await onSend(trimmed, outgoing);
  };

  return (
    <form onSubmit={submit} className="p-4 border-t border-slate-100 space-y-2">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <span
              key={`${file.url}-${file.name}`}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-700"
            >
              {file.kind === "image" ? "Photo" : file.kind === "pdf" ? "PDF" : "Audio"} · {file.name}
              <button type="button" onClick={() => setFiles((prev) => prev.filter((item) => item.url !== file.url))}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-rose-500">{error}</p>}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf,audio/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold"
          title="Attach photo, PDF, or audio"
        >
          +
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900"
        />
        <button
          type="submit"
          disabled={sending || uploading || (!text.trim() && !files.length)}
          className="px-5 py-3 rounded-xl bg-[#0055FF] text-white text-sm font-bold disabled:opacity-50"
        >
          {uploading ? "..." : "Send"}
        </button>
      </div>
      <p className="text-[11px] text-slate-400">Photo, PDF, or audio · up to 10MB</p>
    </form>
  );
}
