"use client";

import { useState } from "react";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateRole: string;
}

export default function HireModal({ isOpen, onClose, candidateName, candidateRole }: HireModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    company: "",
    hiringType: "Full-Time Internship / Job",
    interviewDate: "",
    interviewTimeSlot: "10:00 AM - 11:00 AM"
  });

  if (!isOpen) return null;

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email || !formData.interviewDate) {
      alert("Please fill in your name, mobile, email, and interview date.");
      return;
    }

    const founderPhone = "918310531309";
    
    // Structured, professional announcement text formatted for Founder & Team Group
    const message = `🎯 *INTERVIEW SCHEDULING REQUEST* 🎯
--------------------------------------------
Hello Founder, a recruiter has submitted an interview scheduling request for a JCRM team candidate:

👤 *Candidate Name:* ${candidateName}
💼 *Role / Position:* ${candidateRole}

🏢 *Recruiter & Company Details:*
• *Recruiter Name:* ${formData.name}
• *Company / Org:* ${formData.company || "Enterprise Recruiter"}
• *Contact Mobile:* ${formData.mobile}
• *Work Email:* ${formData.email}
• *Hiring Engagement:* ${formData.hiringType}

📅 *Proposed Interview Schedule:*
• *Interview Date:* ${formData.interviewDate}
• *Time Slot:* ${formData.interviewTimeSlot}

--------------------------------------------
📢 *READY ANNOUNCEMENT FOR TEAM WHATSAPP GROUP:*
"Attention @${candidateName}, an interview has been scheduled for the role of ${candidateRole} with ${formData.company || "a partner company"} on ${formData.interviewDate} at ${formData.interviewTimeSlot}. Please prepare accordingly!"`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${founderPhone}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-[36px] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_60px_rgba(0,85,255,0.2)] overflow-hidden p-6 sm:p-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-100 mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              DIRECT RECRUITMENT INTERVIEW
            </span>
            <h2 className="heading-font text-2xl font-extrabold text-slate-900 mt-2">
              Scheduling With <span className="text-[#0055FF]">{candidateName}</span>
            </h2>
            <p className="text-xs font-semibold text-slate-500">{candidateRole} @ JCRM Technologies</p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-black text-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSendToWhatsApp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Sharma"
                className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                placeholder="hr@company.com"
                className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Company / Agency Name
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Tech Solutions"
                className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Hiring Type
              </label>
              <select
                className="w-full px-3 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={formData.hiringType}
                onChange={(e) => setFormData({ ...formData, hiringType: e.target.value })}
              >
                <option value="Full-Time Placement">Full-Time Job</option>
                <option value="Internship to Hire">Internship to Hire</option>
                <option value="Project Contract">Project Contract</option>
                <option value="Part-Time / Freelance">Part-Time / Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Interview Date *
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={formData.interviewDate}
                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Time Slot
              </label>
              <select
                className="w-full px-3 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={formData.interviewTimeSlot}
                onChange={(e) => setFormData({ ...formData, interviewTimeSlot: e.target.value })}
              >
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-100">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-.981z"/>
              </svg>
              Send to Founder on WhatsApp (+91 8310531309)
            </button>
            <p className="text-[11px] font-semibold text-slate-400 text-center mt-2.5">
              📲 Sends formatted announcement to Founder for instant broadcast into the JCRM Team WhatsApp Group.
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}
