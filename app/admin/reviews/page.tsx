import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEFAULT_REVIEWS, ReviewItem } from "@/lib/reviewsData";
import ReviewsManagementClient from "./ReviewsManagementClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/jcrm-sushant");
  }

  let reviews: ReviewItem[] = DEFAULT_REVIEWS;

  try {
    const record = await prisma.siteContent.findUnique({
      where: { pageId: "public-testimonials" },
    });

    if (record && record.content && Array.isArray((record.content as any).reviews)) {
      reviews = (record.content as any).reviews;
    } else {
      await prisma.siteContent.upsert({
        where: { pageId: "public-testimonials" },
        create: {
          pageId: "public-testimonials",
          category: "public",
          content: { reviews: DEFAULT_REVIEWS } as any,
        },
        update: {},
      });
    }
  } catch (error) {
    console.error("Failed to load reviews for admin:", error);
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-24">
      <ReviewsManagementClient initialReviews={reviews} />
    </div>
  );
}
