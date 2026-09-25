"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiCheck, FiUploadCloud, FiExternalLink } from "react-icons/fi";
import { SponsoredAd } from "@/lib/sponsoredAd";

interface SponsoredAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAd: SponsoredAd;
  onSaveSuccess?: (updatedAd: SponsoredAd) => void;
}

export default function SponsoredAdModal({
  isOpen,
  onClose,
  initialAd,
  onSaveSuccess,
}: SponsoredAdModalProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<SponsoredAd>(initialAd);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialAd);
      setFeedback(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialAd]);

  if (!isOpen || !mounted || typeof document === "undefined" || !document.body) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/sponsored", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setFeedback({ type: "error", text: data.error || "Failed to save sponsored banner." });
      } else {
        setFeedback({ type: "success", text: "Sponsored banner updated and published successfully!" });
        if (onSaveSuccess && data.ad) {
          onSaveSuccess(data.ad);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-xl bg-white border border-[#D4E8F8] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D4E8F8] bg-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF] text-lg font-black shadow-xs">
              📢
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Manage Sponsored Banner / Ad
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Add or edit the advertisement card shown in the right panel of Our Team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {feedback && (
            <div
              className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-xs ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <span>{feedback.text}</span>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          )}

          {/* Active Toggle Switch */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-[#D4E8F8] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Enable Sponsored Banner
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Turn on to display this ad on the public Our Team right panel
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.isActive ? "bg-[#0055FF]" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                  formData.isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Badge & Sponsor Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Badge Label *
              </label>
              <input
                type="text"
                required
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. SPONSORED, FEATURED AD"
                className="w-full px-3.5 py-2.5 rounded-xl bg-blue-50/40 border border-[#D4E8F8] text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0055FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Sponsor / Brand Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Apex Tech Solutions"
                className="w-full px-3.5 py-2.5 rounded-xl bg-blue-50/40 border border-[#D4E8F8] text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0055FF]"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
              Headline / Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Expert Career Accelerator. Guaranteed Interviews."
              className="w-full px-3.5 py-2.5 rounded-xl bg-blue-50/40 border border-[#D4E8F8] text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0055FF]"
            />
          </div>

          {/* Banner Image URL */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
              Banner Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.image || ""}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/... or /path/to/image.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl bg-blue-50/40 border border-[#D4E8F8] text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0055FF]"
            />
            {formData.image && (
              <div className="mt-2 w-full h-28 rounded-xl overflow-hidden border border-[#D4E8F8] bg-slate-100 relative">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
              Promotional Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description highlighting the offer, benefits, or partner services..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-blue-50/40 border border-[#D4E8F8] text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0055FF]"
            />
          </div>

          {/* CTA Button Text & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Button Text *
              </label>
              <input
                type="text"
                required
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="e.g. Book Consultation, Visit Website"
                className="w-full px-3.5 py-2.5 rounded-xl bg-blue-50/40 border border-[#D4E8F8] text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0055FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Button Link / WhatsApp URL *
              </label>
              <input
                type="text"
                required
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                placeholder="https://... or https://wa.me/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-blue-50/40 border border-[#D4E8F8] text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0055FF]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#D4E8F8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Publish Sponsored Ad</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
