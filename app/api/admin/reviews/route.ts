import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_REVIEWS, ReviewItem } from "@/lib/reviewsData";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

async function getStoredReviews(): Promise<ReviewItem[]> {
  const record = await prisma.siteContent.findUnique({
    where: { pageId: "public-testimonials" },
  });

  if (record && record.content && Array.isArray((record.content as any).reviews)) {
    return (record.content as any).reviews;
  }

  // Seed with DEFAULT_REVIEWS if not yet created
  await prisma.siteContent.upsert({
    where: { pageId: "public-testimonials" },
    create: {
      pageId: "public-testimonials",
      category: "public",
      content: { reviews: DEFAULT_REVIEWS } as any,
    },
    update: {
      content: { reviews: DEFAULT_REVIEWS } as any,
    },
  });

  return DEFAULT_REVIEWS;
}

export async function GET() {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const reviews = await getStoredReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/admin/reviews error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, review, id, isActive } = body;

    const currentReviews = await getStoredReviews();
    let updatedReviews: ReviewItem[] = [...currentReviews];

    if (action === "add") {
      if (!review || !review.author || !review.quote) {
        return NextResponse.json({ message: "Author and quote are required" }, { status: 400 });
      }

      const newReview: ReviewItem = {
        id: review.id || `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        author: review.author.trim(),
        role: review.role?.trim() || "Verified Client / Trainee",
        company: review.company?.trim() || "",
        quote: review.quote.trim(),
        rating: Math.min(Math.max(Number(review.rating) || 5, 1), 5),
        avatar: review.avatar?.trim() || "",
        screenshot: review.screenshot?.trim() || "",
        status: review.isActive === false || review.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        isActive: review.isActive !== false && review.status !== "INACTIVE",
        featured: review.featured !== false,
        userSubmitted: !!review.userSubmitted,
        orderIndex: review.orderIndex || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      updatedReviews.unshift(newReview);
    } else if (action === "update") {
      if (!id || !review) {
        return NextResponse.json({ message: "ID and review payload required" }, { status: 400 });
      }

      const index = updatedReviews.findIndex((r) => r.id === id);
      if (index === -1) {
        return NextResponse.json({ message: "Review not found" }, { status: 404 });
      }

      updatedReviews[index] = {
        ...updatedReviews[index],
        ...review,
        id,
        author: review.author?.trim() || updatedReviews[index].author,
        role: review.role?.trim() || updatedReviews[index].role,
        company: review.company !== undefined ? review.company.trim() : updatedReviews[index].company,
        quote: review.quote?.trim() || updatedReviews[index].quote,
        rating: Math.min(Math.max(Number(review.rating) || updatedReviews[index].rating, 1), 5),
        avatar: review.avatar !== undefined ? review.avatar.trim() : updatedReviews[index].avatar,
        screenshot: review.screenshot !== undefined ? review.screenshot.trim() : updatedReviews[index].screenshot,
        status: review.isActive === false || review.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        isActive: review.isActive !== false && review.status !== "INACTIVE",
        featured: review.featured !== undefined ? review.featured : updatedReviews[index].featured,
        updatedAt: new Date().toISOString(),
      };
    } else if (action === "toggle-status") {
      if (!id) {
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
      }

      const target = updatedReviews.find((r) => r.id === id);
      if (!target) {
        return NextResponse.json({ message: "Review not found" }, { status: 404 });
      }

      const nextActive = typeof isActive === "boolean" ? isActive : !target.isActive;
      target.isActive = nextActive;
      target.status = nextActive ? "ACTIVE" : "INACTIVE";
      target.updatedAt = new Date().toISOString();
    } else if (action === "delete") {
      if (!id) {
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
      }

      updatedReviews = updatedReviews.filter((r) => r.id !== id);
    } else if (action === "reorder") {
      if (!Array.isArray(body.reviews)) {
        return NextResponse.json({ message: "Reviews array required" }, { status: 400 });
      }
      updatedReviews = body.reviews;
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await prisma.siteContent.upsert({
      where: { pageId: "public-testimonials" },
      create: {
        pageId: "public-testimonials",
        category: "public",
        content: { reviews: updatedReviews } as any,
      },
      update: {
        content: { reviews: updatedReviews } as any,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/", "page");
    revalidatePath("/testimonials", "page");
    revalidatePath("/reviews", "page");
    try {
      (revalidateTag as any)("cms");
    } catch (_) {}

    return NextResponse.json({
      success: true,
      reviews: updatedReviews,
      message: "Reviews updated successfully",
    });
  } catch (error) {
    console.error("POST /api/admin/reviews error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
