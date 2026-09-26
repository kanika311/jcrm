import { prisma } from "@/lib/prisma";
import { parseChatPayload, sanitizeAttachments, serializeChatPayload, type ChatAttachment } from "@/lib/chatAttachments";

export type DirectMsg = {
  id: string;
  threadKey: string;
  senderRole: string;
  senderId: string;
  text: string;
  attachments: ChatAttachment[];
  createdAt: Date | string;
};

const CHAT_PREFIX = "chat:";

export function supportThreadKey(studentId: string) {
  return `support:${studentId}`;
}

export function adminFacultyKey(facultyId: string) {
  return `admin-faculty:${facultyId}`;
}

export function instructorStudentKey(facultyId: string, studentId: string) {
  return `instructor:${facultyId}:${studentId}`;
}

function fromContact(row: {
  id: string;
  source: string | null;
  subject: string;
  lastName: string;
  message: string;
  createdAt: Date;
}): DirectMsg {
  const parsed = parseChatPayload(row.message);
  return {
    id: row.id,
    threadKey: (row.source || "").startsWith(CHAT_PREFIX) ? row.source!.slice(CHAT_PREFIX.length) : row.source || "",
    senderRole: row.subject,
    senderId: row.lastName || "",
    text: parsed.text,
    attachments: parsed.attachments,
    createdAt: row.createdAt,
  };
}

const ADMIN_INBOUND = ["student", "instructor"];
const ADMIN_THREAD_PREFIXES = ["chat:support:", "chat:admin-faculty:", "chat:instructor:"];

export async function countAdminUnread() {
  try {
    return await prisma.contactMessage.count({
      where: {
        status: "NEW",
        subject: { in: ADMIN_INBOUND },
        OR: ADMIN_THREAD_PREFIXES.map((source) => ({ source: { startsWith: source } })),
      },
    });
  } catch {
    return 0;
  }
}

export async function unreadCountsByThread(threadKeys: string[]) {
  const counts: Record<string, number> = {};
  if (!threadKeys.length) return counts;
  try {
    const rows = await prisma.contactMessage.findMany({
      where: {
        status: "NEW",
        subject: { in: ADMIN_INBOUND },
        source: { in: threadKeys.map((key) => `${CHAT_PREFIX}${key}`) },
      },
      select: { source: true },
    });
    for (const row of rows) {
      const key = (row.source || "").startsWith(CHAT_PREFIX) ? row.source!.slice(CHAT_PREFIX.length) : "";
      if (!key) continue;
      counts[key] = (counts[key] || 0) + 1;
    }
  } catch {
    // ignore
  }
  return counts;
}

export async function markAdminThreadRead(threadKey: string) {
  if (!threadKey) return;
  try {
    await prisma.contactMessage.updateMany({
      where: {
        source: `${CHAT_PREFIX}${threadKey}`,
        subject: { in: ADMIN_INBOUND },
        status: "NEW",
      },
      data: { status: "CONTACTED" },
    });
  } catch {
    // ignore
  }
}

export function keysMatch(stored: string, expected: string) {
  if (!stored || !expected) return false;
  if (stored === expected) return true;
  const a = stored.split(":");
  const b = expected.split(":");
  if (a[0] === "instructor" && b[0] === "instructor" && a.length >= 3 && b.length >= 3) {
    return (a[1] === b[1] && a[2] === b[2]) || (a[1] === b[2] && a[2] === b[1]);
  }
  return false;
}

function idsFromKeys(keys: string[]) {
  return Array.from(
    new Set(keys.flatMap((key) => key.split(":")).filter((part) => /^[a-f0-9]{24}$/i.test(part)))
  );
}

export async function findMessagesByThreads(threadKeys: string[]): Promise<DirectMsg[]> {
  if (!threadKeys.length) return [];
  const sources = threadKeys.map((key) => `${CHAT_PREFIX}${key}`);
  const ids = idsFromKeys(threadKeys);
  const collected: DirectMsg[] = [];

  try {
    const rows = await prisma.contactMessage.findMany({
      where: {
        OR: [
          { source: { in: sources } },
          { source: { startsWith: "chat:instructor:" } },
          { source: { startsWith: "chat:support:" } },
          { source: { startsWith: "chat:admin-faculty:" } },
          ...(ids.length ? [{ lastName: { in: ids } }] : []),
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    collected.push(
      ...rows
        .map(fromContact)
        .filter((msg) => {
          if (threadKeys.some((key) => keysMatch(msg.threadKey, key))) return true;
          if (msg.senderId && ids.includes(msg.senderId) && msg.threadKey.startsWith("instructor:")) {
            return threadKeys.some((key) => key.startsWith("instructor:") && keysMatch(msg.threadKey, key));
          }
          return false;
        })
    );
  } catch {
    // contact table should exist; ignore if it does not
  }

  try {
    const result: any = await prisma.$runCommandRaw({
      find: "direct_messages",
      filter: { thread_key: { $in: threadKeys } },
    });
    const docs = result?.cursor?.firstBatch || [];
    for (const doc of docs) {
      collected.push({
        id: String(doc._id?.$oid || doc._id || `raw-${collected.length}`),
        threadKey: doc.thread_key || doc.threadKey,
        senderRole: doc.sender_role || doc.senderRole,
        senderId: String(doc.sender_id || doc.senderId || ""),
        text: parseChatPayload(doc.text || "").text,
        attachments: parseChatPayload(doc.text || "").attachments,
        createdAt: doc.created_at?.$date || doc.created_at || doc.createdAt,
      });
    }
  } catch {
    // optional legacy collection
  }

  const seen = new Set<string>();
  return collected
    .filter((msg) => {
      const stamp = `${msg.threadKey}|${msg.senderRole}|${msg.text}|${msg.createdAt}`;
      if (seen.has(stamp)) return false;
      seen.add(stamp);
      return true;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function findMessagesByPrefix(prefix: string): Promise<DirectMsg[]> {
  try {
    const rows = await prisma.contactMessage.findMany({
      where: { source: { startsWith: `${CHAT_PREFIX}${prefix}` } },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(fromContact);
  } catch {
    return [];
  }
}

export async function createDirectMessage(data: {
  threadKey: string;
  senderRole: string;
  senderId: string;
  text: string;
  attachments?: ChatAttachment[];
}): Promise<DirectMsg> {
  const inbound = data.senderRole === "student" || data.senderRole === "instructor";
  const attachments = sanitizeAttachments(data.attachments);
  const row = await prisma.contactMessage.create({
    data: {
      firstName: data.senderRole,
      lastName: data.senderId,
      email: "chat@jcrm.internal",
      subject: data.senderRole,
      message: serializeChatPayload(data.text, attachments),
      source: `${CHAT_PREFIX}${data.threadKey}`,
      status: inbound ? "NEW" : "CONTACTED",
    },
  });
  return fromContact(row);
}

export function isChatLeadSource(source?: string | null) {
  return Boolean(source?.startsWith(CHAT_PREFIX));
}
