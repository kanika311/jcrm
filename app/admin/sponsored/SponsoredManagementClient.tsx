"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiImage,
  FiX,
  FiSave,
} from "react-icons/fi";
import { SponsoredAd } from "@/lib/sponsoredAd";

export default function SponsoredManagementClient({
  initialAds,
}: {
  initialAds: SponsoredAd[];
}) {
  const [ads, setAds] = useState<SponsoredAd[]>(initialAds);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<SponsoredAd | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formBadge, setFormBadge] = useState("SPONSORED");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formCtaText, setFormCtaText] = useState("Book Your Consultation");
  const [formCtaLink, setFormCtaLink] = useState("https://wa.me/918310531309");
  const [formIsActive, setFormIsActive] = useState(true);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter Ads
  const filteredAds = ads.filter(ad => {
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && ad.isActive) ||
      (statusFilter === "INACTIVE" && !ad.isActive);

    const s = searchTerm.toLowerCase();
    const matchesSearch =
      !s ||
      ad.title.toLowerCase().includes(s) ||
      ad.company.toLowerCase().includes(s) ||
      ad.description.toLowerCase().includes(s) ||
      ad.badge.toLowerCase().includes(s);

    return matchesStatus && matchesSearch;
  });

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingAd(null);
    setFormTitle("");
    setFormCompany("");
    setFormBadge("SPONSORED");
    setFormDescription("");
    setFormImage("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80");
    setFormCtaText("Book Your Consultation");
    setFormCtaLink("https://wa.me/918310531309?text=Hello%20Founder,%20I%20am%20interested%20in%20the%20Sponsored%20Placement%20Accelerator%20program.");
    setFormIsActive(true);
    setFeedback(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (ad: SponsoredAd) => {
    setEditingAd(ad);
    setFormTitle(ad.title);
    setFormCompany(ad.company);
    setFormBadge(ad.badge || "SPONSORED");
    setFormDescription(ad.description);
    setFormImage(ad.image || "");
    setFormCtaText(ad.ctaText || "Book Your Consultation");
    setFormCtaLink(ad.ctaLink || "https://wa.me/918310531309");
    setFormIsActive(ad.isActive);
    setFeedback(null);
    setIsModalOpen(true);
  };

  // Handle Image Upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setFormImage(data.url);
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = e => setFormImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = e => setFormImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (id: string) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/sponsored", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle status");

      setAds(prev =>
        prev.map(a => (a.id === id ? { ...a, isActive: !a.isActive } : a))
      );
      setFeedback({ type: "success", message: "Ad status updated successfully." });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to toggle status" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Ad
  const handleDeleteAd = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete sponsored ad "${title}"?`)) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/sponsored?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete ad");

      setAds(prev => prev.filter(a => a.id !== id));
      setFeedback({ type: "success", message: `"${title}" was deleted successfully.` });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to delete ad" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save (Create or Update)
  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCompany.trim()) {
      alert("Title and Company name are required.");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const payloadAd: SponsoredAd = {
      id: editingAd ? editingAd.id : undefined,
      title: formTitle.trim(),
      company: formCompany.trim(),
      badge: formBadge.trim() || "SPONSORED",
      description: formDescription.trim(),
      image: formImage.trim(),
      ctaText: formCtaText.trim() || "Learn More",
      ctaLink: formCtaLink.trim(),
      isActive: formIsActive,
    };

    try {
      const res = await fetch("/api/admin/sponsored", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: editingAd ? "update" : "create",
          ad: payloadAd,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to save sponsored ad");
      }

      if (data.ads) {
        setAds(data.ads);
      } else if (editingAd) {
        setAds(prev =>
          prev.map(a => (a.id === editingAd.id ? { ...a, ...payloadAd } : a))
        );
      } else if (data.ad) {
        setAds(prev => [data.ad, ...prev]);
      }

      setFeedback({
        type: "success",
        message: editingAd
          ? `Sponsored ad "${payloadAd.title}" updated successfully!`
          : `New sponsored ad "${payloadAd.title}" created successfully!`,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to save ad" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCount = ads.filter(a => a.isActive).length;
  const inactiveCount = ads.filter(a => !a.isActive).length;

  return (
    <div className="space-y-4 font-sans">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl px-5 py-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-0.5">
            <Link href="/admin" className="hover:text-slate-900 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-extrabold">Sponsored Ads</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sponsored Ads Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-[#0055FF] border border-[#D4E8F8]">
              {ads.length} Ads
            </span>
          </div>
        </div>

        {/* Action Controls - Right Corner Add Button */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/courses"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black transition shadow-2xs"
          >
            <FiExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Courses</span>
          </Link>

          <Link
            href="/ourteam"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black transition shadow-2xs"
          >
            <FiExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Our Team</span>
          </Link>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-black shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>+ Add Sponsored Ad</span>
          </button>
        </div>
      </div>

      {/* Feedback Alerts */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-xs border animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-rose-50 text-rose-900 border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <FiAlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Single-Line Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search sponsored ads by title, company, description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-semibold rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 transition"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({ads.length})
          </button>
          <button
            onClick={() => setStatusFilter("ACTIVE")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === "ACTIVE"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter("INACTIVE")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === "INACTIVE"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Inactive ({inactiveCount})
          </button>
        </div>
      </div>

      {/* Ads List Table / Cards */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-700">
                <th className="py-3.5 px-5">Ad Banner</th>
                <th className="py-3.5 px-5">Company / Title</th>
                <th className="py-3.5 px-5">Description</th>
                <th className="py-3.5 px-5">CTA Action</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredAds.map(ad => (
                <tr key={ad.id || ad.title} className="hover:bg-slate-50/70 transition-colors">
                  {/* Thumbnail */}
                  <td className="py-4 px-5 shrink-0">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group flex items-center justify-center">
                      {ad.image ? (
                        <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                      ) : (
                        <FiImage className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                  </td>

                  {/* Title & Company */}
                  <td className="py-4 px-5">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-blue-50 text-[#0055FF] border border-[#D4E8F8]">
                        {ad.badge || "SPONSORED"}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 leading-snug">{ad.title}</h4>
                      <div className="text-[11px] font-bold text-slate-500">{ad.company}</div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-4 px-5 max-w-xs">
                    <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {ad.description}
                    </p>
                  </td>

                  {/* CTA */}
                  <td className="py-4 px-5">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 font-bold text-[#0055FF]">
                        <span>{ad.ctaText || "Learn More"}</span>
                        <FiExternalLink className="w-3 h-3" />
                      </span>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-[180px]">
                        {ad.ctaLink}
                      </div>
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-5 text-center">
                    <button
                      onClick={() => ad.id && handleToggleStatus(ad.id)}
                      disabled={isSubmitting}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer border ${
                        ad.isActive
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                      title={ad.isActive ? "Click to set Draft" : "Click to publish Live"}
                    >
                      {ad.isActive ? (
                        <>
                          <FiEye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Live</span>
                        </>
                      ) : (
                        <>
                          <FiEyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(ad)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer shadow-2xs"
                        title="Edit Sponsored Ad"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => ad.id && handleDeleteAd(ad.id, ad.title)}
                        disabled={isSubmitting}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer shadow-2xs"
                        title="Delete Sponsored Ad"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAds.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                    No sponsored ads match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingAd ? "Edit Sponsored Ad" : "Add New Sponsored Ad"}
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  Configure headline, partner branding, promotional graphic, and target link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAd} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4 flex-1 min-h-0 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
                      Ad Headline / Title <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      placeholder="e.g. Cloud & AI Placement Accelerator"
                      className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
                      Partner / Company Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formCompany}
                      onChange={e => setFormCompany(e.target.value)}
                      placeholder="e.g. Apex Tech Innovations Partner"
                      className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={e => setFormBadge(e.target.value)}
                      placeholder="SPONSORED, PARTNER, EXCLUSIVE"
                      className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
                    Ad Description / Value Proposition <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    placeholder="Short 2-3 line description of what this partner offers students and visitors..."
                    className="w-full bg-white text-slate-900 font-medium text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CTA Text */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={formCtaText}
                      onChange={e => setFormCtaText(e.target.value)}
                      placeholder="Book Your Consultation"
                      className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                    />
                  </div>

                  {/* CTA Link */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
                      CTA Target URL / WhatsApp Link
                    </label>
                    <input
                      type="text"
                      required
                      value={formCtaLink}
                      onChange={e => setFormCtaLink(e.target.value)}
                      placeholder="https://wa.me/918310531309..."
                      className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Thumbnail Image */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                    Promotional Hero Image
                  </label>
                  <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-300 bg-white flex items-center justify-center">
                      {formImage ? (
                        <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">No Image</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingImage}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0055FF] text-white hover:bg-blue-600 transition cursor-pointer"
                        >
                          {isUploadingImage ? "Uploading..." : "📁 Upload Image"}
                        </button>
                      </div>
                      <input
                        type="url"
                        value={formImage}
                        onChange={e => setFormImage(e.target.value)}
                        placeholder="Or paste external image URL..."
                        className="w-full bg-white text-slate-800 font-medium text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0055FF] placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={e => setFormIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#0055FF] rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-black text-slate-900">
                        Publish Ad as Active (Live)
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500">
                        When enabled, this sponsored card appears in the right sidebar of public pages.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black bg-[#0055FF] hover:bg-blue-600 text-white shadow-md shadow-blue-500/25 transition cursor-pointer disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : editingAd ? "Save Changes" : "Create Sponsored Ad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
