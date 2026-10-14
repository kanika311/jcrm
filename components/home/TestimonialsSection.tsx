"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiStar, FiEdit3, FiShare2, FiCheck, FiImage, FiX, FiArrowRight } from "react-icons/fi";
import { ReviewItem, DEFAULT_REVIEWS } from "@/lib/reviewsData";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";

interface TestimonialsSectionProps {
  initialReviews?: ReviewItem[];
}

export default function TestimonialsSection({ initialReviews }: TestimonialsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(
    initialReviews && initialReviews.length > 0 ? initialReviews : DEFAULT_REVIEWS
  );
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomScreenshot, setZoomScreenshot] = useState<string | null>(null);

  // Auto-open modal if URL has ?write=true or #write-review
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
  const displayReviews = activeReviews.length > 0 ? activeReviews : DEFAULT_REVIEWS;

  return (
    <section className="py-12 sm:py-20 md:py-24 relative z-10" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0055FF] text-xs font-black uppercase tracking-wider mb-2">
              <span>★ 4.9 / 5.0 Average Rating</span>
            </div>
            <h2 className="heading-font text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              What <span className="text-[#0055FF]">Clients & Trainees Say</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Authentic reviews from engineers and enterprise partners who built, scaled, and transformed with JCRM Technologies.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FiEdit3 className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayReviews.map((review) => (
            <div
              key={review.id}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-[30px] bg-white/90 backdrop-blur-xl border border-blue-100/80 shadow-[0_4px_24px_rgba(0,85,255,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
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

                {/* Screenshot thumbnail attachment if present */}
                {review.screenshot && (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => setZoomScreenshot(review.screenshot || null)}
                      className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100/60 transition-colors text-xs font-bold text-[#0055FF] cursor-pointer"
                    >
                      <img
                        src={review.screenshot}
                        alt="Proof screenshot"
                        className="w-8 h-8 rounded-lg object-cover border border-blue-200"
                      />
                      <span className="flex items-center gap-1">
                        <FiImage className="w-3.5 h-3.5" />
                        <span>View Proof / Screenshot</span>
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-blue-50 flex items-center justify-between gap-3">
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
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-2xs shrink-0"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Reviews Footer Banner */}
        <div className="mt-12 text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-200 bg-white/80 hover:bg-blue-50 text-[#0055FF] font-bold text-sm shadow-xs transition-all hover:gap-3"
          >
            <span>Explore All Reviews & Ratings</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
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
            className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl p-2"
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
    </section>
  );
}
