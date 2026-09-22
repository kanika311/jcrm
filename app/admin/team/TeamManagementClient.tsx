"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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

export default function TeamManagementClient({ initialMembers }: { initialMembers: TeamMemberItem[] }) {
  const [members, setMembers] = useState<TeamMemberItem[]>(initialMembers);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);

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

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesTab = activeTab === "ALL" || m.status === activeTab;
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
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="heading-font text-3xl font-extrabold mb-2">Our Team & Join Us Approvals</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Review candidate applications from Join Us form, approve them to appear on the public Our Team page, and manage team profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <span className="text-lg leading-none">+</span> Add Team Member
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab("PENDING")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "PENDING"
              ? "border-amber-500/60 bg-amber-500/10 shadow-lg"
              : "hover:border-amber-500/30"
          }`}
          style={{ background: activeTab !== "PENDING" ? "var(--bg-card)" : undefined, borderColor: activeTab !== "PENDING" ? "var(--border-soft)" : undefined }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              ⏳ Pending Review
            </span>
            {pendingCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <div className="text-3xl font-extrabold text-white">{pendingCount}</div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">From Join Us form</p>
        </div>

        <div
          onClick={() => setActiveTab("APPROVED")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "APPROVED"
              ? "border-emerald-500/60 bg-emerald-500/10 shadow-lg"
              : "hover:border-emerald-500/30"
          }`}
          style={{ background: activeTab !== "APPROVED" ? "var(--bg-card)" : undefined, borderColor: activeTab !== "APPROVED" ? "var(--border-soft)" : undefined }}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
            ✅ Approved & Live
          </span>
          <div className="text-3xl font-extrabold text-white">{approvedCount}</div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Visible on /ourteam</p>
        </div>

        <div
          onClick={() => setActiveTab("ALL")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "ALL"
              ? "border-blue-500/60 bg-blue-500/10 shadow-lg"
              : "hover:border-blue-500/30"
          }`}
          style={{ background: activeTab !== "ALL" ? "var(--bg-card)" : undefined, borderColor: activeTab !== "ALL" ? "var(--border-soft)" : undefined }}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8] block mb-2">
            👥 Total Profiles
          </span>
          <div className="text-3xl font-extrabold text-white">{members.length}</div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">All database records</p>
        </div>

        <div
          onClick={() => setActiveTab("REJECTED")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "REJECTED"
              ? "border-rose-500/60 bg-rose-500/10 shadow-lg"
              : "hover:border-rose-500/30"
          }`}
          style={{ background: activeTab !== "REJECTED" ? "var(--bg-card)" : undefined, borderColor: activeTab !== "REJECTED" ? "var(--border-soft)" : undefined }}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-2">
            ❌ Rejected
          </span>
          <div className="text-3xl font-extrabold text-white">{rejectedCount}</div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">Archived applications</p>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border w-full sm:w-auto" style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}>
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "PENDING"
                ? "bg-amber-500 text-black shadow-md"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <span>Pending Approvals</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-extrabold">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("APPROVED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "APPROVED"
                ? "bg-[#0055FF] text-white shadow-md"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            <span>Approved ({approvedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ALL"
                ? "bg-white/15 text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            All ({members.length})
          </button>

          <button
            onClick={() => setActiveTab("REJECTED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "REJECTED"
                ? "bg-rose-500/80 text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name, role, college, skill..."
          className="input-premium px-4 py-2.5 rounded-xl text-sm w-full sm:w-80"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
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

      {/* Team Members Table */}
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
                <th className="p-4 font-bold">Candidate / Member</th>
                <th className="p-4 font-bold">Role & Department</th>
                <th className="p-4 font-bold">Location & College</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
              {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Candidate Info */}
                  <td className="p-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/15 bg-black/20">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs bg-[#0055FF]/20 text-[#0055FF]">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        {member.isVerified && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[8px] text-white">
                            ✓
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{member.name}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{member.email}</div>
                        {member.phone && (
                          <div className="text-[11px] text-slate-400">{member.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role & Department */}
                  <td className="p-4">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{member.role}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{member.department || "Engineering"}</div>
                    {member.experience && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-white/5 text-slate-300">
                        {member.experience}
                      </span>
                    )}
                  </td>

                  {/* Location & College */}
                  <td className="p-4 max-w-xs">
                    <div className="text-xs font-semibold text-slate-300">
                      📍 {member.city || "Bangalore"}, {member.state || "Karnataka"}
                    </div>
                    {member.college && (
                      <div className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5" title={member.college}>
                        🎓 {member.college}
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    {member.status === "PENDING" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 w-fit">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        Pending Approval
                      </span>
                    )}
                    {member.status === "APPROVED" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
                        ✓ Approved (Live)
                      </span>
                    )}
                    {member.status === "REJECTED" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 w-fit">
                        ✕ Rejected
                      </span>
                    )}
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
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Approve candidate to show on Our Team page"
                          >
                            <span>✓ Approve</span>
                          </button>

                          <button
                            disabled={isSubmitting}
                            onClick={() => handleQuickStatusChange(member.id, "REJECTED")}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
                            className="bg-[#0055FF]/15 hover:bg-[#0055FF]/25 text-[#38bdf8] border border-[#0055FF]/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                            title="View Live Profile on Our Team directory"
                          >
                            <span>Live ↗</span>
                          </a>

                          <button
                            disabled={isSubmitting}
                            onClick={() => handleQuickStatusChange(member.id, "PENDING")}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title="Revoke approval back to pending"
                          >
                            Revoke
                          </button>
                        </>
                      )}

                      {/* If REJECTED: allow reconsider */}
                      {member.status === "REJECTED" && (
                        <button
                          disabled={isSubmitting}
                          onClick={() => handleQuickStatusChange(member.id, "APPROVED")}
                          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      {/* Edit Member */}
                      <button
                        onClick={() => setEditingMember(member)}
                        className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Edit
                      </button>

                      {/* Delete Member */}
                      <button
                        disabled={isSubmitting}
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
                  <td colSpan={5} className="p-12 text-center text-gray-500">
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
    </div>
  );
}
