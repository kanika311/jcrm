import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId");

    if (!pageId) {
      return NextResponse.json({ message: "pageId is required" }, { status: 400 });
    }

    const content = await prisma.siteContent.findUnique({
      where: { pageId },
    });

    return NextResponse.json({ content: content?.content || {} });
  } catch (error) {
    console.error("CMS GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pageId, category, content } = body;

    if (!pageId || !category || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Upsert the content
    const updated = await prisma.siteContent.upsert({
      where: { pageId },
      update: { content },
      create: {
        pageId,
        category,
        content,
      },
    });

    // Invalidate the root layout cache so navbar and global settings update immediately
    revalidatePath("/", "layout");

    return NextResponse.json({ message: "Saved successfully", data: updated });
  } catch (error) {
    console.error("CMS POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
