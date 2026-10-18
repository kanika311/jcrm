"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { SponsoredAd, DEFAULT_SPONSORED_AD } from "@/lib/sponsoredAd";
import SponsoredAdModal from "@/components/SponsoredAdModal";
import { normalizeTeamStatus, TEAM_STATUSES, TEAM_STATUS_LABELS, type TeamStatus } from "@/lib/teamStatus";
import NameAvatar from "@/components/NameAvatar";
import { convertImageToWebP } from "@/lib/imageWebp";

export interface TeamMemberItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  department?: string | null;
  image?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pinCode?: string | null;
  dateOfBirth?: string | null;
  college?: string | null;
  education?: string | null;
  experience?: string | null;
  skills: string[];
  bio?: string | null;
  company?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANDIDATE" | "STUDENT" | "PLACED" | "ALUMNI";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TeamManagementClient({
  initialMembers,
  initialPlacedCandidates = [],
  initialSponsoredAd,
}: {
  initialMembers: TeamMemberItem[];
  initialPlacedCandidates?: any[];
  initialSponsoredAd?: SponsoredAd;
}) {
  const [members, setMembers] = useState<TeamMemberItem[]>(initialMembers);
  const [activeTab, setActiveTab] = useState<"ALL" | "CANDIDATE" | "STUDENT" | "PLACED" | "ALUMNI">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Placed Candidates State (Synced with Home Page)
  const [placedList, setPlacedList] = useState<any[]>(initialPlacedCandidates);
  const [placementModalMember, setPlacementModalMember] = useState<TeamMemberItem | null>(null);
  const [placementCompany, setPlacementCompany] = useState("");
  const [placementRole, setPlacementRole] = useState("");
  const [placementPackage, setPlacementPackage] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSponsoredModalOpen, setIsSponsoredModalOpen] = useState(false);
  const [sponsoredAd, setSponsoredAd] = useState<SponsoredAd>(
    initialSponsoredAd || DEFAULT_SPONSORED_AD
  );

  // Form states for New Member
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("Software Engineering Intern");
  const [newDepartment, setNewDepartment] = useState("AI/ML Engineering");
  const [newCity, setNewCity] = useState("Udupi");
  const [newState, setNewState] = useState("Karnataka");
  const [newCountry, setNewCountry] = useState("India");
  const [newCollege, setNewCollege] = useState("");
  const [newEducation, setNewEducation] = useState("");
  const [newExperience, setNewExperience] = useState("Fresher / Intern");
  const [newSkills, setNewSkills] = useState("Python, React, Machine Learning");
  const [newBio, setNewBio] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newStatus, setNewStatus] = useState<"CANDIDATE" | "STUDENT" | "PLACED" | "ALUMNI">("STUDENT");
  const [newIsVerified, setNewIsVerified] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  const addFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!initialSponsoredAd) {
      fetch("/api/admin/sponsored")
        .then((res) => res.json())
        .then((data) => {
          if (data?.ad) setSponsoredAd(data.ad);
        })
        .catch((err) => console.error("Failed to load sponsored ad:", err));
    }
  }, [initialSponsoredAd]);

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (isAddModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAddModalOpen]);

  // Handle Image File Upload with WebP Compression
  const handleImageFileUpload = async (file: File, target: "add" | "edit") => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert("Image size should be under 15MB.");
      return;
    }

    setIsUploadingImage(true);
    try {
      // Auto convert to optimized WebP on device
      const webpFile = await convertImageToWebP(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
      }).catch(() => file);

      const formData = new FormData();
      formData.append("file", webpFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          if (target === "add") setNewImage(data.url);
          return;
        }
      }
      alert("Failed to upload image. Please try again.");
    } catch (err: any) {
      alert(err.message || "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Placed candidates helpers
  const getPlacementInfo = (member: TeamMemberItem) => {
    return placedList.find(
      (p) =>
        (p.memberId && p.memberId === member.id) ||
        p.name.toLowerCase() === member.name.toLowerCase()
    );
  };

  const openPlacementModal = (member: TeamMemberItem) => {
    const existing = getPlacementInfo(member);
    setPlacementModalMember(member);
    setPlacementCompany(existing?.company || "");
    setPlacementRole(existing?.role || member.role || "Software Engineer");
    setPlacementPackage(existing?.package || "");
  };

  const handleSavePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placementModalMember) return;
    if (!placementCompany.trim()) {
      alert("Please enter the placed company name.");
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/admin/team/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: placementModalMember.id,
          name: placementModalMember.name,
          role: placementRole || placementModalMember.role,
          company: placementCompany.trim(),
          package: placementPackage.trim(),
          image: placementModalMember.image,
          isPlaced: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save placement");

      await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: placementModalMember.id,
          status: "PLACED",
          company: placementCompany.trim(),
        }),
      });
      setMembers((prev) =>
        prev.map((m) =>
          m.id === placementModalMember.id
            ? { ...m, status: "PLACED", company: placementCompany.trim() }
            : m
        )
      );
      setPlacedList(data.candidates);
      setPlacementModalMember(null);
      setFeedbackMsg({
        type: "success",
        text: `"${placementModalMember.name}" marked as Placed at ${placementCompany.trim()}! Successfully updated on the Home Page.`,
      });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to update placement" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnmarkPlacement = async (member: TeamMemberItem) => {
    if (!window.confirm(`Unmark "${member.name}" from Placed Candidates? They will be removed from the Home Page carousel.`)) {
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/admin/team/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member.id,
          name: member.name,
          isPlaced: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to unmark placement");

      await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, status: "STUDENT" }),
      });
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, status: "STUDENT" } : m))
      );
      setPlacedList(data.candidates);
      setFeedbackMsg({
        type: "success",
        text: `"${member.name}" removed from Placed Candidates on the Home Page.`,
      });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to unmark placement" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMemberActive = (m: TeamMemberItem) => {
    return normalizeTeamStatus(m.status) !== "CANDIDATE" && m.isVerified !== false;
  };

  const handleToggleActive = async (member: TeamMemberItem) => {
    const currentlyActive = isMemberActive(member);
    const nextActive = !currentlyActive;
    const nextStatus = nextActive
      ? (normalizeTeamStatus(member.status) === "CANDIDATE" ? "STUDENT" : member.status)
      : "CANDIDATE";

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: member.id,
          status: nextStatus,
          isVerified: nextActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? { ...m, status: nextStatus as any, isVerified: nextActive }
            : m
        )
      );
      setFeedbackMsg({
        type: "success",
        text: nextActive
          ? `"${member.name}" is now Active (visible on site).`
          : `"${member.name}" is now Inactive (hidden from site).`,
      });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to update status" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = async (member: TeamMemberItem, nextStatus: TeamStatus) => {
    if (normalizeTeamStatus(member.status) === nextStatus) return;
    if (nextStatus === "PLACED") {
      openPlacementModal(member);
      return;
    }
    const isActivating = nextStatus !== "CANDIDATE";
    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: member.id,
          status: nextStatus,
          isVerified: isActivating,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? { ...m, status: nextStatus, isVerified: isActivating }
            : m
        )
      );
      setFeedbackMsg({
        type: "success",
        text: `"${member.name}" updated to ${TEAM_STATUS_LABELS[nextStatus] || nextStatus}.`,
      });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "An error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Add New Member Form Submit
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone,
          role: newRole,
          department: newDepartment,
          city: newCity,
          state: newState,
          country: newCountry,
          college: newCollege,
          education: newEducation,
          experience: newExperience,
          skills: newSkills,
          bio: newBio,
          image: newImage,
          status: newStatus,
          isVerified: newIsVerified,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add member");

      setMembers(prev => [data.member, ...prev]);
      setIsAddModalOpen(false);
      setFeedbackMsg({ type: "success", text: `Team member "${newName}" created successfully!` });

      // Reset
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewCollege("");
      setNewEducation("");
      setNewBio("");
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to add member" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Member
  const handleDeleteMember = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/admin/team?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete member");

      setMembers(prev => prev.filter(m => m.id !== id));
      setFeedbackMsg({ type: "success", text: `"${name}" removed from team.` });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to delete member" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bulk actions
  const handleBulkActivate = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          status: "STUDENT",
          isVerified: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to bulk activate");
      setMembers((prev) =>
        prev.map((m) =>
          selectedIds.includes(m.id)
            ? {
                ...m,
                status: normalizeTeamStatus(m.status) === "CANDIDATE" ? "STUDENT" : m.status,
                isVerified: true,
              }
            : m
        )
      );
      setFeedbackMsg({
        type: "success",
        text: `Successfully activated ${selectedIds.length} members! They are now live on the site.`,
      });
      setSelectedIds([]);
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to bulk activate" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          status: "CANDIDATE",
          isVerified: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to bulk deactivate");
      setMembers((prev) =>
        prev.map((m) =>
          selectedIds.includes(m.id)
            ? { ...m, status: "CANDIDATE", isVerified: false }
            : m
        )
      );
      setFeedbackMsg({
        type: "success",
        text: `Deactivated ${selectedIds.length} members (hidden from site).`,
      });
      setSelectedIds([]);
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to bulk deactivate" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate counts
  const candidateCount = members.filter(m => normalizeTeamStatus(m.status) === "CANDIDATE").length;
  const studentCount = members.filter(m => normalizeTeamStatus(m.status) === "STUDENT").length;
  const placedCount = members.filter(m => normalizeTeamStatus(m.status) === "PLACED").length;
  const alumniCount = members.filter(m => normalizeTeamStatus(m.status) === "ALUMNI").length;

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesTab =
      activeTab === "ALL" ? true : normalizeTeamStatus(m.status) === activeTab;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(searchLower) ||
      m.email.toLowerCase().includes(searchLower) ||
      (m.role || "").toLowerCase().includes(searchLower) ||
      (m.department || "").toLowerCase().includes(searchLower) ||
      (m.college || "").toLowerCase().includes(searchLower) ||
      (m.city || "").toLowerCase().includes(searchLower) ||
      (m.skills || []).some(s => s.toLowerCase().includes(searchLower));

    return matchesTab && matchesSearch;
  });

  // Pagination calculation
  const totalEntries = filteredMembers.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + pageSize);

  const pageMemberIds = paginatedMembers.map(m => m.id);
  const allPageSelected =
    pageMemberIds.length > 0 && pageMemberIds.every(id => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedIds(prev => prev.filter(id => !pageMemberIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageMemberIds])));
    }
  };

  const toggleSelectMember = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Top Bulk Action Buttons Bar (Yogsathi style) */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <span className="text-sm leading-none font-bold">+</span>
          <span>Add Expert</span>
        </button>

        <button
          type="button"
          onClick={handleBulkActivate}
          disabled={isSubmitting || selectedIds.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          title={selectedIds.length > 0 ? `Activate ${selectedIds.length} selected` : "Select members to activate"}
        >
          <span>✓</span>
          <span>Bulk Activate {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}</span>
        </button>

        <button
          type="button"
          onClick={handleBulkDeactivate}
          disabled={isSubmitting || selectedIds.length === 0}
          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          title={selectedIds.length > 0 ? `Deactivate ${selectedIds.length} selected` : "Select members to deactivate"}
        >
          <span>✕</span>
          <span>Bulk Deactivate {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSponsoredModalOpen(true)}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer ml-auto"
          title="Configure Right-Panel Sponsored Ad"
        >
          <span>📢</span>
          <span>Sponsored Ad</span>
        </button>
      </div>

      {/* Title & Subtitle (Yogsathi style) */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          MANAGE ALL TRAINERS
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Bulk actions apply to all trainers — or select rows to limit scope
        </p>
      </div>

      {/* Controls Bar: Show entries, Tabs, Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none focus:border-[#0055FF]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab("ALL"); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeTab === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({members.length})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("CANDIDATE"); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeTab === "CANDIDATE" ? "bg-amber-500 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Candidate ({candidateCount})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("STUDENT"); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeTab === "STUDENT" ? "bg-[#0055FF] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Student ({studentCount})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("PLACED"); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeTab === "PLACED" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Placed ({placedCount})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("ALUMNI"); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                activeTab === "ALUMNI" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Alumni ({alumniCount})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Search:</span>
          <input
            type="text"
            placeholder="Search by name, email, phone, cat"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0055FF] w-64 shadow-xs"
          />
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 shadow-xs ${
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

      {/* Main Table — Exact Yogsathi Clean Reference */}
      <div className="rounded-xl overflow-hidden shadow-xs bg-white border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-[#0055FF] border-slate-300 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-bold">Trainer</th>
                <th className="p-3 font-bold">Contact</th>
                <th className="p-3 font-bold">Pin Code</th>
                <th className="p-3 font-bold">Category</th>
                <th className="p-3 font-bold">City</th>
                <th className="p-3 font-bold">State</th>
                <th className="p-3 font-bold">Plan / Role</th>
                <th className="p-3 font-bold text-center">Status</th>
                <th className="p-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedMembers.map((member) => {
                const active = isMemberActive(member);
                const isSelected = selectedIds.includes(member.id);
                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? "bg-blue-50/40" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectMember(member.id)}
                        className="w-4 h-4 rounded text-[#0055FF] border-slate-300 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Trainer / Member Info */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                          <NameAvatar
                            name={member.name}
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            textClassName="text-xs"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 leading-tight">
                            {member.name}
                          </div>
                          <div className="text-xs text-slate-500 leading-tight mt-0.5">
                            {member.email}
                          </div>
                          {(member.college || member.dateOfBirth) && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {member.college ? `🎓 ${member.college}` : ""}
                              {member.college && member.dateOfBirth ? " • " : ""}
                              {member.dateOfBirth ? `DOB: ${member.dateOfBirth}` : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-3 whitespace-nowrap text-xs text-slate-700 font-medium">
                      {member.phone ? (
                        <a
                          href={`https://wa.me/${member.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 hover:text-emerald-600 font-mono text-[11px]"
                          title="Chat on WhatsApp"
                        >
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] shrink-0 font-bold">
                            📞
                          </span>
                          <span>{member.phone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Pin Code */}
                    <td className="p-3 whitespace-nowrap text-xs text-slate-600 font-mono">
                      {member.pinCode || "—"}
                    </td>

                    {/* Category Dropdown (Yogsathi Plan style) */}
                    <td className="p-3 whitespace-nowrap">
                      <select
                        disabled={isSubmitting}
                        value={normalizeTeamStatus(member.status)}
                        onChange={(e) => handleCategoryChange(member, e.target.value as TeamStatus)}
                        className="appearance-auto bg-slate-50 hover:bg-white text-slate-800 border border-slate-300 px-2 py-1 rounded-md text-xs font-semibold cursor-pointer focus:outline-none focus:border-[#0055FF]"
                      >
                        <option value="CANDIDATE">Candidate</option>
                        <option value="STUDENT">Student</option>
                        <option value="PLACED">Placed</option>
                        <option value="ALUMNI">Alumni</option>
                      </select>
                    </td>

                    {/* City */}
                    <td className="p-3 whitespace-nowrap text-xs text-slate-700">
                      {member.city || "—"}
                    </td>

                    {/* State */}
                    <td className="p-3 whitespace-nowrap text-xs text-slate-700">
                      {member.state || "—"}
                    </td>

                    {/* Plan / Role */}
                    <td className="p-3 text-xs text-slate-800 font-medium max-w-[180px] truncate" title={member.role}>
                      {member.role || "Software Engineering Intern"}
                    </td>

                    {/* STATUS (Yogsathi Clickable Round Dot: 🟢 Active / 🔴 Inactive) */}
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleToggleActive(member)}
                        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
                        title={active ? "Active (Visible on site) — Click to deactivate" : "Inactive (Hidden) — Click to activate"}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full inline-block transition-transform hover:scale-125 shadow-xs ${
                            active
                              ? "bg-emerald-500 ring-2 ring-emerald-500/20"
                              : "bg-rose-500 ring-2 ring-rose-500/20"
                          }`}
                        />
                      </button>
                    </td>

                    {/* ACTIONS (Yogsathi Style: Edit / Delete / View) */}
                    <td className="p-3 text-right text-xs font-semibold whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/team/${member.id}/edit`}
                          className="text-[#0055FF] hover:underline"
                        >
                          Edit
                        </Link>
                        <span className="text-slate-300">/</span>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="text-rose-600 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                        <span className="text-slate-300">/</span>
                        <Link
                          href={`/ourteam/${member.id}`}
                          target="_blank"
                          className="text-slate-700 hover:text-slate-900 hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedMembers.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-500 font-medium">
                    No records found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (Yogsathi bottom style) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-600 font-medium">
          <div>
            Showing {totalEntries === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, totalEntries)} of {totalEntries} entries
            {selectedIds.length > 0 && (
              <span className="ml-2 font-bold text-[#0055FF]">
                ({selectedIds.length} selected)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="px-3 py-1 rounded-md border border-slate-300 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - validCurrentPage) <= 1)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-slate-400">...</span>}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                      validCurrentPage === p
                        ? "bg-[#0055FF] text-white"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}

            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages || totalPages === 0}
              className="px-3 py-1 rounded-md border border-slate-300 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>


      {/* MODAL: ADD NEW TEAM MEMBER */}
      {mounted &&
        isAddModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
            style={{ margin: 0 }}
            onClick={() => setIsAddModalOpen(false)}
          >
            <div
              className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden m-auto"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex justify-between items-center px-6 py-4 border-b shrink-0"
                style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
              >
                <div>
                  <h3 className="text-xl font-bold">Add Team Member</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Create a team member directly or approve a candidate profile.
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
              <form onSubmit={handleAddMember} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 flex-1 min-h-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="e.g. Rahul Sharma"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="rahul@example.com"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="+91 98765 43210"
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Role / Designation *
                      </label>
                      <input
                        type="text"
                        required
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="e.g. AI/ML Engineer"
                        value={newRole}
                        onChange={e => setNewRole(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Department
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="AI/ML Engineering"
                        value={newDepartment}
                        onChange={e => setNewDepartment(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        City
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="Udupi"
                        value={newCity}
                        onChange={e => setNewCity(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        State
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="Karnataka"
                        value={newState}
                        onChange={e => setNewState(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        College / Institution
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="e.g. SMVITM Udupi"
                        value={newCollege}
                        onChange={e => setNewCollege(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Education / Degree
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        placeholder="e.g. B.E. Computer Science"
                        value={newEducation}
                        onChange={e => setNewEducation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                      Key Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                      placeholder="Python, PyTorch, React, Machine Learning"
                      value={newSkills}
                      onChange={e => setNewSkills(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                      Bio / Summary
                    </label>
                    <textarea
                      rows={3}
                      className="input-premium w-full px-4 py-2 rounded-xl text-xs"
                      placeholder="Brief overview of candidate background, achievements, and capabilities..."
                      value={newBio}
                      onChange={e => setNewBio(e.target.value)}
                    />
                  </div>

                  {/* Profile Picture */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase text-slate-300">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4 p-3 rounded-xl border" style={{ background: "var(--bg-base)", borderColor: "var(--border-soft)" }}>
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black/20">
                        {newImage ? (
                          <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-500 flex items-center justify-center h-full">No img</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
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
                          {isUploadingImage ? "Uploading..." : "📁 Upload Photo"}
                        </button>
                        <input
                          type="url"
                          className="input-premium w-full px-3 py-1.5 rounded-lg text-xs mt-1"
                          placeholder="Or paste image URL"
                          value={newImage}
                          onChange={e => setNewImage(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-300">
                        Status
                      </label>
                      <select
                        className="select-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value as any)}
                      >
                        <option value="CANDIDATE">Candidate</option>
                        <option value="STUDENT">Student</option>
                        <option value="PLACED">Placed</option>
                        <option value="ALUMNI">Alumni</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="newIsVerified"
                        checked={newIsVerified}
                        onChange={e => setNewIsVerified(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <label htmlFor="newIsVerified" className="text-xs font-bold text-slate-300 cursor-pointer">
                        Mark Profile as Verified Badge ✓
                      </label>
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
                    {isSubmitting ? "Adding..." : "Add Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* PLACEMENT MODAL */}
      {mounted &&
        placementModalMember &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div
              className="w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl border border-white/20 flex flex-col"
              style={{ background: "var(--bg-card)" }}
            >
              {/* Header */}
              <div
                className="px-6 py-5 border-b flex justify-between items-center"
                style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
              >
                <div>
                  <h3 className="heading-font text-lg font-extrabold text-white flex items-center gap-2">
                    <span>🎓 Mark as Placed Candidate</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    This candidate will appear in &quot;Successfully Placed Candidates&quot; on the Home Page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPlacementModalMember(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSavePlacement} className="p-6 space-y-4">
                {/* Candidate Info Summary */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/15">
                    {placementModalMember.image ? (
                      <img src={placementModalMember.image} alt={placementModalMember.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#0055FF]">
                        {placementModalMember.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{placementModalMember.name}</h4>
                    <p className="text-xs text-slate-400">{placementModalMember.email}</p>
                    <p className="text-[11px] text-blue-400 font-semibold">{placementModalMember.role}</p>
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider text-slate-300">
                    Placed Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cognizant, Google, TCS, HDFC Bank, Infosys"
                    className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                    value={placementCompany}
                    onChange={e => setPlacementCompany(e.target.value)}
                  />
                </div>

                {/* Placed Role */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider text-slate-300">
                    Job / Engineering Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer, Full Stack Developer, Sales & Marketing"
                    className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                    value={placementRole}
                    onChange={e => setPlacementRole(e.target.value)}
                  />
                </div>

                {/* Package / CTC (optional) */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider text-slate-300">
                    Package / CTC (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12 LPA, 8.5 LPA"
                    className="input-premium w-full px-4 py-2.5 rounded-xl text-sm"
                    value={placementPackage}
                    onChange={e => setPlacementPackage(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setPlacementModalMember(null)}
                    className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{isSubmitting ? "Saving..." : "Save & Feature on Home"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Sponsored Ad Management Modal */}
      <SponsoredAdModal
        isOpen={isSponsoredModalOpen}
        onClose={() => setIsSponsoredModalOpen(false)}
        initialAd={sponsoredAd}
        onSaveSuccess={(updated) => {
          setSponsoredAd(updated);
          setFeedbackMsg({ type: "success", text: "Sponsored banner published and live on Our Team!" });
        }}
      />

    </div>
  );
}
