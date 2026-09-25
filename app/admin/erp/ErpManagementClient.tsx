"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  FiSearch,
  FiPlus,
  FiExternalLink,
  FiEdit2,
  FiTrash2,
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
  "All Industries",
  "Education & Academies",
  "Healthcare & Wellness",
  "Manufacturing & Logistics",
  "Retail & E-Commerce",
  "Corporate & Services",
  "Real Estate & Construction",
  "Daily Operations & Smart Automation",
];

export default function ErpManagementClient({ initialSolutions }: { initialSolutions: ErpProductItem[] }) {
  const [solutions, setSolutions] = useState<ErpProductItem[]>(initialSolutions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Industries");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for New ERP Solution
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Education & Academies");
  const [newBadge, setNewBadge] = useState("Most Popular");
  const [newModulesCount, setNewModulesCount] = useState("12");
  const [newRoiMetric, setNewRoiMetric] = useState("Saves 30+ hrs/wk in manual operations");
  const [newPrice, setNewPrice] = useState("Custom Enterprise Quote");
  const [newDescription, setNewDescription] = useState("");
  const [newModulesInput, setNewModulesInput] = useState("Admin Dashboard, Client Portal, Invoicing & GST, Automated Reporting");
  const [newImage, setNewImage] = useState("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80");
  const [newStatus, setNewStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  const addFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal open
  useEffect(() => {
    if (isAddModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAddModalOpen]);

  // Handle Image File Upload
  const handleImageFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be under 5MB.");
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
          setNewImage(data.url);
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        setNewImage(url);
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        setNewImage(url);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Quick Status Toggle (Publish / Unpublish)
  const handleToggleStatus = async (id: string, currentStatus: "PUBLISHED" | "DRAFT") => {
    const nextStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/admin/erp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setSolutions(prev =>
        prev.map(s => (s.id === id ? { ...s, status: nextStatus } : s))
      );
      setFeedbackMsg({
        type: "success",
        text: `ERP Solution is now ${nextStatus === "PUBLISHED" ? "Live on public catalog" : "Draft"}.`,
      });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "An error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Add New Solution
  const handleAddSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const parsedModules = newModulesInput
        .split(",")
        .map(m => m.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/erp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          badge: newBadge,
          modulesCount: Number(newModulesCount) || parsedModules.length || 12,
          roiMetric: newRoiMetric,
          price: newPrice,
          description: newDescription,
          modules: parsedModules,
          image: newImage,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create ERP solution");

      setSolutions(prev => [data.solution, ...prev]);
      setIsAddModalOpen(false);
      setFeedbackMsg({ type: "success", text: `ERP Solution "${newTitle}" created successfully!` });

      // Reset
      setNewTitle("");
      setNewDescription("");
      setNewBadge("");
      setNewModulesInput("");
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to create solution" });
    } finally {
      setIsSubmitting(false);
    }
  };



  // Handle Delete Solution
  const handleDeleteSolution = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/admin/erp?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete solution");

      setSolutions(prev => prev.filter(s => s.id !== id));
      setFeedbackMsg({ type: "success", text: `"${title}" deleted successfully.` });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to delete solution" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Master Filter & Search Logic
  const filteredSolutions = solutions.filter(item => {
    const matchesCategory =
      selectedCategory === "All Industries" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

    const s = searchTerm.toLowerCase();
    const matchesSearch =
      !s ||
      item.title.toLowerCase().includes(s) ||
      item.description.toLowerCase().includes(s) ||
      (item.category || "").toLowerCase().includes(s) ||
      (item.badge || "").toLowerCase().includes(s) ||
      (item.roiMetric || "").toLowerCase().includes(s) ||
      (item.modules || []).some(m => m.toLowerCase().includes(s));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, statusFilter, itemsPerPage]);

  // Pagination Slicing
  const totalItems = filteredSolutions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredSolutions.slice(startIndex, endIndex);

  // Summary Metrics
  const publishedCount = solutions.filter(s => s.status === "PUBLISHED").length;
  const draftCount = solutions.filter(s => s.status === "DRAFT").length;
  const totalModulesSum = solutions.reduce((acc, s) => acc + (s.modulesCount || s.modules?.length || 0), 0);

  return (
    <div className="space-y-4 pb-20 font-sans">
      {/* Single-Line Action & Filter Bar (Search + All Industries + All Statuses + Add) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Left: Search input, All Industries dropdown, Status filter */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ERP solutions by title, module, industry..."
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-semibold rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 shadow-2xs transition"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Industry Filter Dropdown */}
          <select
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-none focus:border-[#0055FF] shadow-2xs cursor-pointer shrink-0 max-w-[200px]"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {INDUSTRY_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter Dropdown */}
          <select
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-none focus:border-[#0055FF] shadow-2xs cursor-pointer shrink-0"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">All Statuses ({solutions.length})</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
          </select>
        </div>

        {/* Right: Actions (Live Catalog + Add ERP Solution) */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/erp-solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0055FF] border border-[#D4E8F8] transition-all flex items-center gap-1.5 text-xs font-bold shadow-2xs"
            title="View Live Catalog"
          >
            <FiExternalLink className="w-4 h-4" />
            <span className="hidden xl:inline">Live Catalog</span>
          </a>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0055FF] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add ERP Solution</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between gap-3 shadow-xs ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="opacity-60 hover:opacity-100 text-xs font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* DIRECT SOLUTIONS TABLE */}
      <div className="rounded-2xl overflow-hidden shadow-xs bg-white border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-4 font-extrabold">Solution Variant</th>
                <th className="py-3.5 px-4 font-extrabold">Industry Category</th>
                <th className="py-3.5 px-4 font-extrabold">Modules &amp; ROI Impact</th>
                <th className="py-3.5 px-4 font-extrabold">Status</th>
                <th className="py-3.5 px-4 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {currentItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="p-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-12 rounded-xl object-cover shrink-0 border border-slate-200 bg-slate-100"
                        />
                      )}
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{item.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                          {item.description}
                        </div>
                        {item.badge && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Industry Category */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 border border-[#D4E8F8] text-[#0055FF]">
                      {item.category}
                    </span>
                  </td>

                  {/* Modules & ROI Impact */}
                  <td className="p-4 max-w-xs">
                    <div className="text-xs font-bold text-[#0055FF] flex items-center gap-1.5 mb-1">
                      <span>🧩 {item.modulesCount || item.modules?.length || 12} Modules</span>
                    </div>
                    {item.roiMetric && (
                      <div className="text-xs text-emerald-700 font-semibold truncate" title={item.roiMetric}>
                        ⚡ {item.roiMetric}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(item.modules || []).slice(0, 3).map((m, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200/60">
                          {m}
                        </span>
                      ))}
                      {(item.modules?.length || 0) > 3 && (
                        <span className="text-[10px] text-slate-500 font-bold self-center">
                          +{item.modules.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    {item.status === "PUBLISHED" ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Published
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Draft
                      </span>
                    )}
                  </td>

                  {/* Action Icon Buttons */}
                  <td className="p-4 text-right">
                    <div className="flex gap-1.5 justify-end items-center">
                      {/* View in Public Catalog */}
                      <a
                        href={`/erp-solutions#${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0055FF] border border-blue-200 transition-all shadow-2xs"
                        title="View live in ERP catalog"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>

                      {/* Quick Publish / Unpublish Toggle */}
                      <button
                        disabled={isSubmitting}
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`p-2 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                          item.status === "PUBLISHED"
                            ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                        }`}
                        title={item.status === "PUBLISHED" ? "Unpublish to draft" : "Publish live"}
                      >
                        {item.status === "PUBLISHED" ? (
                          <FiEyeOff className="w-4 h-4" />
                        ) : (
                          <FiEye className="w-4 h-4" />
                        )}
                      </button>

                      {/* Edit */}
                      <Link
                        href={`/admin/erp/${item.id}`}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs inline-flex items-center justify-center"
                        title="Edit ERP Solution"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        disabled={isSubmitting}
                        onClick={() => handleDeleteSolution(item.id, item.title)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer shadow-2xs"
                        title="Delete ERP Solution"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                    No ERP solutions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLLER FOOTER (High Contrast) */}
        {totalItems > 0 && (
          <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
            <div>
              Showing <strong className="text-slate-900 font-extrabold">{startIndex + 1}</strong> to{" "}
              <strong className="text-slate-900 font-extrabold">{endIndex}</strong> of{" "}
              <strong className="text-slate-900 font-extrabold">{totalItems}</strong> ERP solutions
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:text-[#0055FF] text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? "bg-[#0055FF] text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:text-[#0055FF] text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD NEW ERP SOLUTION */}
      {mounted &&
        isAddModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
            style={{ margin: 0 }}
            onClick={() => setIsAddModalOpen(false)}
          >
            <div
              className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden m-auto bg-white border border-slate-200"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white shrink-0"
              >
                <div>
                  <h3 className="text-xl font-black text-slate-900">Add ERP Solution</h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    Create and publish a new industry solution suite.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddSolution} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 flex-1 min-h-0 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black mb-1 uppercase tracking-wider text-slate-900">
                        Solution Title *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                        placeholder="e.g. Smart Manufacturing & Supply Chain ERP"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black mb-1 uppercase tracking-wider text-slate-900">
                        Industry Category *
                      </label>
                      <select
                        className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 cursor-pointer"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                      >
                        {INDUSTRY_CATEGORIES.filter(c => c !== "All Industries").map(cat => (
                          <option key={cat} value={cat} className="text-slate-900 font-semibold">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black mb-1 uppercase tracking-wider text-slate-900">
                        Badge (e.g. Best Seller)
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                        placeholder="e.g. Industry 4.0 Ready"
                        value={newBadge}
                        onChange={e => setNewBadge(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black mb-1 uppercase tracking-wider text-slate-900">
                        Modules Count
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10"
                        placeholder="14"
                        value={newModulesCount}
                        onChange={e => setNewModulesCount(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black mb-1 uppercase tracking-wider text-slate-900">
                        Initial Status
                      </label>
                      <select
                        className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 cursor-pointer"
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value as any)}
                      >
                        <option value="PUBLISHED">Published (Live)</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black mb-1 uppercase tracking-wider text-slate-900">
                        ROI / Efficiency Metric Highlight
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                        placeholder="e.g. Boosts shop floor throughput by 32%"
                        value={newRoiMetric}
                        onChange={e => setNewRoiMetric(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black mb-1 uppercase tracking-wider text-slate-900">
                        Pricing / Tier
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                        placeholder="e.g. Custom Enterprise Quote"
                        value={newPrice}
                        onChange={e => setNewPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black mb-1 uppercase tracking-wider text-slate-900">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="w-full bg-white text-slate-900 font-medium text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                      placeholder="Comprehensive breakdown of enterprise operational capabilities..."
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black mb-1 uppercase tracking-wider text-slate-900">
                      Core Functional Modules (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white text-slate-900 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 placeholder:text-slate-400"
                      placeholder="Bill of Materials, Shop Floor Control, Vendor Procurement, Warehouse Stock"
                      value={newModulesInput}
                      onChange={e => setNewModulesInput(e.target.value)}
                    />
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">
                      Separate each module with a comma. These display as interactive badges in the catalog.
                    </p>
                  </div>

                  {/* Thumbnail Image */}
                  <div>
                    <label className="block text-xs font-black mb-1.5 uppercase tracking-wider text-slate-900">
                      Hero Thumbnail Image
                    </label>
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-300 bg-white">
                        {newImage ? (
                          <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-slate-400 flex items-center justify-center h-full">No image</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            ref={addFileInputRef}
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleImageFileUpload(file);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => addFileInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0055FF] text-white hover:bg-blue-600 transition-colors cursor-pointer"
                          >
                            {isUploadingImage ? "Uploading..." : "📁 Upload Image"}
                          </button>
                        </div>
                        <input
                          type="url"
                          className="w-full bg-white text-slate-800 font-medium text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0055FF] placeholder:text-slate-400"
                          placeholder="Or paste image URL"
                          value={newImage}
                          onChange={e => setNewImage(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Footer */}
                <div
                  className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-sm font-black bg-[#0055FF] hover:bg-blue-600 text-white shadow-md shadow-blue-500/25 transition cursor-pointer"
                  >
                    {isSubmitting ? "Creating..." : "Add Solution"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
