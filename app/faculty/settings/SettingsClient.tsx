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

    const payload = {
      ...formData,
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

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <h1 className="text-3xl font-extrabold text-txt-primary mb-8">Faculty Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 font-bold rounded-xl border transition-colors ${activeTab === 'profile' ? 'bg-violet-600/10 text-violet-400 border-violet-500/20' : 'text-txt-secondary hover:bg-white/[0.02] border-transparent'}`}
          >
            Faculty Profile
          </button>
          <button className="w-full text-left px-4 py-3 text-txt-secondary hover:bg-white/[0.02] hover:text-txt-primary font-medium rounded-xl transition-colors">Payout Details & Tax</button>
          <button className="w-full text-left px-4 py-3 text-txt-secondary hover:bg-white/[0.02] hover:text-txt-primary font-medium rounded-xl transition-colors">Team Access</button>
        </div>

        <div className="md:col-span-2 bg-[#131B2F] border border-bdr-soft rounded-[24px] shadow-lg p-8">
          
          {activeTab === "profile" && (
            <>
              <h2 className="text-xl font-bold text-txt-primary mb-6 border-b border-bdr-soft pb-4">Public Faculty Profile</h2>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-white/5 rounded-xl w-full"></div>
                  <div className="h-10 bg-white/5 rounded-xl w-full"></div>
                  <div className="h-24 bg-white/5 rounded-xl w-full"></div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {message && (
                    <div className={`p-4 rounded-xl font-bold ${message.includes("success") ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {message}
                    </div>
                  )}

                  <div>
                     <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Profile Picture</label>
                     <ImageUpload currentImage={formData.image} onUploadSuccess={url => setFormData(prev => ({ ...prev, image: url }))} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">First Name</label>
                      <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Last Name</label>
                      <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Email</label>
                      <input type="email" value={formData.email} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none transition-colors opacity-70" disabled />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Phone Number</label>
                      <PhoneInput
                        international
                        defaultCountry="US"
                        value={formData.phoneNumber}
                        onChange={(val) => setFormData(prev => ({ ...prev, phoneNumber: val?.toString() || "" }))}
                        className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors phone-input-container"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Professional Title / Organization</label>
                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Faculty Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={5} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors resize-none"></textarea>
                  </div>

                  <h3 className="font-bold text-lg pt-4 border-t border-bdr-soft">Professional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Current Status</label>
                        <input type="text" name="lifeStage" value={formData.lifeStage} onChange={handleChange} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors" placeholder="e.g. Industry Professional" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Degree</label>
                        <input type="text" name="degree" value={formData.degree} onChange={handleChange} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors" placeholder="e.g. Ph.D. Computer Science" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Years of Experience</label>
                        <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors" placeholder="e.g. 5" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Tech Stack</label>
                        <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors" placeholder="e.g. React, Python" />
                     </div>
                  </div>

                  <div className="pt-4 border-t border-bdr-soft">
                     <h3 className="font-bold text-lg mb-4">Location</h3>
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

                  <div className="pt-4 border-t border-bdr-soft">
                     <LanguageSelector languages={formData.languages} onChange={val => setFormData(prev => ({ ...prev, languages: val }))} />
                  </div>

                  <h3 className="font-bold text-lg pt-4 border-t border-bdr-soft">Social Links</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">LinkedIn URL</label>
                        <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors" placeholder="https://linkedin.com/in/username" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">GitHub URL</label>
                        <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors" placeholder="https://github.com/username" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-txt-secondary mb-2 uppercase">Portfolio Website</label>
                        <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl px-4 py-3 text-txt-primary focus:outline-none focus:border-violet-500 transition-colors" placeholder="https://mywebsite.com" />
                     </div>
                  </div>

                  <div className="pt-6 border-t border-bdr-soft flex justify-end gap-3">
                    <button type="submit" disabled={saving} className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-txt-primary text-sm font-bold rounded-xl shadow-lg shadow-violet-900/50 transition-all">
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
