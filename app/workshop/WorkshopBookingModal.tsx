"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface WorkshopBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopTitle: string;
  workshopDomain: string;
}

export default function WorkshopBookingModal({ isOpen, onClose, workshopTitle, workshopDomain }: WorkshopBookingModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);
  const [formData, setFormData] = useState({
    organizerName: "",
    institutionName: "",
    email: "",
    mobile: "",
    audienceSize: "100-300 Students / Attendees",
    approxBudget: "₹50,000 - ₹1,00,000",
    deliveryMode: "On-Campus Physical Workshop",
    proposedDates: ""
  });

  if (!isOpen) return null;

  const handleSendLeadToFounder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizerName || !formData.institutionName || !formData.mobile || !formData.email) {
      alert("Please fill in your name, institution, mobile, and work email.");
      return;
    }

    const founderPhone = "918310531309";

    // Structured private lead message for Founder
    const message = `🎓 *NEW WORKSHOP BOOKING LEAD* 🎓
--------------------------------------------
Hello Founder, a new workshop booking lead has been submitted for commercial review:

📌 *Workshop Domain:* ${workshopTitle}
🏷 *Domain Category:* ${workshopDomain}

🏛 *Organization / Institution:* ${formData.institutionName}
👤 *Organizer Contact Person:* ${formData.organizerName}
📱 *WhatsApp Mobile:* ${formData.mobile}
✉️ *Work Email:* ${formData.email}

📊 *Event Scope & Budget Bracket:*
• *Target Audience Size:* ${formData.audienceSize}
• *Approximate Budget:* ${formData.approxBudget}
• *Preferred Delivery Mode:* ${formData.deliveryMode}
• *Proposed Dates:* ${formData.proposedDates || "Flexible / To Be Finalized"}

--------------------------------------------
🔒 *Note:* Private booking lead for Founder commercial review and proposal dispatch.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${founderPhone}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fade-in" 
      style={{ margin: 0 }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-white shadow-[0_25px_70px_rgba(0,85,255,0.25)] border border-blue-100 flex flex-col max-h-[85vh] overflow-hidden m-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-blue-100 flex items-start justify-between shrink-0 bg-blue-50/40">
          <div>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              CAMPUS & CORPORATE WORKSHOP BOOKING
            </span>
            <h2 className="heading-font text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 leading-tight">
              Book Workshop: <span className="text-[#0055FF]">{workshopTitle}</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg transition-colors cursor-pointer shrink-0 ml-3 shadow-sm border border-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSendLeadToFounder} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1 min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Organizer / Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Prof. Rajesh Sharma / Dr. Anjali"
                  className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                  value={formData.organizerName}
                  onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  College / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="SMVITM Udupi / Apex Tech"
                  className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  WhatsApp Mobile *
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

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Work / Official Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="hod.cs@university.edu.in"
                  className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Approx Audience Size
                </label>
                <select
                  className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                  value={formData.audienceSize}
                  onChange={(e) => setFormData({ ...formData, audienceSize: e.target.value })}
                >
                  <option value="50-100 Students / Attendees">50-100 Students / Attendees</option>
                  <option value="100-300 Students / Attendees">100-300 Students / Attendees</option>
                  <option value="300-500 Campus Batch">300-500 Campus Batch</option>
                  <option value="500+ Large Campus Auditorium">500+ Large Campus Auditorium</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Approx Budget Bracket
                </label>
                <select
                  className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                  value={formData.approxBudget}
                  onChange={(e) => setFormData({ ...formData, approxBudget: e.target.value })}
                >
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000+ Enterprise / Campus">₹1,00,000+ Enterprise / Campus</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Preferred Mode
                </label>
                <select
                  className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                  value={formData.deliveryMode}
                  onChange={(e) => setFormData({ ...formData, deliveryMode: e.target.value })}
                >
                  <option value="On-Campus Physical Workshop">On-Campus Physical Workshop</option>
                  <option value="Live Online Interactive Bootcamp">Live Online Interactive Bootcamp</option>
                  <option value="Hybrid Model (Online + Lab)">Hybrid Model (Online + Lab)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Proposed Dates
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next Month / Feb 15-16"
                  className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                  value={formData.proposedDates}
                  onChange={(e) => setFormData({ ...formData, proposedDates: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-4 sm:px-8 sm:py-4 border-t border-blue-100 bg-slate-50 shrink-0">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-.981z"/>
              </svg>
              Send Workshop Lead to Founder on WhatsApp (+91 8310531309)
            </button>
            <p className="text-[11px] font-semibold text-slate-400 text-center mt-2">
              📲 Private commercial lead routed directly to Founder for proposal quotation & date confirmation.
            </p>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
}
