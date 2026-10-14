"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiStar, FiEdit3, FiShare2, FiCheck, FiImage, FiX, FiFilter } from "react-icons/fi";
import { ReviewItem, DEFAULT_REVIEWS } from "@/lib/reviewsData";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";

interface ReviewsPageClientProps {
  initialReviews: ReviewItem[];
  heading?: string;
  subtitle?: string;
}

export default function ReviewsPageClient({
  initialReviews,
  heading = "What Clients & Trainees Say",
  subtitle = "Over 10,000 developers and enterprise clients have upgraded their careers and operations with JCRM Technologies.",
}: ReviewsPageClientProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(
    initialReviews && initialReviews.length > 0 ? initialReviews : DEFAULT_REVIEWS
  );
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomScreenshot, setZoomScreenshot] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | "ALL">("ALL");

  // Check URL query param ?write=true or #write-review
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("write") === "true" || window.location.hash === "#write-review") {
        setIsWriteModalOpen(true);
      }
    }
  }, []);

  const handleCopyShareLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.jcrm.in";
    const shareUrl = `${origin}/reviews?write=true`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleNewReview = (newReview: ReviewItem) => {
    setReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReview.id)]);
  };

  const activeReviews = reviews.filter((r) => r.isActive !== false && r.status !== "INACTIVE");
  const filteredReviews = activeReviews.filter((r) => {
    if (selectedRating === "ALL") return true;
    return (r.rating || 5) === selectedRating;
  });

  const totalCount = activeReviews.length;
  const avgRating = (
    activeReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / (totalCount || 1)
  ).toFixed(1);

  return (
    <div className="min-h-screen pt-32 pb-24 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0055FF] text-xs font-black uppercase tracking-wider mb-3">
            <span>Verified Ratings & Testimonials</span>
          </div>
          <h1 className="heading-font text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {heading}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Rating Banner & Action CTAs */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="text-4xl sm:text-5xl font-black text-[#0055FF] tracking-tight">
              {avgRating}
            </div>
            <div>
              <div className="flex text-amber-400 text-xl tracking-wider">★★★★★</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                Average Rating ({totalCount} verified reviews)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <FiCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Link Copied!</span>
                </>
              ) : (
                <>
                  <FiShare2 className="w-4 h-4 text-slate-500" />
                  <span>Share Review Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsWriteModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FiEdit3 className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Star Filter Pills */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <FiFilter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            {[
              { id: "ALL", label: `All (${totalCount})` },
              { id: 5, label: `5 Stars (${activeReviews.filter((r) => (r.rating || 5) === 5).length})` },
              { id: 4, label: `4 Stars (${activeReviews.filter((r) => r.rating === 4).length})` },
              { id: 3, label: `3 Stars (${activeReviews.filter((r) => r.rating === 3).length})` },
            ].map((tab) => (
              <button
                key={String(tab.id)}
                type="button"
                onClick={() => setSelectedRating(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  selectedRating === tab.id
                    ? "bg-[#0055FF] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline">
            Showing {filteredReviews.length} reviews
          </span>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredReviews.length === 0 ? (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-white">
              <FiStar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-base font-bold text-slate-700">No reviews found for this rating.</p>
              <button
                type="button"
                onClick={() => setSelectedRating("ALL")}
                className="mt-3 text-xs font-bold text-[#0055FF] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="p-6 sm:p-8 rounded-2xl sm:rounded-[30px] bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,85,255,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex gap-1 text-amber-400 text-sm">
                      {"★".repeat(review.rating || 5)}
                    </div>
                    {review.userSubmitted && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-[#0055FF] border border-blue-200">
                        Verified Review
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm md:text-base text-slate-700 font-normal leading-relaxed italic mb-4">
                    "{review.quote}"
                  </p>

                  {/* Screenshot Thumbnail */}
                  {review.screenshot && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setZoomScreenshot(review.screenshot || null)}
                        className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100 text-xs font-bold text-[#0055FF] transition-colors cursor-pointer"
                      >
                        <img
                          src={review.screenshot}
                          alt="Screenshot"
                          className="w-8 h-8 rounded-lg object-cover border border-blue-200"
                        />
                        <span className="flex items-center gap-1">
                          <FiImage className="w-3.5 h-3.5" />
                          <span>View Proof Screenshot</span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                      {review.author}
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold text-[#0055FF] truncate">
                      {review.role}
                    </div>
                  </div>

                  {review.avatar && (
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSuccess={handleNewReview}
      />

      {/* Screenshot Zoom Modal */}
      {zoomScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setZoomScreenshot(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden border border-slate-700 shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomScreenshot(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-950 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={zoomScreenshot}
              alt="Proof full size"
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
