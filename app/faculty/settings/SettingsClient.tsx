"use client";
import { useState, useEffect } from "react";
import LocationSelector from "@/components/LocationSelector";
import LanguageSelector from "@/components/LanguageSelector";
import ImageUpload from "@/components/ImageUpload";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    image: "",
    bio: "",
    lifeStage: "",
    organization: "",
    degree: "",
    experienceYears: "",
    techStack: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    languages: [] as string[],
  });

  const [payout, setPayout] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",
    pan: "",
    gstin: "",
  });
  const [team, setTeam] = useState<{ email: string; role: string; status: string }[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Co-instructor");

  useEffect(() => {
    fetchProfile();
    fetchFacultySettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        
        let firstName = "";
        let lastName = "";
        if (data.name) {
          const parts = data.name.split(" ");
          firstName = parts[0] || "";
          lastName = parts.slice(1).join(" ") || "";
        }

        setFormData({
          firstName,
          lastName,
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          image: data.image || "",
          bio: data.profile?.bio || "",
          lifeStage: data.profile?.lifeStage || "",
          organization: data.profile?.organization || "",
          degree: data.profile?.degree || "",
          experienceYears: data.profile?.experienceYears?.toString() || "",
          techStack: data.profile?.techStack?.join(", ") || "",
          linkedinUrl: data.profile?.linkedinUrl || "",
          githubUrl: data.profile?.githubUrl || "",
          portfolioUrl: data.profile?.portfolioUrl || "",
          country: data.profile?.country || "",
          state: data.profile?.state || "",
          city: data.profile?.city || "",
          pincode: data.profile?.pincode || "",
          languages: data.profile?.languages || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultySettings = async () => {
    try {
      const res = await fetch("/api/faculty/settings");
      if (!res.ok) return;
      const data = await res.json();
      if (data.payout) setPayout((prev) => ({ ...prev, ...data.payout }));
      if (Array.isArray(data.team)) setTeam(data.team);
    } catch (err) {
      console.error(err);
    }
  };

  const saveFacultySettings = async (payload: { payout?: typeof payout; team?: typeof team }) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/faculty/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage("Saved successfully!");
      } else {
        setMessage("Failed to save settings.");
      }
    } catch {
      setMessage("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const normalizeUrl = (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return "";
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      return `https://${trimmed}`;
    };

    const payload = {
      ...formData,
      linkedinUrl: normalizeUrl(formData.linkedinUrl),
      githubUrl: normalizeUrl(formData.githubUrl),
      portfolioUrl: normalizeUrl(formData.portfolioUrl),
      techStack: formData.techStack ? formData.techStack.split(",").map(s => s.trim()).filter(Boolean) : []
    };

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
        // We do not reload here, dashboard will fetch fresh data on navigation
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full !bg-white !text-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/15";
  const labelClass = "block text-xs font-bold !text-slate-600 mb-2 uppercase tracking-wider";

  return (
    <div
      data-theme="light"
      className="faculty-settings max-w-[1000px] mx-auto space-y-8 pb-24 text-slate-900"
      style={{ colorScheme: "light", color: "#0f172a" }}
    >
      <style>{`
        .faculty-settings input:not([type="file"]):not([type="hidden"]),
        .faculty-settings textarea,
        .faculty-settings select,
        .faculty-settings .PhoneInputInput {
          color: #0f172a !important;
          background-color: #ffffff !important;
          caret-color: #0f172a;
        }
        .faculty-settings input::placeholder,
        .faculty-settings textarea::placeholder {
          color: #94a3b8 !important;
        }
      `}</style>
     

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          {[
            { id: "profile", label: "Faculty Profile" },
            { id: "payout", label: "Payout Details & Tax" },
            { id: "team", label: "Team Access" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setMessage("");
              }}
              className={`w-full text-left px-4 py-3 font-bold rounded-xl border transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-50 text-[#0055FF] border-blue-200"
                  : "text-slate-600 hover:bg-slate-50 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="md:col-span-2 border border-slate-200 rounded-[24px] shadow-sm p-8"
          style={{ background: "#ffffff", color: "#0f172a" }}
        >
          
          {activeTab === "profile" && (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Public Faculty Profile</h2>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                  <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                  <div className="h-24 bg-slate-100 rounded-xl w-full"></div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {message && (
                    <div className={`p-4 rounded-xl font-bold ${message.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                      {message}
                    </div>
                  )}

                  <div>
                     <label className={labelClass}>Profile Picture</label>
                     <ImageUpload currentImage={formData.image} onUploadSuccess={url => setFormData(prev => ({ ...prev, image: url }))} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Email</label>
                      <input type="email" value={formData.email} className={`${inputClass} bg-slate-50 text-slate-500`} disabled />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        value={formData.phoneNumber}
                        onChange={(val) => setFormData(prev => ({ ...prev, phoneNumber: val?.toString() || "" }))}
                        className={`${inputClass} phone-input-container`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Professional Title / Organization</label>
                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} className={inputClass} placeholder="e.g. Senior Tech Lead @ JCRM" />
                  </div>
                  <div>
                    <label className={labelClass}>Faculty Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={5} className={`${inputClass} resize-none`} placeholder="Students will see this on your course page."></textarea>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 pt-4 border-t border-slate-200">Professional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={labelClass}>Current Status</label>
                        <input type="text" name="lifeStage" value={formData.lifeStage} onChange={handleChange} className={inputClass} placeholder="e.g. Industry Professional" />
                     </div>
                     <div>
                        <label className={labelClass}>Degree</label>
                        <input type="text" name="degree" value={formData.degree} onChange={handleChange} className={inputClass} placeholder="e.g. Ph.D. Computer Science" />
                     </div>
                     <div>
                        <label className={labelClass}>Years of Experience</label>
                        <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className={inputClass} placeholder="e.g. 5" />
                     </div>
                     <div>
                        <label className={labelClass}>Tech Stack</label>
                        <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} className={inputClass} placeholder="e.g. React, Python" />
                     </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                     <h3 className="font-bold text-lg text-slate-900 mb-4">Location</h3>
                     <LocationSelector 
                       country={formData.country} 
                       state={formData.state} 
                       city={formData.city} 
                       pincode={formData.pincode} 
                       onCountryChange={val => setFormData(prev => ({ ...prev, country: val }))} 
                       onStateChange={val => setFormData(prev => ({ ...prev, state: val }))} 
                       onCityChange={val => setFormData(prev => ({ ...prev, city: val }))} 
                       onPincodeChange={val => setFormData(prev => ({ ...prev, pincode: val }))} 
                     />
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                     <LanguageSelector languages={formData.languages} onChange={val => setFormData(prev => ({ ...prev, languages: val }))} />
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 pt-4 border-t border-slate-200">Social Links</h3>
                  <div className="space-y-4">
                     <div>
                        <label className={labelClass}>LinkedIn URL</label>
                        <input type="text" inputMode="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className={inputClass} placeholder="linkedin.com/in/username" />
                     </div>
                     <div>
                        <label className={labelClass}>GitHub URL</label>
                        <input type="text" inputMode="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className={inputClass} placeholder="github.com/username" />
                     </div>
                     <div>
                        <label className={labelClass}>Portfolio Website</label>
                        <input type="text" inputMode="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} className={inputClass} placeholder="mywebsite.com" />
                     </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                    <button type="submit" disabled={saving} className="px-6 py-3 bg-[#0055FF] hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20">
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {activeTab === "payout" && (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                saveFacultySettings({ payout });
              }}
            >
              <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-200 pb-4">
                Payout Details & Tax
              </h2>
              <p className="text-sm text-slate-500">
                Course earnings will be transferred to this bank or UPI account. Keep PAN/GST updated for invoices.
              </p>
              {message && (
                <div className={`p-4 rounded-xl font-bold ${message.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {message}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Account Holder Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={payout.accountHolder}
                    onChange={(e) => setPayout((p) => ({ ...p, accountHolder: e.target.value }))}
                    placeholder="Name as per bank records"
                  />
                </div>
                <div>
                  <label className={labelClass}>Bank Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={payout.bankName}
                    onChange={(e) => setPayout((p) => ({ ...p, bankName: e.target.value }))}
                    placeholder="HDFC / SBI / ICICI"
                  />
                </div>
                <div>
                  <label className={labelClass}>IFSC Code</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={payout.ifsc}
                    onChange={(e) => setPayout((p) => ({ ...p, ifsc: e.target.value.toUpperCase() }))}
                    placeholder="HDFC0001234"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Account Number</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={payout.accountNumber}
                    onChange={(e) => setPayout((p) => ({ ...p, accountNumber: e.target.value }))}
                    placeholder="XXXXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className={labelClass}>UPI ID</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={payout.upiId}
                    onChange={(e) => setPayout((p) => ({ ...p, upiId: e.target.value }))}
                    placeholder="name@upi"
                  />
                </div>
                <div>
                  <label className={labelClass}>PAN</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={payout.pan}
                    onChange={(e) => setPayout((p) => ({ ...p, pan: e.target.value.toUpperCase() }))}
                    placeholder="ABCDE1234F"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>GSTIN (optional)</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={payout.gstin}
                    onChange={(e) => setPayout((p) => ({ ...p, gstin: e.target.value.toUpperCase() }))}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button type="submit" disabled={saving} className="px-6 py-3 bg-[#0055FF] hover:bg-blue-600 text-white text-sm font-bold rounded-xl">
                  {saving ? "Saving..." : "Save Payout Details"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "team" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-4">
                Team Access
              </h2>
              <p className="text-sm text-slate-500">
                Invite a TA or co-instructor to help manage your courses. They will get access after they join JCRM.
              </p>
              {message && (
                <div className={`p-4 rounded-xl font-bold ${message.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {message}
                </div>
              )}
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = inviteEmail.trim().toLowerCase();
                  if (!email || team.some((m) => m.email === email)) return;
                  const next = [...team, { email, role: inviteRole, status: "Invited" }];
                  setTeam(next);
                  setInviteEmail("");
                  saveFacultySettings({ team: next });
                }}
              >
                <input
                  type="email"
                  required
                  className={`${inputClass} flex-1`}
                  placeholder="teammate@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <select
                  className={inputClass}
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option>Co-instructor</option>
                  <option>Teaching Assistant</option>
                  <option>Viewer</option>
                </select>
                <button type="submit" disabled={saving} className="px-5 py-3 bg-[#0055FF] text-white text-sm font-bold rounded-xl shrink-0">
                  Invite
                </button>
              </form>

              <div className="space-y-2">
                {team.length === 0 ? (
                  <p className="text-sm text-slate-400 py-8 text-center border border-dashed border-slate-200 rounded-2xl">
                    No team members yet. Invite someone to share course access.
                  </p>
                ) : (
                  team.map((member) => (
                    <div
                      key={member.email}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{member.email}</p>
                        <p className="text-xs text-slate-500">
                          {member.role} · {member.status}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-bold text-rose-500 hover:text-rose-700"
                        onClick={() => {
                          const next = team.filter((m) => m.email !== member.email);
                          setTeam(next);
                          saveFacultySettings({ team: next });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
