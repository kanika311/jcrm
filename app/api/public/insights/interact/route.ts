import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in to interact." }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await req.json();
    const { postId, action, comment } = data;

    if (!postId || !action) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const post = await prisma.insightPost.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    if (action === "like") {
      // Check if already liked
      const existing = await prisma.insightLike.findUnique({
        where: {
          postId_userId: { postId, userId }
        }
      });
      if (existing) {
        // Unlike
        await prisma.insightLike.delete({ where: { id: existing.id } });
        return NextResponse.json({ success: true, message: "Unliked" });
      } else {
        // Like
        await prisma.insightLike.create({
          data: { postId, userId }
        });
        return NextResponse.json({ success: true, message: "Liked" });
      }
    } else if (action === "comment" && comment) {
      await prisma.insightComment.create({
        data: {
          postId,
          authorId: userId,
          content: comment
        }
      });
      return NextResponse.json({ success: true, message: "Comment added" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error interacting with post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
