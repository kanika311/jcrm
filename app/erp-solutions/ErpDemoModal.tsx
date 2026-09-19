"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ErpDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productId?: string;
}

export default function ErpDemoModal({ isOpen, onClose, productName = "JCRM Enterprise ERP", productId }: ErpDemoModalProps) {
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
    name: "",
    email: "",
    phone: "",
    company: "",
    usersCount: "10-50",
    demoType: "Online 1-on-1 Guided Demo",
    notes: ""
  });

  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill in your name, email, and phone number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 800);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-modal-${index + 1}`);
      nextInput?.focus();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fade-in" 
      style={{ margin: 0 }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,85,255,0.2)] border border-blue-100 flex flex-col max-h-[85vh] overflow-hidden m-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-blue-100 flex items-start justify-between shrink-0 bg-blue-50/40">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50 rounded-full border border-blue-100">
              1-CLICK DEMO & ROI CONSULTATION
            </span>
            <h2 className="heading-font text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 leading-tight">
              Request Demo for <span className="text-[#0055FF]">{productName}</span>
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

        {step === "form" && (
          <form onSubmit={handleSubmitForm} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1 min-h-0">
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-2">
                See how our self-customizable ERP solution can automate your business operations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@company.com"
                    className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Org Name
                  </label>
                  <input
                    type="text"
                    placeholder="Apex Tech Pvt Ltd"
                    className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Expected Users / Staff
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                    value={formData.usersCount}
                    onChange={(e) => setFormData({ ...formData, usersCount: e.target.value })}
                  >
                    <option value="1-10">1-10 Users</option>
                    <option value="10-50">10-50 Users</option>
                    <option value="50-200">50-200 Users</option>
                    <option value="200+">200+ Enterprise Users</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Demo Mode
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                    value={formData.demoType}
                    onChange={(e) => setFormData({ ...formData, demoType: e.target.value })}
                  >
                    <option value="Online 1-on-1 Guided Demo">Online 1-on-1 Guided Demo</option>
                    <option value="Self-Paced Sandbox Trial">Self-Paced Sandbox Trial</option>
                    <option value="On-Site Enterprise Consultation">On-Site Enterprise Consultation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-6 py-4 sm:px-8 sm:py-4 border-t border-blue-100 bg-slate-50 shrink-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Sending Verification OTP..." : "Get Instant Live Demo Access 🚀"}
              </button>
              <p className="text-[11px] font-semibold text-slate-400 text-center mt-2">
                🔒 Zero commitment. Free custom feature consultation included.
              </p>
            </div>
          </form>
        )}

        {step === "otp" && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 min-h-0 flex flex-col justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0055FF] flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-md border border-blue-100">
              💬
            </div>

            <h3 className="heading-font text-2xl font-extrabold text-slate-900 mb-2">
              Verify your Phone Number
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-6">
              We sent a 4-digit verification code to <span className="font-extrabold text-slate-900">{formData.phone}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="max-w-xs mx-auto space-y-6 w-full">
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-modal-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 rounded-2xl bg-blue-50/50 border border-blue-200 text-center font-black text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl text-sm font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-lg cursor-pointer"
              >
                {loading ? "Verifying..." : "Confirm & Schedule Demo"}
              </button>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 min-h-0 text-center py-8 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black shadow-lg border border-emerald-100 animate-bounce">
              ✓
            </div>

            <h3 className="heading-font text-2xl sm:text-3xl font-extrabold text-slate-900">
              Demo Request Confirmed!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-md mx-auto leading-relaxed">
              Thank you <span className="font-extrabold text-slate-900">{formData.name}</span>. Our Senior Solutions Engineer will connect with you on <span className="font-extrabold text-[#0055FF]">{formData.phone}</span> within 15 minutes to configure your customized <span className="font-extrabold text-slate-900">{productName}</span> sandbox instance.
            </p>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs font-bold text-slate-700 max-w-sm mx-auto">
              📞 Direct Solutions Desk: <a href="tel:+918310531309" className="text-[#0055FF] underline">+91 8310531309</a>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-2xl text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md mt-4 cursor-pointer"
            >
              Close & Explore ERP Features
            </button>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
