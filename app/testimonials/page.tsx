import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_REVIEWS, ReviewItem } from "@/lib/reviewsData";
import ReviewsPageClient from "@/components/reviews/ReviewsPageClient";
import { getSeoMetadata } from "@/lib/seoConfig";

export const revalidate = 3600;

export const metadata: Metadata = getSeoMetadata("/testimonials");

export default async function TestimonialsPage() {
  let reviews: ReviewItem[] = DEFAULT_REVIEWS;

  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "public-testimonials" },
    });

    if (record && record.content && Array.isArray((record.content as any).reviews)) {
      reviews = (record.content as any).reviews;
    }
  } catch (error) {
    console.error("Failed to load reviews for testimonials page:", error);
  }

  return <ReviewsPageClient initialReviews={reviews} />;
}