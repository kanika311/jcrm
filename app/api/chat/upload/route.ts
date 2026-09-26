import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { kindFromFile } from "@/lib/chatAttachments";

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file received" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "File exceeds 10MB limit" }, { status: 400 });
  }

  const kind = kindFromFile(file);
  if (!kind) {
    return NextResponse.json({ message: "Only photos, PDFs, and audio files are allowed" }, { status: 400 });
  }

  const ext = path.extname(file.name || "").toLowerCase() || (kind === "pdf" ? ".pdf" : kind === "audio" ? ".mp3" : ".jpg");
  const safeBase = (file.name || `${kind}-file`).replace(/[^\w.\-]/g, "_").slice(0, 60);
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeBase}${safeBase.includes(".") ? "" : ext}`;

  const dir = path.join(process.cwd(), "public", "uploads", "chat");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    attachment: {
      kind,
      name: file.name || filename,
      url: `/uploads/chat/${filename}`,
    },
  });
}
