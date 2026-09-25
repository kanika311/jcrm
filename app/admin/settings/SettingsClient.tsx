"use client";

import { useState, useEffect } from "react";
import {
  createAdminUser,
  changeAdminPassword,
  getAdminUsers,
  deleteAdminUser,
  getWhatsAppConfigAction,
  updateWhatsAppConfigAction,
} from "./actions";
import { FiMessageCircle, FiSend, FiExternalLink, FiCheck, FiCheckCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

interface AdminUser {
  id: string;
  fullName: string | null;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  isBlocked: boolean;
}

interface SettingsClientProps {
  currentAdminEmail?: string | null;
  cmsData?: any;
}

export default function SettingsClient({ currentAdminEmail, cmsData }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<
    "add-admin" | "change-password" | "admin-list" | "general" | "whatsapp"
  >("add-admin");

  // WhatsApp Configuration State
  const [whatsappNumber, setWhatsappNumber] = useState("918310531309");
  const [whatsappButtonText, setWhatsappButtonText] = useState("Course Enquiry");
  const [whatsappDefaultMsg, setWhatsappDefaultMsg] = useState(
    "Hello JCRM Technologies, I want to enquire about course details, fees, and admissions."
  );
  const [whatsappSupportTitle, setWhatsappSupportTitle] = useState("JCRM Support & Admissions");
  const [whatsappSupportSubtitle, setWhatsappSupportSubtitle] = useState("Online • Typically replies instantly");
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [isSavingWhatsApp, setIsSavingWhatsApp] = useState(false);
  const [whatsappMsg, setWhatsappMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Add Admin Form State
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [createAdminMsg, setCreateAdminMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Change Password Form State
  const [targetEmail, setTargetEmail] = useState(currentAdminEmail || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [changePassMsg, setChangePassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Admin List State
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [deleteAdminMsg, setDeleteAdminMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchWhatsAppConfig = async () => {
    try {
      const res = await getWhatsAppConfigAction();
      if (res.success && res.config) {
        setWhatsappNumber(res.config.whatsappNumber);
        setWhatsappButtonText(res.config.buttonText);
        setWhatsappDefaultMsg(res.config.defaultMessage);
        setWhatsappEnabled(res.config.isEnabled);
        if (res.config.supportTitle) setWhatsappSupportTitle(res.config.supportTitle);
        if (res.config.supportSubtitle) setWhatsappSupportSubtitle(res.config.supportSubtitle);
      }
    } catch (err) {
      console.error("Error loading WhatsApp config:", err);
    }
  };

  const handleSaveWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWhatsApp(true);
    setWhatsappMsg(null);

    const res = await updateWhatsAppConfigAction({
      whatsappNumber,
      buttonText: whatsappButtonText,
      defaultMessage: whatsappDefaultMsg,
      isEnabled: whatsappEnabled,
      supportTitle: whatsappSupportTitle,
      supportSubtitle: whatsappSupportSubtitle,
    });

    setIsSavingWhatsApp(false);
    if (res.success) {
      setWhatsappMsg({ type: "success", text: res.message || "WhatsApp settings saved successfully!" });
      if (res.config) {
        setWhatsappNumber(res.config.whatsappNumber);
      }
    } else {
      setWhatsappMsg({ type: "error", text: res.error || "Failed to update WhatsApp settings" });
    }
  };

  const handleDeleteAdmin = async (id: string, nameOrEmail: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete admin account "${nameOrEmail}"?`)) {
      return;
    }
    setDeletingId(id);
    setDeleteAdminMsg(null);
    const res = await deleteAdminUser(id);
    setDeletingId(null);
    if (res.error) {
      setDeleteAdminMsg({ type: "error", text: res.error });
    } else {
      setDeleteAdminMsg({ type: "success", text: res.message || "Admin deleted successfully." });
      fetchAdmins();
    }
  };

  const fetchAdmins = async () => {
    setIsLoadingAdmins(true);
    const res = await getAdminUsers();
    if (res.success && res.admins) {
      setAdmins(res.admins);
    }
    setIsLoadingAdmins(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle Add New Admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAdmin(true);
    setCreateAdminMsg(null);

    const res = await createAdminUser({
      fullName: newFullName,
      email: newEmail,
      phoneNumber: newPhone,
      password: newPassword,
    });

    setIsCreatingAdmin(false);

    if (res.error) {
      setCreateAdminMsg({ type: "error", text: res.error });
    } else {
      setCreateAdminMsg({ type: "success", text: res.message || "Admin created successfully!" });
      setNewFullName("");
      setNewEmail("");
      setNewPhone("");
      setNewPassword("");
      fetchAdmins();
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassMsg(null);

    if (updatedPassword !== confirmPassword) {
      setChangePassMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (updatedPassword.length < 6) {
      setChangePassMsg({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    setIsChangingPass(true);

    const res = await changeAdminPassword({
      targetEmail: targetEmail || currentAdminEmail || "",
      currentPassword,
      newPassword: updatedPassword,
    });

    setIsChangingPass(false);

    if (res.error) {
      setChangePassMsg({ type: "error", text: res.error });
    } else {
      setChangePassMsg({ type: "success", text: res.message || "Password updated successfully!" });
      setCurrentPassword("");
      setUpdatedPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="md:col-span-1 space-y-2">
        <button
          onClick={() => setActiveTab("add-admin")}
          className={`w-full text-left px-4 py-3.5 font-bold rounded-xl border transition-all flex items-center justify-between ${
            activeTab === "add-admin"
              ? "bg-purple-50 text-[#7C3AED] border-purple-200 shadow-xs font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
          }`}
        >
          <span>👤 Add New Admin</span>
          {activeTab === "add-admin" && <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />}
        </button>

        <button
          onClick={() => setActiveTab("change-password")}
          className={`w-full text-left px-4 py-3.5 font-bold rounded-xl border transition-all flex items-center justify-between ${
            activeTab === "change-password"
              ? "bg-purple-50 text-[#7C3AED] border-purple-200 shadow-xs font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
          }`}
        >
          <span>🔐 Change Password</span>
          {activeTab === "change-password" && <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab("admin-list");
            fetchAdmins();
          }}
          className={`w-full text-left px-4 py-3.5 font-bold rounded-xl border transition-all flex items-center justify-between ${
            activeTab === "admin-list"
              ? "bg-purple-50 text-[#7C3AED] border-purple-200 shadow-xs font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
          }`}
        >
          <span>🛡️ Active Admins ({admins.length})</span>
          {activeTab === "admin-list" && <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />}
        </button>

        <button
          onClick={() => {
            setActiveTab("whatsapp");
            fetchWhatsAppConfig();
          }}
          className={`w-full text-left px-4 py-3.5 font-bold rounded-xl border transition-all flex items-center justify-between ${
            activeTab === "whatsapp"
              ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]"></span>
            <span>WhatsApp Contact Setup</span>
          </span>
          {activeTab === "whatsapp" && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
        </button>

        <button
          onClick={() => setActiveTab("general")}
          className={`w-full text-left px-4 py-3.5 font-medium rounded-xl border transition-all ${
            activeTab === "general"
              ? "bg-purple-50 text-[#7C3AED] border-purple-200 shadow-xs font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
          }`}
        >
          ⚙️ General Platform Info
        </button>
      </div>

      {/* Main Panel Content */}
      <div
        className="md:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-8"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-soft)" }}
      >
        {/* TAB 1: ADD NEW ADMIN */}
        {activeTab === "add-admin" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4" style={{ borderColor: "var(--border-soft)" }}>
              <h2 className="heading-font text-2xl font-bold">Add New Administrator</h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Create a new administrator account with full privileges to manage courses, users, and content.
              </p>
            </div>

            {createAdminMsg && (
              <div
                className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                  createAdminMsg.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                <span>{createAdminMsg.type === "success" ? "✓" : "⚠️"}</span>
                <span>{createAdminMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="input-premium w-full rounded-xl px-4 py-3 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                    Admin Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="input-premium w-full rounded-xl px-4 py-3 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="input-premium w-full rounded-xl px-4 py-3 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                    Initial Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="input-premium w-full rounded-xl px-4 py-3 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end" style={{ borderColor: "var(--border-soft)" }}>
                <button
                  type="submit"
                  disabled={isCreatingAdmin}
                  className="btn-primary px-8 py-3.5 text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  {isCreatingAdmin ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Admin...
                    </>
                  ) : (
                    "Create Admin Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: CHANGE PASSWORD */}
        {activeTab === "change-password" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4" style={{ borderColor: "var(--border-soft)" }}>
              <h2 className="heading-font text-2xl font-bold">Change Admin Password</h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Update the login password for your admin account or reset passwords for other registered admins.
              </p>
            </div>

            {changePassMsg && (
              <div
                className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                  changePassMsg.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                <span>{changePassMsg.type === "success" ? "✓" : "⚠️"}</span>
                <span>{changePassMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                  Admin Account to Update
                </label>
                {admins.length > 0 ? (
                  <select
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    className="input-premium w-full rounded-xl px-4 py-3 transition-colors font-medium"
                  >
                    {admins.map((adm) => (
                      <option key={adm.id} value={adm.email}>
                        {adm.fullName || "Admin"} ({adm.email}) {adm.email === currentAdminEmail ? "— (You)" : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="email"
                    required
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    className="input-premium w-full rounded-xl px-4 py-3 transition-colors"
                  />
                )}
              </div>

              {targetEmail === currentAdminEmail && (
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="input-premium w-full rounded-xl px-4 py-3 transition-colors"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={updatedPassword}
                    onChange={(e) => setUpdatedPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="input-premium w-full rounded-xl px-4 py-3 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="input-premium w-full rounded-xl px-4 py-3 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end" style={{ borderColor: "var(--border-soft)" }}>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="btn-primary px-8 py-3.5 text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  {isChangingPass ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Updating Password...
                    </>
                  ) : (
                    "Save New Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ADMIN LIST */}
        {activeTab === "admin-list" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 flex items-center justify-between" style={{ borderColor: "var(--border-soft)" }}>
              <div>
                <h2 className="heading-font text-2xl font-bold">Active Administrators</h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  All registered admin accounts with full platform management access.
                </p>
              </div>
              <button
                onClick={fetchAdmins}
                className="btn-secondary px-4 py-2 text-xs font-bold rounded-lg"
              >
                Refresh List
              </button>
            </div>

            {deleteAdminMsg && (
              <div
                className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between gap-3 shadow-xs ${
                  deleteAdminMsg.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                <span>{deleteAdminMsg.text}</span>
                <button
                  onClick={() => setDeleteAdminMsg(null)}
                  className="opacity-60 hover:opacity-100 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {isLoadingAdmins ? (
              <div className="py-12 text-center text-gray-400">Loading administrators...</div>
            ) : admins.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No admin accounts found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-xs uppercase" style={{ borderColor: "var(--border-soft)", color: "var(--text-secondary)" }}>
                      <th className="pb-3 font-bold">Admin</th>
                      <th className="pb-3 font-bold">Email</th>
                      <th className="pb-3 font-bold">Phone</th>
                      <th className="pb-3 font-bold">Created</th>
                      <th className="pb-3 font-bold text-center">Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
                    {admins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 font-bold flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center font-extrabold text-xs">
                            {(adm.fullName || adm.email).substring(0, 2).toUpperCase()}
                          </div>
                          <span>{adm.fullName || "Admin"}</span>
                          {adm.email === currentAdminEmail && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#7C3AED]/20 text-[#7C3AED]">
                              YOU
                            </span>
                          )}
                        </td>
                        <td className="py-4" style={{ color: "var(--text-secondary)" }}>
                          {adm.email}
                        </td>
                        <td className="py-4" style={{ color: "var(--text-secondary)" }}>
                          {adm.phoneNumber || "—"}
                        </td>
                        <td className="py-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
                          {new Date(adm.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              adm.isBlocked
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            }`}
                          >
                            {adm.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {adm.email === currentAdminEmail ? (
                            <span className="text-[11px] font-semibold text-slate-400 italic">Current User</span>
                          ) : (
                            <button
                              disabled={deletingId === adm.id}
                              onClick={() => handleDeleteAdmin(adm.id, adm.fullName || adm.email)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
                              title="Delete admin account"
                            >
                              {deletingId === adm.id ? (
                                <span>Deleting...</span>
                              ) : (
                                <>
                                  <span>🗑</span>
                                  <span>Delete</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: WHATSAPP WIDGET & CONTACT SETUP */}
        {activeTab === "whatsapp" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: "var(--border-soft)" }}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Direct WhatsApp
                  </span>
                  <h2 className="heading-font text-2xl font-bold">WhatsApp Floating Widget &amp; Number</h2>
                </div>
                <p className="text-sm mt-1 text-slate-500">
                  Update the WhatsApp contact phone number. All website visitors clicking the popup or course inquiry buttons will send direct messages to this WhatsApp number.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    whatsappEnabled
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      whatsappEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  <span>{whatsappEnabled ? "Widget Active on Site" : "Widget Disabled"}</span>
                </span>
              </div>
            </div>

            {whatsappMsg && (
              <div
                className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between gap-3 ${
                  whatsappMsg.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600"
                    : "bg-red-500/10 border border-red-500/30 text-red-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{whatsappMsg.type === "success" ? "✓" : "⚠️"}</span>
                  <span>{whatsappMsg.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsappMsg(null)}
                  className="text-xs opacity-60 hover:opacity-100 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* LIVE PREVIEW & TEST LINK CARD */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                  Live Floating Button Preview
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Currently configured to send to:{" "}
                  <strong className="text-emerald-900 font-mono">+{whatsappNumber.replace(/[^0-9]/g, "")}</strong>
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] text-white shadow-lg shadow-emerald-600/30 border border-white/60">
                    <FaWhatsapp className="w-6 h-6 text-white" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">Official Circular WhatsApp CTA</span>
                </div>
              </div>

              <div>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "") || "918310531309"}?text=${encodeURIComponent(
                    whatsappDefaultMsg || "Hello JCRM Technologies"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link on WhatsApp ↗</span>
                </a>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSaveWhatsApp} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase text-slate-600">
                    WhatsApp Contact Number (with Country Code) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 918310531309 or +91 8310531309"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-2xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Enter full number with country code without spaces (e.g. <code>918310531309</code>). Target link will be{" "}
                    <code>https://wa.me/{whatsappNumber.replace(/[^0-9]/g, "")}</code>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 uppercase text-slate-600">
                    Floating Pill Button Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsappButtonText}
                    onChange={(e) => setWhatsappButtonText(e.target.value)}
                    placeholder="e.g. Course Enquiry or Chat with us"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-2xs"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Label displayed next to the WhatsApp icon on the floating launcher.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase text-slate-600">
                    Popup Header Title
                  </label>
                  <input
                    type="text"
                    value={whatsappSupportTitle}
                    onChange={(e) => setWhatsappSupportTitle(e.target.value)}
                    placeholder="e.g. JCRM Support & Admissions"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 uppercase text-slate-600">
                    Popup Subtitle / Status
                  </label>
                  <input
                    type="text"
                    value={whatsappSupportSubtitle}
                    onChange={(e) => setWhatsappSupportSubtitle(e.target.value)}
                    placeholder="e.g. Online • Typically replies instantly"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-slate-600">
                  Default Pre-filled Enquiry Message
                </label>
                <textarea
                  rows={3}
                  value={whatsappDefaultMsg}
                  onChange={(e) => setWhatsappDefaultMsg(e.target.value)}
                  placeholder="Hello JCRM Technologies, I want to enquire about..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-2xs resize-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  When a candidate taps WhatsApp, this message will be automatically loaded into their WhatsApp text box.
                </p>
              </div>

              {/* Toggle Enable/Disable */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Show WhatsApp Button on Website</span>
                  <span className="text-[11px] text-slate-500">
                    Turn off if you want to temporarily hide the floating button from all visitors.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappEnabled}
                    onChange={(e) => setWhatsappEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={isSavingWhatsApp}
                  className="flex items-center gap-2 px-6 py-3 bg-[#075E54] hover:bg-[#064e46] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingWhatsApp ? (
                    <span>Saving Changes...</span>
                  ) : (
                    <>
                      <FiCheckCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Save WhatsApp Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
