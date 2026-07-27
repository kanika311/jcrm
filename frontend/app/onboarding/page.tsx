"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LocationSelector from "@/components/LocationSelector";
import LanguageSelector from "@/components/LanguageSelector";
import ImageUpload from "@/components/ImageUpload";

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR" | null>(null);
  const [lifeStage, setLifeStage] = useState("");
  const [organization, setOrganization] = useState("");
  const [degree, setDegree] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [techStack, setTechStack] = useState("");
  const [bio, setBio] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [image, setImage] = useState("");

  const handleNext = () => {
    if (step === 1 && !role) return setErrorMsg("Please select a role.");
    if (step === 2 && !lifeStage) return setErrorMsg("Please select your current status.");
    if (step === 3) {
      if (!techStack.trim()) return setErrorMsg("Please provide your tech stack.");
      if (lifeStage !== "Freelance Educator" && !organization.trim()) return setErrorMsg("Please provide your organization or college name.");
      if ((role === "INSTRUCTOR" || lifeStage === "Working Professional" || lifeStage === "Industry Professional" || lifeStage === "Subject Matter Expert" || lifeStage === "Freelance Educator") && !experienceYears.trim()) {
        return setErrorMsg("Please provide your years of experience.");
      }
      if (role === "STUDENT" && lifeStage === "Current Student" && !degree.trim()) {
        return setErrorMsg("Please provide the degree you are pursuing.");
      }
      if (!country || !state) {
        return setErrorMsg("Please select your Country and State.");
      }
      if (languages.length === 0) {
        return setErrorMsg("Please select at least one language.");
      }
    }
    setErrorMsg("");
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrorMsg("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMsg("");

    const techStackArray = techStack.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          lifeStage,
          organization,
          degree,
          experienceYears,
          techStack: techStackArray,
          bio,
          linkedinUrl,
          githubUrl,
          portfolioUrl,
          country,
          state,
          city,
          pincode,
          languages,
          image,
        }),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      // Update the NextAuth session cookie with the new role and onboarded status
      await update({ role, onboarded: true });

      router.push(role === "INSTRUCTOR" ? "/faculty" : "/student");
      router.refresh();
    } catch (err) {
      setErrorMsg("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Header */}
      <header className="p-6 flex justify-between items-center absolute top-0 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#0EA5E9] p-0.5">
             <div className="w-full h-full rounded-full" style={{ background: 'var(--bg-base)' }}></div>
          </div>
          <span className="heading-font font-bold text-xl tracking-tight">JCRM Technology</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              // Sign out and redirect to home
              import("next-auth/react").then(mod => mod.signOut({ callbackUrl: '/' }))
            }}
            className="text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 mt-16">
        <div className="w-full max-w-2xl animate-fade-in-up">
          
          {/* Progress Bar */}
          <div className="flex gap-2 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="h-1.5 flex-1 rounded-full transition-colors duration-500" 
                style={{ background: i <= step ? "var(--accent-primary)" : "var(--bg-surface)" }}
              />
            ))}
          </div>

          {errorMsg && (
            <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: ROLE */}
          {step === 1 && (
            <div className="animate-slide-in-right">
              <h1 className="heading-font text-4xl font-bold mb-4">Welcome to JCRM Technology</h1>
              <p className="text-lg mb-10" style={{ color: "var(--text-secondary)" }}>How do you plan to use the platform?</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setRole("STUDENT")}
                  className="p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02]"
                  style={{ 
                    borderColor: role === "STUDENT" ? "var(--accent-primary)" : "var(--border-soft)", 
                    background: role === "STUDENT" ? "color-mix(in srgb, var(--accent-primary) 5%, transparent)" : "var(--bg-surface)" 
                  }}
                >
                  <div className="text-3xl mb-4">🎓</div>
                  <h3 className="font-bold text-xl mb-2">I am a Student</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>I want to learn, enroll in courses, and build projects.</p>
                </button>

                <button 
                  onClick={() => setRole("INSTRUCTOR")}
                  className="p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02]"
                  style={{ 
                    borderColor: role === "INSTRUCTOR" ? "var(--accent-primary)" : "var(--border-soft)", 
                    background: role === "INSTRUCTOR" ? "color-mix(in srgb, var(--accent-primary) 5%, transparent)" : "var(--bg-surface)" 
                  }}
                >
                  <div className="text-3xl mb-4">👨‍🏫</div>
                  <h3 className="font-bold text-xl mb-2">I am an Instructor</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>I want to teach, manage courses, and review assignments.</p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LIFE STAGE */}
          {step === 2 && (
            <div className="animate-slide-in-right">
              <h1 className="heading-font text-3xl font-bold mb-4">Tell us about yourself</h1>
              <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>Which of these best describes your current status?</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(role === "INSTRUCTOR" 
                  ? ["Industry Professional", "Academic Professor", "Freelance Educator", "Subject Matter Expert"]
                  : ["Current Student", "Working Professional", "Tech Enthusiast", "Business Owner"]
                ).map((stage) => (
                  <button 
                    key={stage}
                    onClick={() => setLifeStage(stage)}
                    className="p-5 rounded-2xl border text-left transition-all hover:scale-[1.02]"
                    style={{ 
                      borderColor: lifeStage === stage ? "var(--accent-primary)" : "var(--border-soft)", 
                      background: lifeStage === stage ? "color-mix(in srgb, var(--accent-primary) 5%, transparent)" : "var(--bg-surface)" 
                    }}
                  >
                    <h3 className="font-bold">{stage}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC DETAILS */}
          {step === 3 && (
            <div className="animate-slide-in-right space-y-6">
              <h1 className="heading-font text-3xl font-bold mb-2">A few more details</h1>
              <p className="mb-8" style={{ color: "var(--text-secondary)" }}>Help us tailor your experience.</p>

              {(lifeStage === "Current Student" || lifeStage === "Academic Professor" || lifeStage === "") && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">{role === "INSTRUCTOR" ? "University / Institution" : "College / University Name"}</label>
                    <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder={role === "INSTRUCTOR" ? "e.g. MIT" : "e.g. Stanford University"} />
                  </div>
                  {role === "STUDENT" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Degree Pursued</label>
                    <input type="text" value={degree} onChange={e => setDegree(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="e.g. B.S. Computer Science" />
                  </div>
                  )}
                  {role === "INSTRUCTOR" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <input type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="e.g. 5" />
                  </div>
                  )}
                </>
              )}

              {(lifeStage === "Working Professional" || lifeStage === "Industry Professional" || lifeStage === "Subject Matter Expert") && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Company</label>
                    <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="e.g. Google" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <input type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="e.g. 3" />
                  </div>
                </>
              )}

              {(lifeStage === "Tech Enthusiast" || lifeStage === "Business Owner" || lifeStage === "Freelance Educator") && (
                <>
                  {lifeStage !== "Freelance Educator" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization / Project Name</label>
                    <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="e.g. Acme Corp or Personal Project" />
                  </div>
                  )}
                  {lifeStage === "Freelance Educator" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <input type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="e.g. 5" />
                  </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Tech Stack (comma separated)</label>
                <input type="text" value={techStack} onChange={e => setTechStack(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="e.g. React, Node.js, Python" />
              </div>

              <div className="pt-4 border-t" style={{ borderColor: "var(--border-soft)" }}>
                <h2 className="text-xl font-bold mb-4">Location</h2>
                <LocationSelector 
                  country={country} 
                  state={state} 
                  city={city} 
                  pincode={pincode} 
                  onCountryChange={setCountry} 
                  onStateChange={setState} 
                  onCityChange={setCity} 
                  onPincodeChange={setPincode} 
                />
              </div>

              <div className="pt-4 border-t" style={{ borderColor: "var(--border-soft)" }}>
                <LanguageSelector languages={languages} onChange={setLanguages} />
              </div>
            </div>
          )}

          {/* STEP 4: SOCIALS & BIO */}
          {step === 4 && (
            <div className="animate-slide-in-right space-y-6">
              <h1 className="heading-font text-3xl font-bold mb-2">Your Profile</h1>
              <p className="mb-8" style={{ color: "var(--text-secondary)" }}>Add a profile picture and social links to connect with others.</p>

              <div>
                <label className="block text-sm font-medium mb-4">Profile Picture</label>
                <ImageUpload currentImage={image} onUploadSuccess={setImage} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Short Bio</label>
                <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl resize-none" placeholder="I am a software engineer passionate about building scalable products..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="https://linkedin.com/in/username" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="https://github.com/username" />
              </div>

              {role === "INSTRUCTOR" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Portfolio Website</label>
                  <input type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="https://mywebsite.com" />
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-6 border-t" style={{ borderColor: "var(--border-soft)" }}>
            {step > 1 ? (
              <button onClick={handleBack} className="px-6 py-3 rounded-xl font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                Back
              </button>
            ) : <div></div>}
            
            {step < 4 ? (
              <button onClick={handleNext} className="btn-primary px-10 py-3 rounded-xl font-bold">
                Continue
              </button>
            ) : (
              <div className="flex gap-4">
                <button onClick={handleSubmit} disabled={isLoading} className="btn-secondary px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                  {isLoading ? "Saving..." : "Skip & Complete"}
                </button>
                <button onClick={handleSubmit} disabled={isLoading} className="btn-primary px-10 py-3 rounded-xl font-bold flex items-center gap-2">
                  {isLoading ? "Saving..." : "Complete Setup"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
