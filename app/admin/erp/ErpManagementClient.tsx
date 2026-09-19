"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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
  const [editingSolution, setEditingSolution] = useState<ErpProductItem | null>(null);

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
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal open
  useEffect(() => {
    if (isAddModalOpen || editingSolution) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAddModalOpen, editingSolution]);

  // Handle Image File Upload
  const handleImageFileUpload = async (file: File, target: "add" | "edit") => {
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
          if (target === "add") setNewImage(data.url);
          else if (editingSolution) setEditingSolution({ ...editingSolution, image: data.url });
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        if (target === "add") setNewImage(url);
        else if (editingSolution) setEditingSolution({ ...editingSolution, image: url });
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        if (target === "add") setNewImage(url);
        else if (editingSolution) setEditingSolution({ ...editingSolution, image: url });
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

  // Handle Edit Solution Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSolution) return;
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/admin/erp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSolution),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update ERP solution");

      setSolutions(prev =>
        prev.map(s => (s.id === editingSolution.id ? { ...s, ...editingSolution } : s))
      );
      setEditingSolution(null);
      setFeedbackMsg({ type: "success", text: `"${editingSolution.title}" updated successfully!` });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to update solution" });
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
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="heading-font text-3xl font-extrabold mb-2">ERP Solutions CMS</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Create, modify industry solution suites, edit modules & ROI metrics, and manage live catalog variants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/erp-solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0055FF]/15 hover:bg-[#0055FF]/25 text-[#38bdf8] border border-[#0055FF]/30 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Live Catalog</span>
            <span className="text-xs">↗</span>
          </a>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <span className="text-lg leading-none">+</span> Add ERP Solution
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className="p-5 rounded-2xl border"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
            📦 Total Solutions
          </span>
          <div className="text-3xl font-extrabold text-white">{solutions.length}</div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Across all industries</p>
        </div>

        <div
          className="p-5 rounded-2xl border"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
            ✅ Published Live
          </span>
          <div className="text-3xl font-extrabold text-white">{publishedCount}</div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Live on /erp-solutions</p>
        </div>

        <div
          className="p-5 rounded-2xl border"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
            📝 Drafts
          </span>
          <div className="text-3xl font-extrabold text-white">{draftCount}</div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Under review / preparation</p>
        </div>

        <div
          className="p-5 rounded-2xl border"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-2">
            🧩 Functional Modules
          </span>
          <div className="text-3xl font-extrabold text-white">{totalModulesSum}+</div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Total configured modules</p>
        </div>
      </div>

      {/* MASTER SEARCH & FILTERS BAR */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Master Search Input */}
          <div className="relative w-full lg:w-96">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Master Search (title, module, metric, industry)..."
              className="input-premium w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters: Industry + Status + Per Page */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Category Filter */}
            <select
              className="select-premium px-3.5 py-2.5 rounded-xl text-xs font-semibold flex-1 sm:flex-none"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {INDUSTRY_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="select-premium px-3.5 py-2.5 rounded-xl text-xs font-semibold"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
            >
              <option value="ALL">All Statuses ({solutions.length})</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Drafts Only</option>
            </select>

            {/* Items Per Page */}
            <select
              className="select-premium px-3 py-2.5 rounded-xl text-xs font-semibold"
              value={itemsPerPage}
              onChange={e => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={15}>15 / page</option>
              <option value={25}>25 / page</option>
            </select>
          </div>
        </div>

        {/* Industry Pill Quick Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Filter:
          </span>
          {INDUSTRY_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg shrink-0 font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#0055FF] text-white shadow-xs"
                  : "bg-white/5 hover:bg-white/10 text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between gap-3 ${
            feedbackMsg.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="opacity-60 hover:opacity-100 text-xs font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* SOLUTIONS TABLE */}
      <div
        className="rounded-[24px] overflow-hidden shadow-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
      >
        <div className="overflow-x-auto">
          <table className="data-table w-full text-left">
            <thead>
              <tr
                className="border-b text-xs uppercase"
                style={{ borderColor: "var(--border-soft)", color: "var(--text-secondary)" }}
              >
                <th className="p-4 font-bold">Solution Variant</th>
                <th className="p-4 font-bold">Industry Category</th>
                <th className="p-4 font-bold">Modules & ROI Impact</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
              {currentItems.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="p-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-12 rounded-xl object-cover shrink-0 border border-white/10 bg-black/20"
                        />
                      )}
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </div>
                        {item.badge && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Industry Category */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-200">
                      {item.category}
                    </span>
                  </td>

                  {/* Modules & ROI Impact */}
                  <td className="p-4 max-w-xs">
                    <div className="text-xs font-bold text-[#38bdf8] flex items-center gap-1.5 mb-1">
                      <span>🧩 {item.modulesCount || item.modules?.length || 12} Modules</span>
                    </div>
                    {item.roiMetric && (
                      <div className="text-[11px] text-emerald-400 font-semibold truncate" title={item.roiMetric}>
                        ⚡ {item.roiMetric}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(item.modules || []).slice(0, 3).map((m, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-[10px] rounded bg-white/5 text-slate-300">
                          {m}
                        </span>
                      ))}
                      {(item.modules?.length || 0) > 3 && (
                        <span className="text-[10px] text-slate-400 font-semibold self-center">
                          +{item.modules.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    {item.status === "PUBLISHED" ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Published
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Draft
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end items-center">
                      <a
                        href={`/erp-solutions#${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0055FF]/15 hover:bg-[#0055FF]/25 text-[#38bdf8] border border-[#0055FF]/30 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        title="View live in ERP catalog"
                      >
                        <span>View</span>
                        <span className="text-[10px]">↗</span>
                      </a>

                      <button
                        disabled={isSubmitting}
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          item.status === "PUBLISHED"
                            ? "bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/30"
                        }`}
                        title={item.status === "PUBLISHED" ? "Unpublish to draft" : "Publish live"}
                      >
                        {item.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        onClick={() => setEditingSolution(item)}
                        className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        disabled={isSubmitting}
                        onClick={() => handleDeleteSolution(item.id, item.title)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Delete ERP Solution"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    No ERP solutions found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLLER FOOTER */}
        {totalItems > 0 && (
          <div
            className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400"
            style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
          >
            <div>
              Showing <span className="text-white font-bold">{startIndex + 1}</span> to{" "}
              <span className="text-white font-bold">{endIndex}</span> of{" "}
              <span className="text-white font-bold">{totalItems}</span> ERP solutions
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                        ? "bg-[#0055FF] text-white shadow-sm"
                        : "hover:bg-white/10 text-slate-400"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
              className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden m-auto"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex justify-between items-center px-6 py-4 border-b shrink-0"
                style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
              >
                <div>
                  <h3 className="text-xl font-bold">Add ERP Solution</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Create and publish a new industry solution suite.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddSolution} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 flex-1 min-h-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Solution Title *
                      </label>
                      <input
                        type="text"
                        required
                        className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                        placeholder="e.g. Smart Manufacturing & Supply Chain ERP"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Industry Category *
                      </label>
                      <select
                        className="select-premium w-full px-4 py-2.5 rounded-xl text-sm"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                      >
                        {INDUSTRY_CATEGORIES.filter(c => c !== "All Industries").map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Badge (e.g. Best Seller)
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="e.g. Industry 4.0 Ready"
                        value={newBadge}
                        onChange={e => setNewBadge(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Modules Count
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="14"
                        value={newModulesCount}
                        onChange={e => setNewModulesCount(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Initial Status
                      </label>
                      <select
                        className="select-premium w-full px-4 py-2 rounded-xl text-sm"
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
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        ROI / Efficiency Metric Highlight
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="e.g. Boosts shop floor throughput by 32%"
                        value={newRoiMetric}
                        onChange={e => setNewRoiMetric(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Pricing / Tier
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="e.g. Custom Enterprise Quote"
                        value={newPrice}
                        onChange={e => setNewPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="input-premium w-full px-4 py-2.5 rounded-xl text-xs"
                      placeholder="Comprehensive breakdown of enterprise operational capabilities..."
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                      Core Functional Modules (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                      placeholder="Bill of Materials, Shop Floor Control, Vendor Procurement, Warehouse Stock"
                      value={newModulesInput}
                      onChange={e => setNewModulesInput(e.target.value)}
                    />
                    <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
                      Separate each module with a comma. These display as interactive badges in the catalog.
                    </p>
                  </div>

                  {/* Thumbnail Image */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase text-slate-300">
                      Hero Thumbnail Image
                    </label>
                    <div className="flex items-center gap-4 p-3 rounded-xl border" style={{ background: "var(--bg-base)", borderColor: "var(--border-soft)" }}>
                      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black/20">
                        {newImage ? (
                          <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-500 flex items-center justify-center h-full">No image</span>
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
                              if (file) handleImageFileUpload(file, "add");
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
                          className="input-premium w-full px-3 py-1.5 rounded-lg text-xs"
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
                  className="px-6 py-4 border-t flex justify-end gap-3 shrink-0"
                  style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
                >
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? "Creating..." : "Add Solution"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL: EDIT ERP SOLUTION */}
      {mounted &&
        editingSolution &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
            style={{ margin: 0 }}
            onClick={() => setEditingSolution(null)}
          >
            <div
              className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden m-auto"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex justify-between items-center px-6 py-4 border-b shrink-0"
                style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
              >
                <div>
                  <h3 className="text-xl font-bold">Edit ERP Solution</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Update solution details, modules, metric, and publishing status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingSolution(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 flex-1 min-h-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Solution Title *
                      </label>
                      <input
                        type="text"
                        required
                        className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                        value={editingSolution.title}
                        onChange={e => setEditingSolution({ ...editingSolution, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Industry Category *
                      </label>
                      <select
                        className="select-premium w-full px-4 py-2.5 rounded-xl text-sm"
                        value={editingSolution.category}
                        onChange={e => setEditingSolution({ ...editingSolution, category: e.target.value })}
                      >
                        {INDUSTRY_CATEGORIES.filter(c => c !== "All Industries").map(cat => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Badge
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={editingSolution.badge || ""}
                        onChange={e => setEditingSolution({ ...editingSolution, badge: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Modules Count
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={editingSolution.modulesCount}
                        onChange={e => setEditingSolution({ ...editingSolution, modulesCount: Number(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Status
                      </label>
                      <select
                        className="select-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={editingSolution.status}
                        onChange={e => setEditingSolution({ ...editingSolution, status: e.target.value as any })}
                      >
                        <option value="PUBLISHED">Published (Live)</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        ROI / Efficiency Metric
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={editingSolution.roiMetric || ""}
                        onChange={e => setEditingSolution({ ...editingSolution, roiMetric: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Price / Tier
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={editingSolution.price || ""}
                        onChange={e => setEditingSolution({ ...editingSolution, price: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="input-premium w-full px-4 py-2.5 rounded-xl text-xs"
                      value={editingSolution.description}
                      onChange={e => setEditingSolution({ ...editingSolution, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                      Core Functional Modules (comma-separated) *
                    </label>
                    <input
                      type="text"
                      className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                      value={Array.isArray(editingSolution.modules) ? editingSolution.modules.join(", ") : editingSolution.modules || ""}
                      onChange={e =>
                        setEditingSolution({
                          ...editingSolution,
                          modules: e.target.value.split(",").map(m => m.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>

                  {/* Thumbnail Image */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase text-slate-300">
                      Hero Thumbnail Image
                    </label>
                    <div className="flex items-center gap-4 p-3 rounded-xl border" style={{ background: "var(--bg-base)", borderColor: "var(--border-soft)" }}>
                      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black/20">
                        {editingSolution.image ? (
                          <img src={editingSolution.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-500 flex items-center justify-center h-full">No image</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            ref={editFileInputRef}
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleImageFileUpload(file, "edit");
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0055FF] text-white hover:bg-blue-600 transition-colors cursor-pointer"
                          >
                            {isUploadingImage ? "Uploading..." : "📁 Upload Image"}
                          </button>
                        </div>
                        <input
                          type="url"
                          className="input-premium w-full px-3 py-1.5 rounded-lg text-xs"
                          placeholder="Or paste image URL"
                          value={editingSolution.image || ""}
                          onChange={e => setEditingSolution({ ...editingSolution, image: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Footer */}
                <div
                  className="px-6 py-4 border-t flex justify-end gap-3 shrink-0"
                  style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
                >
                  <button
                    type="button"
                    onClick={() => setEditingSolution(null)}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
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
