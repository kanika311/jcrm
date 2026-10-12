"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiExternalLink,
  FiStar,
  FiGrid,
  FiList,
  FiArrowUp,
  FiArrowDown,
  FiRefreshCw,
  FiUploadCloud,
  FiCheck,
  FiX,
  FiGlobe,
  FiBriefcase,
  FiLayers,
} from "react-icons/fi";
import { ClientProjectItem } from "@/lib/clientsProjectsData";
import { convertImageToWebP } from "@/lib/imageWebp";

const PROJECT_CATEGORIES = [
  "All Categories",
  "Enterprise ERP",
  "DevSecOps & Cloud",
  "Supply Chain & IoT",
  "FinTech Platform",
  "EdTech & LMS",
  "HealthTech",
  "E-Commerce & Retail",
  "AI & Automation",
  "Custom Web Application",
];

const PRESET_IMAGES = [
  { label: "Dashboard / Analytics", url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80" },
  { label: "Code & Engineering", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" },
  { label: "Logistics & Fleet", url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" },
  { label: "FinTech & Payments", url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80" },
  { label: "LMS & Learning", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" },
  { label: "Healthcare & Med", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" },
  { label: "Mobile / Responsive", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" },
  { label: "Cloud Architecture", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
];

export default function ClientsProjectsClient({
  initialProjects,
}: {
  initialProjects: ClientProjectItem[];
}) {
  const [projects, setProjects] = useState<ClientProjectItem[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProjectItem | null>(null);
  const [deletingProject, setDeletingProject] = useState<ClientProjectItem | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    category: "Enterprise ERP",
    badge: "Enterprise Scaled",
    description: "",
    image: PRESET_IMAGES[0].url,
    logo: "",
    projectUrl: "/erp-solutions",
    techStackText: "Next.js, TypeScript, PostgreSQL, Docker, AWS",
    stats: "15k+ Users • 99.9% Uptime",
    featured: true,
    status: "PUBLISHED" as "PUBLISHED" | "DRAFT",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when any modal is open
  useEffect(() => {
    if (isAddModalOpen || editingProject || deletingProject || isResetConfirmOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isAddModalOpen, editingProject, deletingProject, isResetConfirmOpen]);

  const showNotification = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      projectName: "",
      clientName: "",
      category: "Enterprise ERP",
      badge: "Enterprise Scaled",
      description: "",
      image: PRESET_IMAGES[0].url,
      logo: "",
      projectUrl: "/erp-solutions",
      techStackText: "Next.js, TypeScript, PostgreSQL, Docker, AWS",
      stats: "10k+ Users • 99.9% Uptime",
      featured: true,
      status: "PUBLISHED",
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (project: ClientProjectItem) => {
    setFormData({
      projectName: project.projectName,
      clientName: project.clientName,
      category: project.category,
      badge: project.badge || "",
      description: project.description,
      image: project.image,
      logo: project.logo || "",
      projectUrl: project.projectUrl || "",
      techStackText: project.techStack.join(", "),
      stats: project.stats || "",
      featured: Boolean(project.featured),
      status: project.status,
    });
    setEditingProject(project);
  };

  // Handle Image Upload via API with automatic WebP conversion from device media
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, isLogo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      showNotification("error", "Image must be less than 20MB");
      return;
    }

    if (isLogo) setIsUploadingLogo(true);
    else setIsUploadingImage(true);

    try {
      // Convert device photo to WebP format
      const webpFile = await convertImageToWebP(file, {
        maxWidth: isLogo ? 600 : 1920,
        maxHeight: isLogo ? 600 : 1080,
        quality: 0.88,
      });

      const data = new FormData();
      data.append("file", webpFile);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Upload failed");
      }

      const json = await res.json();
      const uploadedUrl = json.url;

      if (isLogo) {
        setFormData((prev) => ({ ...prev, logo: uploadedUrl }));
        showNotification("success", "Logo converted to WebP & uploaded!");
      } else {
        setFormData((prev) => ({ ...prev, image: uploadedUrl }));
        showNotification("success", "Photo converted to WebP & uploaded!");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to upload image");
    } finally {
      if (isLogo) setIsUploadingLogo(false);
      else setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  // Submit Create New
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName.trim() || !formData.clientName.trim()) {
      showNotification("error", "Project Name and Client Name are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const techStack = formData.techStackText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/clients-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: formData.projectName,
          clientName: formData.clientName,
          category: formData.category,
          badge: formData.badge,
          description: formData.description,
          image: formData.image,
          logo: formData.logo,
          projectUrl: formData.projectUrl,
          techStack,
          stats: formData.stats,
          featured: formData.featured,
          status: formData.status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create project");

      setProjects(data.projects);
      setIsAddModalOpen(false);
      showNotification("success", `Project "${formData.projectName}" added to home showcase!`);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (!formData.projectName.trim() || !formData.clientName.trim()) {
      showNotification("error", "Project Name and Client Name are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const techStack = formData.techStackText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/clients-projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProject.id,
          projectName: formData.projectName,
          clientName: formData.clientName,
          category: formData.category,
          badge: formData.badge,
          description: formData.description,
          image: formData.image,
          logo: formData.logo,
          projectUrl: formData.projectUrl,
          techStack,
          stats: formData.stats,
          featured: formData.featured,
          status: formData.status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update project");

      setProjects(data.projects);
      setEditingProject(null);
      showNotification("success", `Project "${formData.projectName}" updated successfully!`);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Delete
  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/clients-projects?id=${deletingProject.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete project");

      setProjects(data.projects);
      showNotification("success", `Project "${deletingProject.projectName}" deleted.`);
      setDeletingProject(null);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Status directly (Publish / Draft)
  const handleToggleStatus = async (project: ClientProjectItem) => {
    const nextStatus = project.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch("/api/admin/clients-projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to toggle status");
      setProjects(data.projects);
      showNotification("success", `Status updated to ${nextStatus}`);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to update status");
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (project: ClientProjectItem) => {
    const nextFeatured = !project.featured;
    try {
      const res = await fetch("/api/admin/clients-projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          featured: nextFeatured,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update featured flag");
      setProjects(data.projects);
      showNotification(
        "success",
        nextFeatured ? "Marked as Featured on Home" : "Removed from Featured"
      );
    } catch (err: any) {
      showNotification("error", err.message || "Failed to update featured flag");
    }
  };

  // Reorder Item (Up or Down)
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Optimistically update
    setProjects(reordered);

    try {
      const res = await fetch("/api/admin/clients-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          projects: reordered,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save order");
      setProjects(data.projects);
      showNotification("success", "Display order saved");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to save reorder");
    }
  };

  // Reset to Demo Defaults
  const handleResetDefaults = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/clients-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-defaults" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset");
      setProjects(data.projects);
      setIsResetConfirmOpen(false);
      showNotification("success", "Reset to original showcase projects successfully!");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to reset defaults");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "All Categories" ||
      p.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.status === "PUBLISHED").length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const clientCount = new Set(projects.map((p) => p.clientName)).size;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-bold backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            feedback.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
              : "bg-rose-950/90 border-rose-500/30 text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <FiCheck className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <FiX className="w-3.5 h-3.5" />
            </div>
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 border border-slate-700/80 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider">
              <FiGlobe className="w-3.5 h-3.5" />
              <span>Home Showcase CMS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Our Clients & Projects CMS
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
              Manage client portfolio engagements, technology projects, live scrollbar showcase,
              and featured case studies displayed on the JCRM Home Page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white transition-all shadow-sm"
            >
              <FiExternalLink className="w-3.5 h-3.5" />
              <span>Preview on Home</span>
            </Link>

            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/80 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0055FF] to-blue-600 hover:from-blue-600 hover:to-[#0055FF] text-white text-xs font-black shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <FiPlus className="w-4 h-4 stroke-[3]" />
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Projects</span>
            <div className="text-2xl font-black text-white">{totalCount}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
            <span className="text-xs font-semibold text-emerald-400 block mb-1">Published</span>
            <div className="text-2xl font-black text-emerald-400">{publishedCount}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
            <span className="text-xs font-semibold text-amber-400 block mb-1">Featured on Home</span>
            <div className="text-2xl font-black text-amber-400">{featuredCount}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
            <span className="text-xs font-semibold text-blue-400 block mb-1">Partner Clients</span>
            <div className="text-2xl font-black text-blue-400">{clientCount}</div>
          </div>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects, client names, tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-all bg-slate-50/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-all cursor-pointer"
          >
            {PROJECT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] transition-all cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Draft Only</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="Grid View"
          >
            <FiGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="Table View"
          >
            <FiList className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0055FF] mx-auto flex items-center justify-center">
            <FiGlobe className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching projects found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query, or add a brand new client project using the button below.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0055FF] text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create First Project</span>
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => {
            const actualIndex = projects.findIndex((p) => p.id === project.id);
            return (
              <div
                key={project.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Project Image & Badges */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.projectName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top floating badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-900 shadow-sm">
                      {project.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Featured button */}
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          project.featured
                            ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30"
                            : "bg-black/40 text-white/70 hover:text-white"
                        }`}
                        title={project.featured ? "Featured on Home" : "Make Featured"}
                      >
                        <FiStar className={`w-3.5 h-3.5 ${project.featured ? "fill-current" : ""}`} />
                      </button>

                      {/* Status badge button */}
                      <button
                        onClick={() => handleToggleStatus(project)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                          project.status === "PUBLISHED"
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "bg-slate-700 text-slate-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {project.status}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Image Overlay text */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                    {project.logo && (
                      <img
                        src={project.logo}
                        alt="Logo"
                        className="w-7 h-7 rounded-lg object-cover bg-white p-0.5 border border-white/50 shrink-0"
                      />
                    )}
                    <span className="text-white text-xs font-bold truncate drop-shadow-sm">
                      {project.clientName}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {project.badge && (
                      <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#0055FF] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {project.badge}
                      </span>
                    )}

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0055FF] transition-colors line-clamp-1">
                      {project.projectName}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack & stats */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    {project.stats && (
                      <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{project.stats}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Reordering Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Order buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(actualIndex, "up")}
                        disabled={actualIndex === 0}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Up"
                      >
                        <FiArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(actualIndex, "down")}
                        disabled={actualIndex === projects.length - 1}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Down"
                      >
                        <FiArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {project.projectUrl && (
                        <Link
                          href={project.projectUrl}
                          target="_blank"
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Visit Link"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </Link>
                      )}

                      <button
                        onClick={() => openEditModal(project)}
                        className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingProject(project)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && filteredProjects.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Project & Client</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Tech Stack</th>
                  <th className="py-3.5 px-4">Stats / Impact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProjects.map((project, idx) => {
                  const actualIndex = projects.findIndex((p) => p.id === project.id);
                  return (
                    <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            onClick={() => handleMoveOrder(actualIndex, "up")}
                            disabled={actualIndex === 0}
                            className="text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                          >
                            <FiArrowUp className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-bold text-slate-400">{idx + 1}</span>
                          <button
                            onClick={() => handleMoveOrder(actualIndex, "down")}
                            disabled={actualIndex === projects.length - 1}
                            className="text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                          >
                            <FiArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={project.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">
                              {project.projectName}
                            </div>
                            <div className="text-slate-500 text-[11px] truncate flex items-center gap-1.5 mt-0.5">
                              <span>Client: {project.clientName}</span>
                              {project.featured && (
                                <span className="text-amber-500 font-bold flex items-center gap-0.5">
                                  <FiStar className="w-3 h-3 fill-current" />
                                  <span>Featured</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#0055FF] border border-blue-100">
                          {project.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {project.techStack.slice(0, 3).map((t, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                              {t}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="text-[10px] text-slate-400">
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 text-xs font-semibold">
                          {project.stats || "—"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(project)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                            project.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {project.status}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(project)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProject(project)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE & EDIT MODAL */}
      {mounted &&
        (isAddModalOpen || editingProject) &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center font-bold">
                    <FiBriefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {editingProject ? "Edit Client & Project" : "Add New Client & Project"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure details, imagery, tech stack, and homepage visibility
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <form
                  id="projectForm"
                  onSubmit={editingProject ? handleEditSubmit : handleCreateSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Project Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Project Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Enterprise Cloud ERP & Talent Ecosystem"
                        value={formData.projectName}
                        onChange={(e) =>
                          setFormData({ ...formData, projectName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF]"
                      />
                    </div>

                    {/* Client Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Client / Organization <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tata Consultancy Services (TCS)"
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData({ ...formData, clientName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF]"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF] bg-white cursor-pointer"
                      >
                        {PROJECT_CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Badge */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Highlight Badge
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Enterprise Scaled, AI-Powered, Live Production"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Short Description / Overview
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief summary of the outcome, scale, or feature delivered..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF]"
                    />
                  </div>

                  {/* Image & Logo Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    {/* Cover Image */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Cover Image URL</label>
                          <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Auto WebP
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingImage}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0055FF] hover:underline cursor-pointer disabled:opacity-50"
                        >
                          <FiUploadCloud className="w-3.5 h-3.5" />
                          <span>{isUploadingImage ? "Converting to WebP..." : "Upload from Device"}</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadImage(e, false)}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="https://... or upload from device"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 bg-white"
                      />

                      {/* Image Preview & Quick presets */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="relative shrink-0">
                          <img
                            src={formData.image}
                            alt="Cover"
                            className="w-16 h-12 rounded-lg object-cover border border-slate-200"
                            onError={(e) => {
                              (e.target as any).src = PRESET_IMAGES[0].url;
                            }}
                          />
                          {(formData.image?.includes(".webp") || formData.image?.startsWith("data:image/webp")) && (
                            <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[8px] font-extrabold px-1 rounded-tl">
                              WEBP
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          <span className="font-semibold block mb-0.5">Quick Presets:</span>
                          <div className="flex flex-wrap gap-1">
                            {PRESET_IMAGES.slice(0, 4).map((preset, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setFormData({ ...formData, image: preset.url })}
                                className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-[#0055FF] cursor-pointer"
                              >
                                {preset.label.split(" ")[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Client Logo */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Client Logo (Optional)</label>
                          <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Auto WebP
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={isUploadingLogo}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0055FF] hover:underline cursor-pointer disabled:opacity-50"
                        >
                          <FiUploadCloud className="w-3.5 h-3.5" />
                          <span>{isUploadingLogo ? "Converting to WebP..." : "Upload Logo"}</span>
                        </button>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadImage(e, true)}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="https://... or upload from device"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 bg-white"
                      />
                      {formData.logo ? (
                        <div className="flex items-center gap-2 pt-1">
                          <div className="relative shrink-0">
                            <img
                              src={formData.logo}
                              alt="Logo"
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white"
                            />
                            {(formData.logo?.includes(".webp") || formData.logo?.startsWith("data:image/webp")) && (
                              <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[8px] font-extrabold px-1 rounded-tl">
                                WEBP
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">Logo selected (WebP)</span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400">
                          If omitted, a handsome monogram avatar will be automatically created from client name.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tech stack, stats, URL */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Tech Stack */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Technologies / Tech Stack (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Next.js, TypeScript, PostgreSQL, Docker, AWS"
                        value={formData.techStackText}
                        onChange={(e) =>
                          setFormData({ ...formData, techStackText: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF]"
                      />
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {formData.techStackText
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0055FF] text-[10px] font-bold border border-blue-100"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Stats / Metric */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Key Metric / Impact Stat
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 15k+ Users • 99.9% Uptime"
                        value={formData.stats}
                        onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 focus:border-[#0055FF]"
                      />
                    </div>
                  </div>

                  {/* Live URL, Featured, Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Demo / Project URL
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /erp-solutions or https://..."
                        value={formData.projectUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, projectUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value as any })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white cursor-pointer"
                      >
                        <option value="PUBLISHED">PUBLISHED (Visible)</option>
                        <option value="DRAFT">DRAFT (Hidden)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 pt-4 sm:pt-2">
                      <label className="relative flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData({ ...formData, featured: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-[#0055FF] focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Mark as Featured on Home
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Live Homepage Card Preview */}
                  <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#0055FF] block mb-2">
                      Live Preview (How it appears in Homepage Scrollbar):
                    </span>
                    <div className="max-w-sm mx-auto p-4 rounded-2xl bg-white border border-slate-200/80 shadow-md">
                      <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 relative mb-3">
                        <img
                          src={formData.image || PRESET_IMAGES[0].url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/90 text-slate-900">
                            {formData.category}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-slate-500">
                          {formData.clientName || "Client Name"}
                        </div>
                        <div className="text-sm font-extrabold text-slate-900 truncate">
                          {formData.projectName || "Project Title"}
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {formData.description || "Project summary..."}
                        </p>
                        {formData.stats && (
                          <div className="text-[10px] font-bold text-emerald-600 pt-1">
                            {formData.stats}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="projectForm"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0055FF] to-blue-600 hover:from-blue-600 hover:to-[#0055FF] text-white text-xs font-black shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingProject
                    ? "Save Changes"
                    : "Create Project"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* DELETE CONFIRMATION MODAL */}
      {mounted &&
        deletingProject &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <FiTrash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-slate-900">Delete Project?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove{" "}
                  <strong className="text-slate-800 font-bold">
                    &quot;{deletingProject.projectName}&quot;
                  </strong>{" "}
                  from the home showcase? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingProject(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Delete Project"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* RESET CONFIRMATION MODAL */}
      {mounted &&
        isResetConfirmOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0055FF] flex items-center justify-center mx-auto">
                <FiRefreshCw className="w-6 h-6" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-slate-900">Reset Demo Showcase?</h3>
                <p className="text-xs text-slate-500">
                  This will reload the 6 enterprise demo projects (TCS, CodeAssure, Apex Logistics,
                  FinVantage, EduSphere, MediPulse) into the database.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetDefaults}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Resetting..." : "Confirm Reset"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
