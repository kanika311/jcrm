"use client";

import { useState, useEffect } from "react";
import { createAdminUser, changeAdminPassword, getAdminUsers } from "./actions";

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
  const [activeTab, setActiveTab] = useState<"add-admin" | "change-password" | "admin-list" | "general">("add-admin");

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
              ? "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/30 shadow-sm"
              : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>👤 Add New Admin</span>
          {activeTab === "add-admin" && <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />}
        </button>

        <button
          onClick={() => setActiveTab("change-password")}
          className={`w-full text-left px-4 py-3.5 font-bold rounded-xl border transition-all flex items-center justify-between ${
            activeTab === "change-password"
              ? "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/30 shadow-sm"
              : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
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
              ? "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/30 shadow-sm"
              : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>🛡️ Active Admins ({admins.length})</span>
          {activeTab === "admin-list" && <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />}
        </button>

        <button
          onClick={() => setActiveTab("general")}
          className={`w-full text-left px-4 py-3.5 font-medium rounded-xl border transition-all ${
            activeTab === "general"
              ? "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/30 shadow-sm"
              : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          ⚙️ General Platform Info
        </button>
      </div>

      {/* Main Panel Content */}
      <div
        className="md:col-span-3 border rounded-[24px] shadow-2xl p-8"
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
                      <th className="pb-3 font-bold text-right">Status</th>
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
                        <td className="py-4 text-right">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              adm.isBlocked
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {adm.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GENERAL INFO */}
        {activeTab === "general" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b pb-4" style={{ borderColor: "var(--border-soft)" }}>
              <h2 className="heading-font text-2xl font-bold">General Platform Info</h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Core branding and global platform settings.
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                  Platform Name
                </label>
                <input
                  type="text"
                  defaultValue="JCRM Technology"
                  className="input-premium w-full rounded-xl px-4 py-3 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                    Support Email
                  </label>
                  <input
                    type="email"
                    defaultValue="support@jcrm technology.io"
                    className="input-premium w-full rounded-xl px-4 py-3 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase" style={{ color: "var(--text-secondary)" }}>
                    Global Currency
                  </label>
                  <select className="input-premium w-full rounded-xl px-4 py-3 transition-colors font-medium">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t flex justify-end gap-3" style={{ borderColor: "var(--border-soft)" }}>
                <button
                  type="button"
                  className="btn-primary px-6 py-3 text-sm font-bold rounded-xl shadow-lg transition-all"
                >
                  Save Global Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
