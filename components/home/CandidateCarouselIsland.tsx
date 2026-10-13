"use client";

import { useRef, useState, useEffect, ReactNode } from "react";

export default function CandidateCarouselIsland({ children }: { children: ReactNode }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll carousel every 2.8s, pause when mouse is hovered
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-end gap-2 sm:gap-4 mb-4 shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-full border border-blue-100 shadow-xs">
          <svg className="w-4 h-4 text-[#0055FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          <span>Drag or scroll</span>
        </div>
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-md border border-blue-100 flex items-center justify-center text-slate-800 shadow-xs hover:bg-[#0055FF] hover:text-white transition-all cursor-pointer shrink-0"
          aria-label="Previous Placed Candidate Slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-md border border-blue-100 flex items-center justify-center text-slate-800 shadow-xs hover:bg-[#0055FF] hover:text-white transition-all cursor-pointer shrink-0"
          aria-label="Next Placed Candidate Slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={carouselRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-x-auto scrollbar-none rounded-2xl sm:rounded-[36px] scroll-smooth"
      >
        <div className="flex gap-4 sm:gap-6 py-2 sm:py-4 px-1 w-max">
          {children}
        </div>
      </div>
    </div>
  );
}
