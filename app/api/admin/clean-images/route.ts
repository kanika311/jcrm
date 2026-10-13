import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export const dynamic = "force-dynamic";

async function convertBase64ToWebp(base64Str: string, prefix: string): Promise<string | null> {
  const match = base64Str.match(/^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/);
  if (!match || !match[1]) return null;

  const buffer = Buffer.from(match[1], "base64");
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const safePrefix = prefix.replace(/[^\w-]/g, "").slice(0, 30);
  const filename = `${safePrefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}.webp`;
  const filePath = path.join(uploadDir, filename);

  const webpBuffer = await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize(320, 320, { fit: "cover" })
    .webp({ quality: 80, effort: 4 })
    .toBuffer();

  await writeFile(filePath, webpBuffer);
  return `/uploads/${filename}`;
}

export async function GET() {
  try {
    let convertedMembers = 0;
    let convertedCandidates = 0;

    // 1. Clean TeamMembers
    const members = await prisma.teamMember.findMany({
      select: { id: true, name: true, image: true },
    });

    for (const m of members) {
      if (m.image && m.image.startsWith("data:image/")) {
        try {
          const webpUrl = await convertBase64ToWebp(m.image, `member-${m.id}`);
          if (webpUrl) {
            await prisma.teamMember.update({
              where: { id: m.id },
              data: { image: webpUrl },
            });
            convertedMembers++;
          }
        } catch (err: any) {
          console.warn("[CLEAN_MEMBER_ERR]", m.name, err?.message);
        }
      }
    }

    // 2. Clean SiteContent "placed-candidates"
    const placedContent = await prisma.siteContent.findUnique({
      where: { pageId: "placed-candidates" },
    });

    if (placedContent && placedContent.content && Array.isArray((placedContent.content as any).candidates)) {
      const candidates = [...(placedContent.content as any).candidates];
      let modified = false;

      for (let i = 0; i < candidates.length; i++) {
        const c = candidates[i];
        if (c.image && typeof c.image === "string" && c.image.startsWith("data:image/")) {
          try {
            const webpUrl = await convertBase64ToWebp(c.image, `candidate-${c.id || i}`);
            if (webpUrl) {
              candidates[i].image = webpUrl;
              modified = true;
              convertedCandidates++;
            }
          } catch (err: any) {
            console.warn("[CLEAN_CANDIDATE_ERR]", c.name, err?.message);
          }
        }
      }

      if (modified) {
        await prisma.siteContent.update({
          where: { pageId: "placed-candidates" },
          data: { content: { ...(placedContent.content as any), candidates } },
        });
      }
    }

    return NextResponse.json({
      success: true,
      convertedMembers,
      convertedCandidates,
      message: `Successfully converted ${convertedMembers} team members and ${convertedCandidates} placed candidates from base64 to compressed WebP files!`,
    });
  } catch (error: any) {
    console.error("[CLEAN_IMAGES_ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
