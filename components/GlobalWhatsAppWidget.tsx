"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiCheck,
  FiPhoneCall,
  FiHelpCircle,
  FiBookOpen,
  FiUsers,
  FiBriefcase,
  FiCompass,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const QUICK_TOPICS = [
  {
    id: "course",
    icon: FiBookOpen,
    label: "Course & Fees Enquiry",
    message: "Hello JCRM Technologies, I want information about course curriculum, batch duration, and admission fees.",
  },
  {
    id: "hiring",
    icon: FiBriefcase,
    label: "Hire Tech Talent",
    message: "Hello JCRM Founder, we are looking to hire verified developers and engineering candidates from JCRM.",
  },
  {
    id: "corporate",
    icon: FiUsers,
    label: "Corporate Cohort Training",
    message: "Hello JCRM, we want to discuss corporate engineering training and workshops for our company.",
  },
  {
    id: "counseling",
    icon: FiCompass,
    label: "Career Roadmap Guidance",
    message: "Hello JCRM, I need 1-on-1 guidance to choose the right tech stack and learning path for my career.",
  },
];

export default function GlobalWhatsAppWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(QUICK_TOPICS[0]);
  const [userText, setUserText] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("918310531309");
  const [buttonText, setButtonText] = useState("Course Enquiry");
  const [defaultMessage, setDefaultMessage] = useState(
    "Hello JCRM Technologies, I want to enquire about course details, fees, and admissions."
  );
  const [supportTitle, setSupportTitle] = useState("JCRM Support & Admissions");
  const [supportSubtitle, setSupportSubtitle] = useState("Online • Typically replies instantly");
  const [isEnabled, setIsEnabled] = useState(true);

  // Fetch admin configured WhatsApp settings
  useEffect(() => {
    let isMounted = true;
    fetch("/api/settings/whatsapp")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.data) {
          if (data.data.whatsappNumber) setWhatsappNumber(data.data.whatsappNumber);
          if (data.data.buttonText) setButtonText(data.data.buttonText);
          if (data.data.defaultMessage) setDefaultMessage(data.data.defaultMessage);
          if (data.data.supportTitle) setSupportTitle(data.data.supportTitle);
          if (data.data.supportSubtitle) setSupportSubtitle(data.data.supportSubtitle);
          if (data.data.isEnabled !== undefined) setIsEnabled(data.data.isEnabled);
        }
      })
      .catch((err) => {
        console.error("Could not fetch WhatsApp config, using defaults:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Hide on admin console pages so it doesn't obstruct admin controls
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin || !isEnabled) return null;

  const handleSendToWhatsApp = (messageOverride?: string) => {
    const finalMsg = (messageOverride || userText.trim() || selectedTopic.message || defaultMessage).trim();
    const cleanNum = whatsappNumber.replace(/[^0-9]/g, "") || "918310531309";
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[9999] font-sans selection:bg-emerald-500 selection:text-white">
      {/* POPUP CHAT BOX */}
      {isOpen && (
        <div className="mb-3.5 w-[calc(100vw-2.5rem)] sm:w-[360px] max-w-[370px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-fade-in-up transition-all">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-inner">
                  <FiMessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#075E54] rounded-full"></span>
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight text-white leading-tight">
                  {supportTitle}
                </h4>
                <p className="text-[11px] text-emerald-200 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  <span>{supportSubtitle}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="Close chat popup"
              aria-label="Close chat"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#ECE5DD] space-y-3.5 max-h-[380px] overflow-y-auto">
            {/* Incoming message bubble */}
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-xs text-xs text-slate-800 space-y-1.5 border border-black/5">
              <div className="font-black text-[#075E54] text-[11px] flex items-center gap-1">
                <span>JCRM Admissions Desk</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">
                  Verified
                </span>
              </div>
              <p className="leading-relaxed font-normal text-slate-700">
                Namaste! 🙏 Welcome to JCRM Technologies. How can we assist your technical career or admissions today?
              </p>
              <div className="text-[10px] text-slate-400 text-right">Just now</div>
            </div>

            {/* Quick Topic Chips */}
            <div className="space-y-2 pt-0.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-600 px-1">
                Quick Select Query:
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {QUICK_TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  const isSelected = selectedTopic.id === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopic(topic);
                        setUserText(topic.message);
                      }}
                      className={`text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border cursor-pointer ${
                        isSelected
                          ? "bg-white border-[#075E54] text-[#075E54] shadow-xs"
                          : "bg-white/85 hover:bg-white border-transparent text-slate-700 hover:shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#075E54]" : "text-slate-500"}`} />
                        <span>{topic.label}</span>
                      </div>
                      {isSelected && <FiCheck className="w-4 h-4 text-[#075E54]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input Message Area */}
            <div className="pt-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-600 px-1 mb-1">
                Or type custom message:
              </div>
              <textarea
                rows={2}
                value={userText || selectedTopic.message}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Type your query for WhatsApp..."
                className="w-full bg-white text-slate-900 font-medium text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] shadow-2xs resize-none"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <button
              onClick={() => handleSendToWhatsApp()}
              className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black shadow-md shadow-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <FiSend className="w-4 h-4" />
              <span>Send Query on WhatsApp</span>
            </button>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-semibold">
                Direct to: +{whatsappNumber}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CIRCULAR WHATSAPP CALL-TO-ACTION BUTTON */}
      <div className="relative group flex items-center justify-end">
        {/* Subtle Pulse Radar Wave Ring */}
        {!isOpen && (
          <>
            <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/35 animate-ping pointer-events-none" />
            <span className="absolute -inset-3 rounded-full bg-[#25D366]/20 animate-pulse pointer-events-none" />
          </>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] hover:brightness-105 active:scale-95 text-white shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-600/60 transition-all duration-300 cursor-pointer border-2 border-white/60 z-10"
          title="Chat on WhatsApp with JCRM"
          aria-label="WhatsApp Chat"
        >
          {isOpen ? (
            <FiX className="w-7 h-7 text-white transition-transform duration-200" />
          ) : (
            <FaWhatsapp className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>
      </div>
    </div>
  );
}
