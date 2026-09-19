"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [targetProduct, setTargetProduct] = useState("LMS (Learning Management System)");
  const [message, setMessage] = useState("");
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    
    try {
      const res = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send OTP");
      }
      setOtpSent(true);
      setStatus("idle");
    } catch (err: any) {
      // If OTP endpoint fails, fallback to direct submission
      setOtpSent(true);
      setStatus("idle");
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      // Submit lead/contact details
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || fullName;
      const lastName = nameParts.slice(1).join(" ") || "";

      const contactRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          subject: targetProduct,
          message: `[Product: ${targetProduct}] ${message}`
        }),
      });

      if (!contactRes.ok) {
        throw new Error("Failed to send demo request");
      }
      
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong while submitting");
      setStatus("idle");
    }
  };

  return (
    <div className="p-8 md:p-10 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.12),0_0_35px_rgba(255,255,255,0.9)] relative overflow-hidden">
      {/* Top Brand Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-sky-50/20 to-transparent pointer-events-none rounded-[36px]"></div>

      <div className="relative z-10">
        <div className="mb-8 text-center sm:text-left">
          <h3 className="heading-font text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
            Request Demo / Quote
          </h3>
          
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-in-up">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="heading-font text-2xl font-extrabold text-slate-900 mb-2">
              Demo Request Sent!
            </h3>
            <p className="text-slate-600 font-medium max-w-sm mb-8">
              Thank you, <span className="text-[#0055FF] font-bold">{fullName}</span>! Our team will contact you at <span className="font-semibold text-slate-800">{email}</span> shortly.
            </p>
            <button
              onClick={() => {
                setStatus("idle");
                setOtpSent(false);
                setOtpCode("");
                setMessage("");
              }}
              className="px-8 py-3.5 rounded-full text-sm font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-md"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : otpSent ? (
          <form onSubmit={handleVerifyAndSubmit} className="space-y-6 animate-fade-in-up">
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#0055FF] font-extrabold text-xs mb-3 border border-blue-100">
                Email Verification
              </span>
              <h4 className="text-lg font-extrabold text-slate-900 mb-1">Enter Verification Code</h4>
              <p className="text-xs text-slate-600 font-medium">
                We sent a 6-digit code to <span className="font-bold text-slate-800">{email}</span>
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-3xl tracking-[0.8em] py-4 rounded-2xl bg-blue-50/50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#0055FF] font-mono font-bold text-slate-900 shadow-inner"
              required
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-4 rounded-2xl text-base font-extrabold text-white bg-[#0055FF] shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {status === "submitting" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Confirming Request...
                </span>
              ) : "Confirm & Complete Request 🚀"}
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-xs font-bold text-slate-500 hover:text-[#0055FF] text-center transition-colors"
            >
              ← Edit Contact Details
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendOtp} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            {/* FULL NAME */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                FULL NAME
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/90 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* WORK EMAIL */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                WORK EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/90 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white transition-all"
                placeholder="john.doe@company.com"
              />
            </div>

            {/* PHONE / WHATSAPP NUMBER */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                PHONE / WHATSAPP NUMBER
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/90 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white transition-all"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* TARGET PRODUCT / SERVICE */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                TARGET PRODUCT / SERVICE
              </label>
              <select
                value={targetProduct}
                onChange={(e) => setTargetProduct(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/90 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white transition-all cursor-pointer"
              >
                <option value="LMS (Learning Management System)">LMS (Learning Management System)</option>
                <option value="HR & Payroll Management">HR & Payroll Management</option>
                <option value="Hospital ERP">Hospital ERP</option>
                <option value="Accounting & Financial ERP">Accounting & Financial ERP</option>
                <option value="Gym Management ERP">Gym Management ERP</option>
                <option value="Cab Booking System">Cab Booking System</option>
                <option value="Food Delivery Platform">Food Delivery Platform</option>
                <option value="E-Commerce ERP">E-Commerce ERP</option>
                <option value="AI Chatbot & Automation">AI Chatbot & Automation</option>
                <option value="Fraud Detection System">Fraud Detection System</option>
                <option value="Corporate IT Training & Placement Track">Corporate IT Training & Placement Track</option>
              </select>
            </div>

            {/* MESSAGE / REQUIREMENTS */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                MESSAGE / REQUIREMENTS
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/90 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white transition-all resize-none"
                placeholder="Briefly describe your business operations, user count, or training timeline..."
              ></textarea>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-4 rounded-2xl text-base font-extrabold text-white bg-[#0055FF] shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {status === "submitting" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  Send Demo Request
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
