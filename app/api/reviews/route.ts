import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_REVIEWS, ReviewItem } from "@/lib/reviewsData";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function GET() {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "public-testimonials" },
    });

    let reviews: ReviewItem[] = DEFAULT_REVIEWS;
    if (record && record.content && Array.isArray((record.content as any).reviews)) {
      reviews = (record.content as any).reviews;
    } else if (record && record.content && Array.isArray((record.content as any).testimonials)) {
      // Legacy format conversion
      reviews = (record.content as any).testimonials.map((t: any, idx: number) => ({
        id: t.id || `legacy-${idx}`,
        author: t.name || t.author || "Anonymous",
        role: t.role || "Trainee",
        quote: t.quote || "",
        rating: t.rating || 5,
        avatar: t.imgUrl || t.avatar || "",
        screenshot: t.screenshot || "",
        status: t.isActive !== false ? "ACTIVE" : "INACTIVE",
        isActive: t.isActive !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }

    const activeReviews = reviews.filter((r) => r.isActive !== false && r.status !== "INACTIVE");
    return NextResponse.json({ reviews: activeReviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ reviews: DEFAULT_REVIEWS });
  }
}

export async function POST(req: Request) {
  try {
    let author = "";
    let role = "";
    let company = "";
    let quote = "";
    let rating = 5;
    let screenshotUrl = "";
    let email = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      author = (formData.get("author") as string)?.trim() || "";
      role = (formData.get("role") as string)?.trim() || "";
      company = (formData.get("company") as string)?.trim() || "";
      quote = (formData.get("quote") as string)?.trim() || "";
      email = (formData.get("email") as string)?.trim() || "";
      const rawRating = Number(formData.get("rating"));
      if (!isNaN(rawRating) && rawRating >= 1 && rawRating <= 5) {
        rating = rawRating;
      }
      screenshotUrl = (formData.get("screenshotUrl") as string)?.trim() || "";

      // Check if a file was uploaded
      const file = formData.get("screenshot") as File | null;
      if (file && typeof file === "object" && file.size > 0) {
        const MAX_SIZE = 15 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
          return NextResponse.json({ message: "Screenshot exceeds 15MB limit" }, { status: 400 });
        }

        const rawBuffer = Buffer.from(await file.arrayBuffer());
        let webpBuffer: Buffer = rawBuffer;

        try {
          webpBuffer = await sharp(rawBuffer, { failOn: "none" })
            .rotate()
            .resize(1400, 1400, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 84 })
            .toBuffer();
        } catch (sharpErr) {
          console.warn("[REVIEW_SHARP_FALLBACK] Using raw buffer:", sharpErr);
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads", "reviews");
        await mkdir(uploadDir, { recursive: true });

        const safeBase = (file.name || "screenshot")
          .replace(/\.[^/.]+$/, "")
          .replace(/[^\w-]/g, "_")
          .slice(0, 40);
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeBase}.webp`;

        await writeFile(path.join(uploadDir, filename), webpBuffer);
        screenshotUrl = `/uploads/reviews/${filename}`;
      }
    } else {
      const body = await req.json();
      author = body.author?.trim() || "";
      role = body.role?.trim() || "";
      company = body.company?.trim() || "";
      quote = body.quote?.trim() || "";
      email = body.email?.trim() || "";
      rating = Number(body.rating) || 5;
      screenshotUrl = body.screenshot?.trim() || body.screenshotUrl?.trim() || "";
    }

    if (!author) {
      return NextResponse.json({ message: "Author name is required" }, { status: 400 });
    }
    if (!quote) {
      return NextResponse.json({ message: "Review quote is required" }, { status: 400 });
    }
    if (!role) {
      role = company ? `Client @ ${company}` : "Verified Trainee / Client";
    }

    // Load existing reviews
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "public-testimonials" },
    });

    let currentReviews: ReviewItem[] = DEFAULT_REVIEWS;
    if (record && record.content && Array.isArray((record.content as any).reviews)) {
      currentReviews = (record.content as any).reviews;
    }

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      author,
      role: company && !role.includes(company) ? `${role} @ ${company}` : role,
      company,
      quote,
      rating: Math.min(Math.max(rating, 1), 5),
      screenshot: screenshotUrl || undefined,
      status: "ACTIVE",
      isActive: true,
      featured: true,
      userSubmitted: true,
      email: email || undefined,
      orderIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Prepend new review so it appears first
    const updatedReviews = [newReview, ...currentReviews];

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
      review: newReview,
      message: "Thank you! Your review has been submitted and published successfully.",
    });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ message: "Failed to submit review" }, { status: 500 });
  }
}
