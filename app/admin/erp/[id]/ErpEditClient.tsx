"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiUploadCloud,
  FiExternalLink,
  FiPlus,
  FiX,
  FiLayers,
  FiTag,
  FiTrendingUp,
  FiDollarSign,
  FiImage,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export interface ErpProductItem {
  id: string;
  title: string;
  category: string;
  badge?: string | null;
  modulesCount: number;
  roiMetric?: string | null;
  image?: string | null;
  description: string;
  modules: string[];
  demoUrl?: string | null;
  price?: string | null;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
}

const INDUSTRY_CATEGORIES = [
  "Education & Academies",
  "Healthcare & Wellness",
  "Manufacturing & Logistics",
  "Retail & E-Commerce",
  "Corporate & Services",
  "Real Estate & Construction",
  "Daily Operations & Smart Automation",
];

export default function ErpEditClient({
  initialSolution,
}: {
  initialSolution: ErpProductItem;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ErpProductItem>(initialSolution);
  const [newModuleInput, setNewModuleInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Handle Image Upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image file size should be less than 5MB.");
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
          setForm(prev => ({ ...prev, image: data.url }));
          return;
        }
      }

      // Fallback local data URL
      const reader = new FileReader();
      reader.onload = e => {
        setForm(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = e => {
        setForm(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Add Module
  const handleAddModule = () => {
    const trimmed = newModuleInput.trim();
    if (!trimmed) return;
    if (!form.modules.includes(trimmed)) {
      const updatedModules = [...form.modules, trimmed];
      setForm(prev => ({
        ...prev,
        modules: updatedModules,
        modulesCount: Math.max(prev.modulesCount, updatedModules.length),
      }));
    }
    setNewModuleInput("");
  };

  // Remove Module
  const handleRemoveModule = (indexToRemove: number) => {
    const updatedModules = form.modules.filter((_, idx) => idx !== indexToRemove);
    setForm(prev => ({ ...prev, modules: updatedModules }));
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/erp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          modulesCount: Number(form.modulesCount),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update ERP solution");

      setFeedback({
        type: "success",
        message: `ERP Solution "${form.title}" updated successfully!`,
      });

      router.refresh();
      // Optional: Auto return to catalog after brief delay
      setTimeout(() => {
        router.push("/admin/erp");
      }, 1200);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "An unexpected error occurred while saving.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Breadcrumb & Action Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Link href="/admin" className="hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link href="/admin/erp" className="hover:text-slate-900 transition-colors">
                ERP Solutions
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-extrabold">Edit Solution</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/admin/erp"
                className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                Back to ERP Solutions
              </Link>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Edit ERP Solution
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  form.status === "PUBLISHED"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                {form.status === "PUBLISHED" ? (
                  <>
                    <FiEye className="w-3.5 h-3.5" />
                    Published Live
                  </>
                ) : (
                  <>
                    <FiEyeOff className="w-3.5 h-3.5" />
                    Draft (Hidden)
                  </>
                )}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Modify the enterprise solution details, modular architecture, ROI metrics, and catalog visibility.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/erp-solutions"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition shadow-2xs"
            >
              <FiExternalLink className="w-3.5 h-3.5 text-slate-500" />
              View Public Catalog
            </Link>

            <Link
              href="/admin/erp"
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-2xs"
            >
              Cancel
            </Link>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-black shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Alert Notifications */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-xs border animate-shake ${
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

      {/* Main Edit Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) — Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Primary Solution Details */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0055FF] flex items-center justify-center font-bold">
                <FiLayers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Primary Solution Details
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  Essential identification and categorisation of the ERP solution
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                  Solution Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Field Workforce & Ticket Automation ERP"
                  className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-3 focus:ring-[#0055FF]/15 transition placeholder:text-slate-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                  Industry Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-3 focus:ring-[#0055FF]/15 transition cursor-pointer"
                >
                  {INDUSTRY_CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="text-slate-900 font-semibold">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                  Badge / Feature Highlight
                </label>
                <div className="relative">
                  <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={form.badge || ""}
                    onChange={e => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g. Day-to-Day Operations Solve"
                    className="w-full bg-white text-slate-900 font-semibold text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-3 focus:ring-[#0055FF]/15 transition placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                  Solution Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe key operational problems solved, capabilities, and target business audience..."
                  className="w-full bg-white text-slate-900 font-medium text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-3 focus:ring-[#0055FF]/15 transition leading-relaxed placeholder:text-slate-400"
                />
                <p className="text-[11px] font-semibold text-slate-500 mt-1">
                  Shown in the public ERP solutions directory and detailed product brochure.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Metrics & Economics */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FiTrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Value Metrics & Pricing
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  Quantifiable ROI and commercial package details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* ROI Metric */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                  ROI / Efficiency Metric
                </label>
                <div className="relative">
                  <FiTrendingUp className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={form.roiMetric || ""}
                    onChange={e => setForm({ ...form, roiMetric: e.target.value })}
                    placeholder="e.g. Resolves customer service tickets 3x faster"
                    className="w-full bg-white text-slate-900 font-semibold text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-3 focus:ring-[#0055FF]/15 transition placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Price / Tier */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                  Price / Commercial Tier
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={form.price || ""}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. Custom Enterprise Quote"
                    className="w-full bg-white text-slate-900 font-semibold text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-3 focus:ring-[#0055FF]/15 transition placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Modules Count */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                  Modules Count
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.modulesCount}
                  onChange={e => setForm({ ...form, modulesCount: Number(e.target.value) })}
                  className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-3 focus:ring-[#0055FF]/15 transition"
                />
              </div>

              {/* Demo URL */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                  Demo / Catalog URL
                </label>
                <input
                  type="text"
                  value={form.demoUrl || ""}
                  onChange={e => setForm({ ...form, demoUrl: e.target.value })}
                  placeholder="/erp-solutions"
                  className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-3 focus:ring-[#0055FF]/15 transition placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Core Functional Modules */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FiLayers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Core Functional Modules
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Individual software sub-systems included in this package ({form.modules.length} active)
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Module Pills */}
            <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
              {form.modules.length > 0 ? (
                form.modules.map((mod, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-bold shadow-2xs"
                  >
                    <span>{mod}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove module"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 font-medium italic p-2">
                  No modules added yet. Use the input below to add modules.
                </span>
              )}
            </div>

            {/* Add Module Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newModuleInput}
                onChange={e => setNewModuleInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddModule();
                  }
                }}
                placeholder="Type module name (e.g. Automated Service Tickets) and press Add..."
                className="flex-1 bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-3 focus:ring-[#0055FF]/15 transition placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleAddModule}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                Add Module
              </button>
            </div>

            {/* Quick Bulk Paste */}
            <div className="pt-2">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                Bulk Comma-Separated Input
              </label>
              <input
                type="text"
                value={form.modules.join(", ")}
                onChange={e =>
                  setForm({
                    ...form,
                    modules: e.target.value
                      .split(",")
                      .map(m => m.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full bg-white text-slate-700 font-medium text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0055FF]"
                placeholder="Module 1, Module 2, Module 3..."
              />
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) — Status & Media */}
        <div className="space-y-6">
          {/* Card 4: Publishing Status */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
              Publishing Status
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  form.status === "PUBLISHED"
                    ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="PUBLISHED"
                  checked={form.status === "PUBLISHED"}
                  onChange={() => setForm({ ...form, status: "PUBLISHED" })}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-black text-slate-900">Published (Live)</div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Visible immediately in public ERP directory and client portals.
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  form.status === "DRAFT"
                    ? "bg-amber-50/70 border-amber-300 text-amber-950"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="DRAFT"
                  checked={form.status === "DRAFT"}
                  onChange={() => setForm({ ...form, status: "DRAFT" })}
                  className="mt-1 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-black text-slate-900">Draft (Hidden)</div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Saved in admin CMS only, not publicly discoverable.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Card 5: Hero Thumbnail Image */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Hero Thumbnail Image</span>
              <FiImage className="w-4 h-4 text-slate-400" />
            </h2>

            {/* Thumbnail Preview */}
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group flex items-center justify-center">
              {form.image ? (
                <img
                  src={form.image}
                  alt={form.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-center p-4">
                  <FiImage className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-400">No Image Provided</span>
                </div>
              )}
            </div>

            {/* Upload & URL Input */}
            <div className="space-y-2">
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
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-black transition cursor-pointer disabled:opacity-50"
              >
                <FiUploadCloud className="w-4 h-4 text-[#0055FF]" />
                {isUploadingImage ? "Uploading Image..." : "Upload New Image"}
              </button>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  Or Image URL
                </label>
                <input
                  type="url"
                  value={form.image || ""}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white text-slate-800 font-medium text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] transition placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Card 6: Sticky Action Box */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-sm font-black shadow-md shadow-blue-500/25 transition cursor-pointer disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>

            <Link
              href="/admin/erp"
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition text-center"
            >
              Discard & Return
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
