"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { SponsoredAd, DEFAULT_SPONSORED_AD } from "@/lib/sponsoredAd";
import SponsoredAdModal from "@/components/SponsoredAdModal";

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
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TeamManagementClient({ initialMembers, initialPlacedCandidates = [] }: { initialMembers: TeamMemberItem[]; initialPlacedCandidates?: any[] }) {
  const [members, setMembers] = useState<TeamMemberItem[]>(initialMembers);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "PLACED">("PENDING");
  const [searchTerm, setSearchTerm] = useState("");

  // Placed Candidates State (Synced with Home Page)
  const [placedList, setPlacedList] = useState<any[]>(initialPlacedCandidates);
  const [placementModalMember, setPlacementModalMember] = useState<TeamMemberItem | null>(null);
  const [placementCompany, setPlacementCompany] = useState("");
  const [placementRole, setPlacementRole] = useState("");
  const [placementPackage, setPlacementPackage] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [isSponsoredModalOpen, setIsSponsoredModalOpen] = useState(false);
  const [sponsoredAd, setSponsoredAd] = useState<SponsoredAd>(DEFAULT_SPONSORED_AD);

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
  const [newStatus, setNewStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("APPROVED");
  const [newIsVerified, setNewIsVerified] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/admin/sponsored")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ad) setSponsoredAd(data.ad);
      })
      .catch((err) => console.error("Failed to load sponsored ad:", err));
  }, []);

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (isAddModalOpen || editingMember) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAddModalOpen, editingMember]);

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
          else if (editingMember) setEditingMember({ ...editingMember, image: data.url });
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        if (target === "add") setNewImage(url);
        else if (editingMember) setEditingMember({ ...editingMember, image: url });
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        if (target === "add") setNewImage(url);
        else if (editingMember) setEditingMember({ ...editingMember, image: url });
      };
      reader.readAsDataURL(file);
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

  // Quick Status Action (Approve / Reject)
  const handleQuickStatusChange = async (id: string, newStatus: "APPROVED" | "REJECTED" | "PENDING") => {
    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setMembers(prev =>
        prev.map(m => (m.id === id ? { ...m, status: newStatus } : m))
      );
      setFeedbackMsg({
        type: "success",
        text: newStatus === "APPROVED"
          ? "Candidate approved! They are now live on the public Our Team directory."
          : `Candidate status updated to ${newStatus}.`,
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

  // Handle Edit Member Form Submit
  const handleEditMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMember),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update member");

      setMembers(prev =>
        prev.map(m => (m.id === editingMember.id ? { ...m, ...editingMember } : m))
      );
      setEditingMember(null);
      setFeedbackMsg({ type: "success", text: `Member "${editingMember.name}" updated successfully!` });
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Failed to update member" });
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

  // Calculate counts
  const pendingCount = members.filter(m => m.status === "PENDING").length;
  const approvedCount = members.filter(m => m.status === "APPROVED").length;
  const rejectedCount = members.filter(m => m.status === "REJECTED").length;
  const placedCount = placedList.length;

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const isPlaced = Boolean(getPlacementInfo(m));
    const matchesTab =
      activeTab === "ALL"
        ? true
        : activeTab === "PLACED"
        ? isPlaced
        : m.status === activeTab;
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

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Bar (Header text removed as requested) */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Candidate &amp; Team Management
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSponsoredModalOpen(true)}
            className="bg-blue-50 hover:bg-blue-100 text-[#0055FF] border border-[#D4E8F8] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            title="Configure Right-Panel Sponsored Ad"
          >
            <span>📢</span>
            <span>Sponsored Banner</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0055FF] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span className="text-base leading-none font-bold">+</span>
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Placed Candidates Card */}
        <div
          onClick={() => setActiveTab("PLACED")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "PLACED"
              ? "border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20"
              : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              🎓 Placed
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
              HOME
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900">{placedCount}</div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">Live in Home carousel</p>
        </div>

        {/* Pending Review Card */}
        <div
          onClick={() => setActiveTab("PENDING")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "PENDING"
              ? "border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-500/20"
              : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              ⏳ Pending Review
            </span>
            {pendingCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="text-3xl font-black text-slate-900">{pendingCount}</div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">From Join Us form</p>
        </div>

        {/* Approved & Live Card */}
        <div
          onClick={() => setActiveTab("APPROVED")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "APPROVED"
              ? "border-blue-500 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20"
              : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
            ✅ Approved &amp; Live
          </span>
          <div className="text-3xl font-black text-slate-900">{approvedCount}</div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">Visible on /ourteam</p>
        </div>

        {/* Total Profiles Card */}
        <div
          onClick={() => setActiveTab("ALL")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "ALL"
              ? "border-indigo-500 bg-indigo-50/80 shadow-md ring-2 ring-indigo-500/20"
              : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block mb-2">
            👥 Total Profiles
          </span>
          <div className="text-3xl font-black text-slate-900">{members.length}</div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">All database records</p>
        </div>

        {/* Rejected Card */}
        <div
          onClick={() => setActiveTab("REJECTED")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "REJECTED"
              ? "border-rose-500 bg-rose-50/80 shadow-md ring-2 ring-rose-500/20"
              : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block mb-2">
            ❌ Rejected
          </span>
          <div className="text-3xl font-black text-slate-900">{rejectedCount}</div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">Archived applications</p>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "PENDING"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>Pending Approvals</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              activeTab === "PENDING" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
            }`}>
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("APPROVED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "APPROVED"
                ? "bg-[#0055FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>Approved ({approvedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("PLACED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "PLACED"
                ? "bg-emerald-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>🎓 Placed ({placedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            All ({members.length})
          </button>

          <button
            onClick={() => setActiveTab("REJECTED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "REJECTED"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, role, college, skill..."
            className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs font-medium rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 shadow-xs transition"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
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

      {/* Team Members Table */}
      <div className="rounded-2xl overflow-hidden shadow-xs bg-white border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="p-4 font-bold">Candidate / Member</th>
                <th className="p-4 font-bold">Role &amp; Department</th>
                <th className="p-4 font-bold">Location &amp; College</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Placement (Home Page)</th>
                <th className="p-4 font-bold text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Candidate Info */}
                  <td className="p-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs bg-blue-50 text-[#0055FF]">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        {member.isVerified && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white">
                            ✓
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <span>{member.name}</span>
                        </div>
                        <div className="text-xs text-slate-500">{member.email}</div>
                        {member.phone && (
                          <div className="text-[11px] text-slate-400 font-mono">{member.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role & Department */}
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-900">{member.role}</div>
                    <div className="text-xs text-slate-500 font-medium">{member.department || "Engineering"}</div>
                    {member.experience && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {member.experience}
                      </span>
                    )}
                  </td>

                  {/* Location & College */}
                  <td className="p-4 max-w-xs">
                    <div className="text-xs font-semibold text-slate-700">
                      📍 {member.city || "Bangalore"}, {member.state || "Karnataka"}
                    </div>
                    {member.college && (
                      <div className="text-[11px] text-slate-500 truncate mt-0.5" title={member.college}>
                        🎓 {member.college}
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    {member.status === "PENDING" && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 w-fit shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Pending Approval
                      </span>
                    )}
                    {member.status === "APPROVED" && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 w-fit shadow-2xs">
                        ✓ Approved (Live)
                      </span>
                    )}
                    {member.status === "REJECTED" && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5 w-fit shadow-2xs">
                        ✕ Rejected
                      </span>
                    )}
                  </td>

                  {/* Placement Status */}
                  <td className="p-4">
                    {(() => {
                      const placement = getPlacementInfo(member);
                      if (placement) {
                        return (
                          <div className="space-y-1">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5 w-fit shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                              <span>Placed at {placement.company}</span>
                            </span>
                            {placement.package && (
                              <span className="text-[11px] font-bold text-slate-500 block pl-1">
                                Pkg: {placement.package}
                              </span>
                            )}
                          </div>
                        );
                      }
                      return (
                        <span className="text-xs text-slate-400 italic">Not placed</span>
                      );
                    })()}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end items-center">
                      {/* If PENDING: show prominent Approve and Reject buttons */}
                      {member.status === "PENDING" && (
                        <>
                          <button
                            disabled={isSubmitting}
                            onClick={() => handleQuickStatusChange(member.id, "APPROVED")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                            title="Approve candidate to show on Our Team page"
                          >
                            <span>✓ Approve</span>
                          </button>

                          <button
                            disabled={isSubmitting}
                            onClick={() => handleQuickStatusChange(member.id, "REJECTED")}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* If APPROVED: provide link to live profile & revoke */}
                      {member.status === "APPROVED" && (
                        <>
                          <a
                            href={`/ourteam/${member.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-50 hover:bg-blue-100 text-[#0055FF] border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                            title="View Live Profile on Our Team directory"
                          >
                            <span>Live ↗</span>
                          </a>

                          <button
                            disabled={isSubmitting}
                            onClick={() => handleQuickStatusChange(member.id, "PENDING")}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title="Revoke approval back to pending"
                          >
                            Revoke
                          </button>

                          {/* Placed Action Button */}
                          {(() => {
                            const placement = getPlacementInfo(member);
                            if (placement) {
                              return (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => openPlacementModal(member)}
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                                    title="Edit placement details"
                                  >
                                    Edit Placed
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUnmarkPlacement(member)}
                                    className="px-2 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                    title="Remove from Placed section on Home Page"
                                  >
                                    Unmark
                                  </button>
                                </div>
                              );
                            }
                            return (
                              <button
                                type="button"
                                onClick={() => openPlacementModal(member)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                                title="Mark candidate as Placed to show on Home Page"
                              >
                                <span>🎓 Mark Placed</span>
                              </button>
                            );
                          })()}
                        </>
                      )}

                      {/* If REJECTED: allow reconsider */}
                      {member.status === "REJECTED" && (
                        <button
                          disabled={isSubmitting}
                          onClick={() => handleQuickStatusChange(member.id, "APPROVED")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      {/* Edit Member */}
                      <button
                        onClick={() => setEditingMember(member)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>

                      {/* Delete Member */}
                      <button
                        disabled={isSubmitting}
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Permanently delete this record"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                    {activeTab === "PENDING"
                      ? "No pending candidate applications. Submissions from Join Us will appear here for review."
                      : "No team members found matching criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Initial Approval Status
                      </label>
                      <select
                        className="select-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value as any)}
                      >
                        <option value="APPROVED">Approved (Visible on Our Team)</option>
                        <option value="PENDING">Pending (Requires Review)</option>
                        <option value="REJECTED">Rejected</option>
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

      {/* MODAL: EDIT TEAM MEMBER */}
      {mounted &&
        editingMember &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
            style={{ margin: 0 }}
            onClick={() => setEditingMember(null)}
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
                  <h3 className="text-xl font-bold">Edit Team Member</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Modify profile details, skills, and change approval status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleEditMemberSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
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
                        value={editingMember.name}
                        onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
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
                        value={editingMember.email}
                        onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
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
                        value={editingMember.phone || ""}
                        onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
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
                        value={editingMember.role}
                        onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
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
                        value={editingMember.department || ""}
                        onChange={e => setEditingMember({ ...editingMember, department: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        City
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={editingMember.city || ""}
                        onChange={e => setEditingMember({ ...editingMember, city: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        State
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={editingMember.state || ""}
                        onChange={e => setEditingMember({ ...editingMember, state: e.target.value })}
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
                        value={editingMember.college || ""}
                        onChange={e => setEditingMember({ ...editingMember, college: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Education / Degree
                      </label>
                      <input
                        type="text"
                        className="input-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={editingMember.education || ""}
                        onChange={e => setEditingMember({ ...editingMember, education: e.target.value })}
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
                      value={Array.isArray(editingMember.skills) ? editingMember.skills.join(", ") : editingMember.skills || ""}
                      onChange={e =>
                        setEditingMember({
                          ...editingMember,
                          skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                      Bio / Summary
                    </label>
                    <textarea
                      rows={3}
                      className="input-premium w-full px-4 py-2 rounded-xl text-xs"
                      value={editingMember.bio || ""}
                      onChange={e => setEditingMember({ ...editingMember, bio: e.target.value })}
                    />
                  </div>

                  {/* Profile Picture */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase text-slate-300">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4 p-3 rounded-xl border" style={{ background: "var(--bg-base)", borderColor: "var(--border-soft)" }}>
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black/20">
                        {editingMember.image ? (
                          <img src={editingMember.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-500 flex items-center justify-center h-full">No img</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
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
                          {isUploadingImage ? "Uploading..." : "📁 Upload Photo"}
                        </button>
                        <input
                          type="url"
                          className="input-premium w-full px-3 py-1.5 rounded-lg text-xs mt-1"
                          placeholder="Or paste image URL"
                          value={editingMember.image || ""}
                          onChange={e => setEditingMember({ ...editingMember, image: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase text-slate-300">
                        Approval Status
                      </label>
                      <select
                        className="select-premium w-full px-4 py-2 rounded-xl text-sm"
                        value={editingMember.status}
                        onChange={e => setEditingMember({ ...editingMember, status: e.target.value as any })}
                      >
                        <option value="APPROVED">Approved (Visible on Our Team)</option>
                        <option value="PENDING">Pending Approval</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="editIsVerified"
                        checked={editingMember.isVerified}
                        onChange={e => setEditingMember({ ...editingMember, isVerified: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <label htmlFor="editIsVerified" className="text-xs font-bold text-slate-300 cursor-pointer">
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
                    onClick={() => setEditingMember(null)}
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
