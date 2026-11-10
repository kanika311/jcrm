"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiShield, FiCheck, FiX } from "react-icons/fi";

const CONSENT_KEY = "jcrm_cookie_consent_v2";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check previous consent choice
    const savedConsent = localStorage.getItem(CONSENT_KEY);

    if (savedConsent === "granted") {
      updateGoogleConsent("granted");
      setShowBanner(false);
    } else if (savedConsent === "denied") {
      updateGoogleConsent("denied");
      setShowBanner(false);
    } else {
      // Default to denied until explicit user consent
      updateGoogleConsent("denied");
      // Small timeout so banner slides in smoothly after page load
      const t = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const updateGoogleConsent = (state: "granted" | "denied") => {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("consent", "update", {
        analytics_storage: state,
        ad_storage: state,
        ad_user_data: state,
        ad_personalization: state,
      });
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    updateGoogleConsent("granted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "denied");
    updateGoogleConsent("denied");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-blue-500/20 dark:border-blue-500/30 rounded-2xl p-5 shadow-2xl shadow-blue-500/10">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0055FF] flex items-center justify-center shrink-0 border border-blue-500/20">
            <FiShield className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Privacy &amp; Cookie Preferences
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              We use secure strictly necessary cookies to keep you logged in and optional analytics
              cookies to understand how you interact with our courses. Read our{" "}
              <Link
                href="/legal/privacy"
                className="text-[#0055FF] dark:text-blue-400 font-bold underline hover:opacity-80"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-gray-800">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-sm cursor-pointer"
          >
            <FiCheck className="w-3.5 h-3.5" />
            <span>Accept All</span>
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <FiX className="w-3.5 h-3.5" />
            <span>Essential Only</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

