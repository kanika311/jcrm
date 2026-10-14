"use client";

import { useState } from "react";
import {
  FiStar,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiCheck,
  FiSearch,
  FiImage,
  FiX,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiUploadCloud,
} from "react-icons/fi";
import { ReviewItem } from "@/lib/reviewsData";

interface ReviewsManagementClientProps {
  initialReviews: ReviewItem[];
}

export default function ReviewsManagementClient({ initialReviews }: ReviewsManagementClientProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "USER_SUBMITTED">("ALL");
  const [copiedLink, setCopiedLink] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [formData, setFormData] = useState({
    author: "",
    role: "",
    company: "",
    quote: "",
    rating: 5,
    screenshot: "",
    avatar: "",
    isActive: true,
    featured: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Screenshot Zoom Modal
  const [zoomScreenshot, setZoomScreenshot] = useState<string | null>(null);

  // Delete Confirm Modal
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleCopyShareLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.jcrm.in";
    const shareUrl = `${origin}/reviews?write=true`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      showToast("Shareable review link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleOpenAddModal = () => {
    setEditingReview(null);
    setFormData({
      author: "",
      role: "",
      company: "",
      quote: "",
      rating: 5,
      screenshot: "",
      avatar: "",
      isActive: true,
      featured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (review: ReviewItem) => {
    setEditingReview(review);
    setFormData({
      author: review.author,
      role: review.role,
      company: review.company || "",
      quote: review.quote,
      rating: review.rating || 5,
      screenshot: review.screenshot || "",
      avatar: review.avatar || "",
      isActive: review.isActive !== false && review.status !== "INACTIVE",
      featured: review.featured !== false,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    const nextActive = !currentActive;
    // Optimistic update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isActive: nextActive, status: nextActive ? "ACTIVE" : "INACTIVE" } : r
      )
    );

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-status", id, isActive: nextActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle status");
      showToast(nextActive ? "Review activated." : "Review deactivated.");
    } catch (err) {
      console.error(err);
      showToast("Error updating status.", "error");
      // Rollback
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isActive: currentActive, status: currentActive ? "ACTIVE" : "INACTIVE" } : r
        )
      );
    }
  };

  const handleDeleteReview = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: deletingId }),
      });

      if (!res.ok) throw new Error("Failed to delete review");

      setReviews((prev) => prev.filter((r) => r.id !== deletingId));
      showToast("Review deleted successfully.");
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to delete review.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.quote.trim()) {
      showToast("Please fill in author and quote.", "error");
      return;
    }

    setIsSaving(true);

    try {
      const isEditing = !!editingReview;
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEditing ? "update" : "add",
          id: editingReview?.id,
          review: {
            ...formData,
            status: formData.isActive ? "ACTIVE" : "INACTIVE",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save review");

      if (data.reviews) {
        setReviews(data.reviews);
      }
      showToast(isEditing ? "Review updated successfully." : "New review created!");
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Error saving review.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.company && r.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.quote.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "ACTIVE") return r.isActive !== false && r.status !== "INACTIVE";
    if (statusFilter === "INACTIVE") return r.isActive === false || r.status === "INACTIVE";
    if (statusFilter === "USER_SUBMITTED") return !!r.userSubmitted;

    return true;
  });

  const totalReviews = reviews.length;
  const activeCount = reviews.filter((r) => r.isActive !== false && r.status !== "INACTIVE").length;
  const inactiveCount = totalReviews - activeCount;
  const userSubmittedCount = reviews.filter((r) => r.userSubmitted).length;
  const avgRating = (
    reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider mb-2">
            <span>★ Real-Time Feedback Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Reviews & Testimonials CMS
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
            Remotely manage all client and student reviews, moderate public submissions, toggle visibility, and generate shareable links.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <FiCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <FiShare2 className="w-4 h-4 text-blue-200" />
                <span>Copy Shareable Link</span>
              </>
            )}
          </button>

          <a
            href="/reviews"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all"
          >
            <span>View Live Site</span>
            <FiExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-sm font-bold border transition-all animate-fade-in ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Reviews</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalReviews}</p>
        </div>
        <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 shadow-xs">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Reviews</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{activeCount}</p>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inactive</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-500 mt-1">{inactiveCount}</p>
        </div>
        <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50/50 shadow-xs">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Average Rating</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-800 mt-1 flex items-center gap-1">
            <span>{avgRating}</span>
            <span className="text-amber-500 text-xl">★</span>
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: `All (${totalReviews})` },
            { id: "ACTIVE", label: `Active (${activeCount})` },
            { id: "INACTIVE", label: `Inactive (${inactiveCount})` },
            { id: "USER_SUBMITTED", label: `User Submitted (${userSubmittedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#0055FF] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReviews.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-white">
            <FiStar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-base font-bold text-slate-700">No reviews found matching criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or adding a new review.</p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const isActive = review.isActive !== false && review.status !== "INACTIVE";

            return (
              <div
                key={review.id}
                className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between bg-white shadow-2xs hover:shadow-md ${
                  isActive ? "border-slate-200" : "border-slate-200/60 opacity-60 bg-slate-50/50"
                }`}
              >
                <div>
                  {/* Card Header: Rating & Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex gap-0.5 text-amber-400 text-sm">
                      {"★".repeat(review.rating || 5)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {review.userSubmitted && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-[#0055FF] border border-blue-200">
                          Site Form
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Review Quote */}
                  <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed italic mb-4">
                    "{review.quote}"
                  </p>

                  {/* Screenshot Thumbnail if present */}
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
                          className="w-8 h-8 rounded-lg object-cover border border-blue-200 shrink-0"
                        />
                        <span className="flex items-center gap-1">
                          <FiImage className="w-3.5 h-3.5" />
                          <span>View Proof Screenshot</span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Footer: Author + Actions */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 truncate">
                        {review.author}
                      </p>
                      <p className="text-xs font-semibold text-[#0055FF] truncate">{review.role}</p>
                    </div>

                    {review.avatar && (
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    )}
                  </div>

                  {/* Quick Action Toolbar */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-50 text-xs">
                    {/* Active/Inactive Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(review.id, isActive)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        isActive
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}
                      title={isActive ? "Deactivate Review" : "Activate Review"}
                    >
                      {isActive ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                      <span>{isActive ? "Hide" : "Show"}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(review)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                        title="Edit Review"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingId(review.id)}
                        className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Delete Review"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg my-8 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-[#0055FF] text-white flex items-center justify-between">
              <h2 className="text-lg font-black">
                {editingReview ? "Edit Review" : "Add New Review"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 text-2xl cursor-pointer"
                    >
                      <span className={formData.rating >= star ? "text-amber-400" : "text-slate-300"}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-500 ml-2">
                    {formData.rating} out of 5 stars
                  </span>
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raghav Mishra"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role & Company */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operations Director"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Org</label>
                  <input
                    type="text"
                    placeholder="e.g. V-Logistics"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Quote */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Quote *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="What did they say about JCRM Technologies?"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Screenshot / Proof URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proof Screenshot / Attachment URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://... or /uploads/reviews/..."
                  value={formData.screenshot}
                  onChange={(e) => setFormData({ ...formData, screenshot: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Avatar Photo URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Switches */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Active & Visible on Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-[#0055FF] hover:bg-blue-600 disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Delete Review?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteReview}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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
