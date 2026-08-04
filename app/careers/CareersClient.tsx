"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CareersClient({ cmsData }: { cmsData?: any }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    degree: "",
    university: "",
    graduationYear: "",
    shortTermGoal: "",
    longTermGoal: "",
    weaknesses: "",
    strengths: "",
    hobbies: "",
    remarkableAchievements: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      nextStep();
      return;
    }
    
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Thank you! Your career guidance form has been submitted.");
        setStep(6); // Show success screen
      } else {
        setMessage(data.error || "Failed to submit form.");
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="heading-font text-4xl font-bold mb-4">{cmsData?.heading || "Join Our Team"}</h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {cmsData?.subheading || "Fill out the career guidance form below to explore opportunities with us."}
        </p>
      </div>

      {step <= 5 && (
        <div className="mb-8">
          <div className="flex justify-between items-center text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}% Completed</span>
          </div>
          <div className="progress-bar w-full">
            <motion.div 
              className="progress-bar-fill transition-all duration-300"
              style={{ background: 'var(--accent-primary)', width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="glass-md p-8 md:p-12 rounded-[32px] border relative overflow-hidden" style={{ borderColor: 'var(--border-soft)' }}>
        
        {message && step !== 6 && (
          <div className={`p-4 rounded-xl mb-8 font-bold bg-red-500/20 text-red-400`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="heading-font text-2xl font-bold border-b pb-2 mb-6" style={{ borderColor: 'var(--border-soft)' }}>Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">First Name *</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-premium" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Last Name *</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-premium" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email Address *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-premium" placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-premium" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-premium" placeholder="City, Country" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="heading-font text-2xl font-bold border-b pb-2 mb-6" style={{ borderColor: 'var(--border-soft)' }}>Educational Information</h2>
                <div>
                  <label className="block text-sm font-bold mb-2">Highest Degree *</label>
                  <input required type="text" name="degree" value={formData.degree} onChange={handleChange} className="input-premium" placeholder="B.Sc. in Computer Science" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">University / Institution *</label>
                  <input required type="text" name="university" value={formData.university} onChange={handleChange} className="input-premium" placeholder="Stanford University" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Graduation Year *</label>
                  <input required type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="input-premium" placeholder="2024" />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="heading-font text-2xl font-bold border-b pb-2 mb-6" style={{ borderColor: 'var(--border-soft)' }}>Your Goals</h2>
                <div>
                  <label className="block text-sm font-bold mb-2">Short-Term Goal</label>
                  <textarea name="shortTermGoal" value={formData.shortTermGoal} onChange={handleChange} rows={3} className="input-premium" placeholder="What are you aiming for in the next 1-2 years?" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Long-Term Goal</label>
                  <textarea name="longTermGoal" value={formData.longTermGoal} onChange={handleChange} rows={3} className="input-premium" placeholder="Where do you see yourself in 5+ years?" />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="heading-font text-2xl font-bold border-b pb-2 mb-6" style={{ borderColor: 'var(--border-soft)' }}>More About Yourself</h2>
                <div>
                  <label className="block text-sm font-bold mb-2">Strengths (Comma separated)</label>
                  <input type="text" name="strengths" value={formData.strengths} onChange={handleChange} className="input-premium" placeholder="E.g. React, Problem Solving, Leadership" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Weaknesses (Comma separated)</label>
                  <input type="text" name="weaknesses" value={formData.weaknesses} onChange={handleChange} className="input-premium" placeholder="E.g. Public Speaking, CSS Animations" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Hobbies</label>
                  <textarea name="hobbies" value={formData.hobbies} onChange={handleChange} rows={3} className="input-premium" placeholder="What do you do for fun?" />
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="heading-font text-2xl font-bold border-b pb-2 mb-6" style={{ borderColor: 'var(--border-soft)' }}>Remarkable Achievements</h2>
                <div>
                  <label className="block text-sm font-bold mb-2">Achievements (If any)</label>
                  <textarea name="remarkableAchievements" value={formData.remarkableAchievements} onChange={handleChange} rows={5} className="input-premium" placeholder="Awards, Open Source contributions, large projects..." />
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="success" variants={variants} initial="initial" animate="animate" exit="exit" className="text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="heading-font text-3xl font-bold">Application Received!</h2>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>{message}</p>
              </motion.div>
            )}

          </AnimatePresence>

          {step <= 5 && (
            <div className="flex justify-between items-center pt-8 mt-8 border-t" style={{ borderColor: 'var(--border-soft)' }}>
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="btn-secondary px-6 py-3 rounded-xl font-bold transition-all">
                  Back
                </button>
              ) : <div></div>}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  step === 5 ? "Submit Application" : "Continue"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
