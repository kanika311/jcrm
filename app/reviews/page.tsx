import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_REVIEWS, ReviewItem } from "@/lib/reviewsData";
import ReviewsPageClient from "@/components/reviews/ReviewsPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Reviews & Ratings | JCRM Technologies",
  description:
    "Explore verified reviews and feedback from enterprise clients and software engineers who partnered and trained with JCRM Technologies.",
  alternates: {
    canonical: "https://www.jcrm.in/reviews",
  },
};

export default async function ReviewsPage() {
  let reviews: ReviewItem[] = DEFAULT_REVIEWS;

  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "public-testimonials" },
    });

    if (record && record.content && Array.isArray((record.content as any).reviews)) {
      reviews = (record.content as any).reviews;
    }
  } catch (error) {
    console.error("Failed to load reviews for /reviews page:", error);
  }

  return <ReviewsPageClient initialReviews={reviews} />;
}
