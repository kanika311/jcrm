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

  useEffect(() => {
    fetchProfile();
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
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Faculty Settings</h1>
      <p className="text-sm font-medium text-slate-500">This profile is what students see on your course page.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 font-bold rounded-xl border transition-colors ${activeTab === "profile" ? "bg-blue-50 text-[#0055FF] border-blue-200" : "text-slate-600 hover:bg-slate-50 border-transparent"}`}
          >
            Faculty Profile
          </button>
          <button type="button" className="w-full text-left px-4 py-3 text-slate-500 hover:bg-slate-50 font-medium rounded-xl transition-colors">Payout Details & Tax</button>
          <button type="button" className="w-full text-left px-4 py-3 text-slate-500 hover:bg-slate-50 font-medium rounded-xl transition-colors">Team Access</button>
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

        </div>
      </div>
    </div>
  );
}
