export type ChatAttachmentKind = "image" | "pdf" | "audio";

export type ChatAttachment = {
  kind: ChatAttachmentKind;
  name: string;
  url: string;
};

export type ChatPayload = {
  text: string;
  attachments: ChatAttachment[];
};

const KINDS = new Set<ChatAttachmentKind>(["image", "pdf", "audio"]);

export function kindFromFile(file: { type?: string; name?: string }): ChatAttachmentKind | null {
  const mime = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  if (mime.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/.test(name)) return "image";
  if (mime === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (mime.startsWith("audio/") || /\.(mp3|wav|ogg|webm|m4a|aac)$/.test(name)) return "audio";
  return null;
}

export function sanitizeAttachments(input: unknown): ChatAttachment[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 5).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const raw = item as Record<string, unknown>;
    const kind = String(raw.kind || "") as ChatAttachmentKind;
    const name = String(raw.name || "file").replace(/[^\w.\- ()]/g, "").slice(0, 80) || "file";
    const url = String(raw.url || "");
    const safeUrl =
      url.startsWith("/uploads/chat/") ||
      url.startsWith("data:image/") ||
      url.startsWith("data:application/pdf") ||
      url.startsWith("data:audio/");
    if (!KINDS.has(kind) || !safeUrl) return [];
    return [{ kind, name, url }];
  });
}

export function parseChatPayload(raw: string): ChatPayload {
  const value = String(raw || "");
  if (value.startsWith("{")) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && (parsed.t !== undefined || parsed.a)) {
        return {
          text: String(parsed.t || ""),
          attachments: sanitizeAttachments(parsed.a),
        };
      }
    } catch {
      // plain text that happened to start with {
    }
  }
  return { text: value, attachments: [] };
}

export function serializeChatPayload(text: string, attachments: ChatAttachment[] = []) {
  const clean = sanitizeAttachments(attachments);
  if (!clean.length) return text;
  return JSON.stringify({ t: text, a: clean });
}

export function chatPreview(text: string, attachments: ChatAttachment[] = []) {
  if (text.trim()) return text.trim();
  const kind = attachments[0]?.kind;
  if (kind === "image") return "Photo";
  if (kind === "pdf") return "PDF";
  if (kind === "audio") return "Audio";
  return "";
}

export function mergeInboxThreads<T extends { id: string; threadKey?: string; messages: { id: string; text?: string; createdAt: string }[] }>(
  local: T[],
  remote: T[]
): T[] {
  return remote.map((incoming) => {
    const existing = local.find((thread) => thread.id === incoming.id || thread.threadKey === incoming.threadKey);
    const localMsgs = existing?.messages || [];
    const remoteMsgs = incoming.messages || [];
    if (!remoteMsgs.length && localMsgs.length) {
      return { ...incoming, messages: localMsgs };
    }
    const byId = new Map(remoteMsgs.map((msg) => [msg.id, msg]));
    for (const msg of localMsgs) {
      const pending =
        String(msg.id).startsWith("tmp-") &&
        !remoteMsgs.some((remote) => remote.text === msg.text);
      if (pending || !byId.has(msg.id)) byId.set(msg.id, msg);
    }
    return {
      ...incoming,
      messages: Array.from(byId.values()).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    };
  });
}

export function toClientMessage(message: {
  id: string;
  senderRole: string;
  text: string;
  createdAt: Date | string;
  attachments?: ChatAttachment[];
}) {
  const parsed = message.attachments?.length
    ? { text: message.text, attachments: message.attachments }
    : parseChatPayload(message.text);
  return {
    id: message.id,
    senderRole: message.senderRole,
    text: parsed.text,
    attachments: parsed.attachments,
    createdAt: typeof message.createdAt === "string" ? message.createdAt : message.createdAt.toISOString(),
  };
}
