"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function VideoModalIsland() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVideoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVideoOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsVideoOpen(true)}
        className="px-5 py-3 sm:px-8 sm:py-4 rounded-full text-xs sm:text-base md:text-lg font-extrabold flex items-center justify-center gap-2 text-white transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-red-500/30 cursor-pointer"
        style={{ background: "#FF0000" }}
        aria-label="Watch video: Why choose JCRM Technologies?"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        Why JCRM?
      </button>

      {mounted && isVideoOpen && createPortal(
        <div
          className="fixed inset-0 z-[99999] overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsVideoOpen(false)}
        >
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
            <div
              className="relative w-full max-w-4xl my-6 text-left bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 border-red-600/60"
              style={{ boxShadow: "0 0 50px rgba(255, 0, 0, 0.5)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-3 right-3 z-50 p-2.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center border border-white/20 shadow-lg"
                aria-label="Close Video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative w-full pt-[56.25%] bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src="https://www.youtube.com/embed/AHzgyPR-Cy4?autoplay=1&rel=0"
                  title="Why JCRM Technologies?"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
