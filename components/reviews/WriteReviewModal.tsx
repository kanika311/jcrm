"use client";

import { useState, useEffect, useRef } from "react";
import { FiStar, FiUploadCloud, FiX, FiCheck, FiCopy, FiImage, FiExternalLink } from "react-icons/fi";
import { ReviewItem } from "@/lib/reviewsData";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newReview: ReviewItem) => void;
}

export default function WriteReviewModal({ isOpen, onClose, onSuccess }: WriteReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [quote, setQuote] = useState("");
  const [email, setEmail] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [useUrlInstead, setUseUrlInstead] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean preview on unmount or change
  useEffect(() => {
    return () => {
      if (screenshotPreview && screenshotPreview.startsWith("blob:")) {
        URL.revokeObjectURL(screenshotPreview);
      }
    };
  }, [screenshotPreview]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("Screenshot exceeds 15MB limit.");
      return;
    }

    setScreenshotFile(file);
    const objectUrl = URL.createObjectURL(file);
    setScreenshotPreview(objectUrl);
    setErrorMsg("");
  };

  const handleRemoveFile = () => {
    setScreenshotFile(null);
    if (screenshotPreview && screenshotPreview.startsWith("blob:")) {
      URL.revokeObjectURL(screenshotPreview);
    }
    setScreenshotPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.jcrm.in";
    const shareUrl = `${origin}/reviews?write=true`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!author.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!quote.trim()) {
      setErrorMsg("Please write your review feedback.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("author", author.trim());
      formData.append("role", role.trim() || (company ? `Client @ ${company}` : "Verified Trainee"));
      formData.append("company", company.trim());
      formData.append("quote", quote.trim());
      formData.append("rating", String(rating));
      formData.append("email", email.trim());

      if (screenshotFile) {
        formData.append("screenshot", screenshotFile);
      } else if (screenshotUrl.trim()) {
        formData.append("screenshotUrl", screenshotUrl.trim());
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review.");
      }

      setIsSuccess(true);
      if (onSuccess && data.review) {
        onSuccess(data.review);
      }

      // Reset form after 2.5s and close
      setTimeout(() => {
        setIsSuccess(false);
        setAuthor("");
        setRole("");
        setCompany("");
        setQuote("");
        setEmail("");
        handleRemoveFile();
        setScreenshotUrl("");
        onClose();
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const ratingLabels: Record<number, string> = {
    5: "5.0 ★ Exceptional Experience",
    4: "4.0 ★ Great Program / Solution",
    3: "3.0 ★ Good / Helpful",
    2: "2.0 ★ Fair / Needs Work",
    1: "1.0 ★ Unsatisfactory",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-xl my-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Banner */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-[#0055FF] text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider mb-1">
              <span>★ Client & Trainee Feedback</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Write a Review
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
              Share your genuine experience with JCRM Technologies
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Link Pill */}
        <div className="px-6 py-2.5 bg-blue-50/80 dark:bg-slate-800/60 border-b border-blue-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium truncate">
            Share this review form link with others:
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-[#0055FF] bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 hover:bg-blue-50 transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            {copiedLink ? (
              <>
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <FiCopy className="w-3.5 h-3.5" />
                <span>Copy Share Link</span>
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-black shadow-inner">
              ✓
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Review Submitted!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Thank you, <strong className="text-slate-900 dark:text-white">{author}</strong>! Your review is now live and helps aspiring students and prospective clients make informed decisions.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0055FF] hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/25"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            {/* Star Rating */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center justify-center gap-2 mb-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-3xl sm:text-4xl transition-transform hover:scale-125 cursor-pointer focus:outline-hidden"
                      aria-label={`${star} star`}
                    >
                      <span className={isFilled ? "text-amber-400 drop-shadow-sm" : "text-slate-300 dark:text-slate-700"}>
                        ★
                      </span>
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-[#0055FF]">
                {ratingLabels[hoverRating || rating]}
              </span>
            </div>

            {/* Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raghav Mishra"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Designation / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. DevOps Engineer / Student"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Company & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Company / College Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tech Solutions / IIT"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Email (Optional / Private)
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Review Quote */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Review & Feedback <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your training, ERP product experience, mentors, live projects, or placement support..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-y min-h-[90px]"
              />
            </div>

            {/* Screenshot / Image Attachment */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <FiImage className="w-4 h-4 text-[#0055FF]" />
                  <span>Attach Screenshot / Certificate / Proof (Optional)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setUseUrlInstead(!useUrlInstead)}
                  className="text-[11px] font-bold text-[#0055FF] hover:underline cursor-pointer"
                >
                  {useUrlInstead ? "Upload File" : "Paste Image URL"}
                </button>
              </div>

              {useUrlInstead ? (
                <div>
                  <input
                    type="url"
                    placeholder="https://example.com/screenshot.png"
                    value={screenshotUrl}
                    onChange={(e) => setScreenshotUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  />
                  {screenshotUrl && (
                    <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-200 max-h-32 w-auto">
                      <img src={screenshotUrl} alt="Preview" className="object-cover h-32 w-full" />
                    </div>
                  )}
                </div>
              ) : screenshotPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/5 p-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={screenshotPreview}
                      alt="Uploaded preview"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 text-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {screenshotFile?.name}
                      </p>
                      <p className="text-slate-500">
                        {((screenshotFile?.size || 0) / 1024).toFixed(1)} KB • Image Attached
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-[#0055FF] hover:bg-blue-50/40 transition-colors"
                >
                  <FiUploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Click to attach screenshot or certificate
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, or WebP up to 15MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0055FF] hover:bg-blue-600 transition-all cursor-pointer shadow-md shadow-blue-500/25 disabled:opacity-60 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
