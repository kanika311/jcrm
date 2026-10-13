import React from "react";

interface LogoProps {
  className?: string;
}

export function CompanyLogo({ logoKey, className = "h-10 max-h-12 w-auto max-w-full" }: { logoKey: string; className?: string }) {
  switch (logoKey) {
    case "capgemini":
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <svg viewBox="0 0 40 40" className="w-9 h-9 shrink-0" fill="none">
            <path
              d="M20 2C13 10 7 17 7 24C7 29 11 32 16 32C18 32 19.5 31.5 20 30.5C20.5 31.5 22 32 24 32C29 32 33 29 33 24C33 17 27 10 20 2Z"
              fill="#0070AD"
            />
            <path d="M18 30H22L24 38H16L18 30Z" fill="#0070AD" />
            <circle cx="20" cy="21" r="3.5" fill="white" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="text-[#0070AD] font-bold text-xl sm:text-2xl tracking-tight leading-none font-sans">
              Capgemini
            </span>
            <span className="text-[7px] sm:text-[8px] font-semibold tracking-widest text-slate-500 uppercase mt-0.5">
              Consulting • Technology • Outsourcing
            </span>
          </div>
        </div>
      );

    case "reliance":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <div className="bg-[#0A387E] px-5 py-2.5 rounded-sm shadow-xs border border-blue-900 flex items-center justify-center">
            <span className="text-white font-black text-xl sm:text-2xl tracking-wider font-sans uppercase">
              RELIANCE
            </span>
          </div>
        </div>
      );

    case "nagarro":
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <svg viewBox="0 0 42 42" className="w-8 h-8 shrink-0" fill="none">
            <path
              d="M12 28C7 28 4 24 4 19C4 13 8 9 14 9C21 9 24 21 30 21C34 21 37 18 37 14C37 9 33 6 28 6C23 6 18 10 18 10"
              stroke="#00D285"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30 14C35 14 38 18 38 23C38 29 34 33 28 33C21 33 18 21 12 21C8 21 5 24 5 28C5 33 9 36 14 36"
              stroke="#00A389"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-slate-900 font-bold text-2xl tracking-tight font-sans">
            nagarro
          </span>
        </div>
      );

    case "g4s":
      return (
        <div className={`flex items-center justify-center font-black text-3xl sm:text-4xl tracking-tighter ${className}`}>
          <span className="text-black">G</span>
          <span className="text-[#E31B23] mx-[-2px] text-4xl sm:text-5xl font-black">4</span>
          <span className="text-black">S</span>
        </div>
      );

    case "hettich":
      return (
        <div className={`flex items-center gap-3 ${className}`}>
          <div className="flex gap-[3px] items-center -skew-x-12">
            <div className="w-2.5 h-7 bg-[#FFD100] rounded-xs" />
            <div className="w-2.5 h-7 bg-[#E30613] rounded-xs" />
            <div className="w-2.5 h-7 bg-[#009FE3] rounded-xs" />
            <div className="w-2.5 h-7 bg-[#009640] rounded-xs" />
          </div>
          <span className="text-slate-900 font-extrabold text-2xl sm:text-3xl tracking-tight">
            Hettich
          </span>
        </div>
      );

    case "lenze":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-[#0055A5] font-black text-3xl sm:text-4xl tracking-tight font-sans">
            Lenze
          </span>
        </div>
      );

    case "cushman-wakefield":
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
            <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" stroke="#E21836" strokeWidth="2.5" />
            <polygon points="18,8 27,13 27,23 18,28 9,23 9,13" fill="#E21836" />
            <circle cx="18" cy="18" r="3" fill="white" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="text-slate-900 font-extrabold text-sm sm:text-base tracking-tight leading-tight uppercase font-sans">
              Cushman &
            </span>
            <span className="text-slate-900 font-extrabold text-sm sm:text-base tracking-tight leading-tight uppercase font-sans">
              Wakefield
            </span>
          </div>
        </div>
      );

    case "pentair":
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none">
            <path d="M16 2L2 16L16 30L30 16L16 2Z" fill="#00A389" />
            <path d="M16 8L8 16L16 24L24 16L16 8Z" fill="#002D62" />
          </svg>
          <span className="text-[#002D62] font-black text-xl sm:text-2xl tracking-wider uppercase font-sans">
            PENTAIR
          </span>
        </div>
      );

    case "eureka-forbes":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <div className="border-2 border-[#004B87] px-3.5 py-1.5 rounded-sm flex flex-col items-center">
            <span className="text-[#004B87] font-black text-base sm:text-lg tracking-wider uppercase font-sans leading-none">
              EUREKA
            </span>
            <span className="text-[#004B87] font-bold text-xs sm:text-sm tracking-widest uppercase font-sans mt-0.5">
              FORBES
            </span>
          </div>
        </div>
      );

    case "haworth":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <div className="bg-[#D31F2E] px-4 py-2 rounded-xs">
            <span className="text-white font-bold text-lg sm:text-xl tracking-wider uppercase font-sans">
              HAWORTH
            </span>
          </div>
        </div>
      );

    case "healthcare":
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#E21836]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM11 7v3H8v2h3v3h2v-3h3v-2h-3V7h-2z" />
            </svg>
          </div>
          <span className="text-slate-800 font-semibold text-lg sm:text-xl lowercase font-sans">
            healthcare
          </span>
        </div>
      );

    case "hotel-rivoli":
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <div className="w-8 h-8 rounded-md bg-blue-900/10 border border-blue-900/20 flex items-center justify-center text-[#1C3F7A]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[#1C3F7A] font-extrabold text-base sm:text-lg tracking-wider font-serif">
              RIVOLI
            </span>
            <span className="text-[9px] font-bold text-amber-500 tracking-widest leading-none">
              ★★★★ HOTEL
            </span>
          </div>
        </div>
      );

    case "armstrong":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center font-black text-sm">
            A
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-black font-extrabold text-base sm:text-lg tracking-tight">
              Armstrong
            </span>
            <span className="text-[8px] font-bold tracking-widest text-slate-600 uppercase mt-0.5">
              CEILINGS
            </span>
          </div>
        </div>
      );

    case "karcher":
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <span className="text-black font-black text-xl sm:text-2xl tracking-tighter uppercase font-sans">
            KÄRCHER
          </span>
          <div className="flex gap-1 w-full mt-0.5">
            <div className="h-1.5 flex-1 bg-[#FFED00]" />
            <div className="h-1.5 flex-1 bg-[#FFED00]" />
          </div>
        </div>
      );

    case "haworth-design":
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <span className="text-[#DE1B76] font-bold text-xl sm:text-2xl tracking-wide uppercase font-sans">
            HAWORTH
          </span>
          <span className="text-slate-500 font-sans text-[10px] sm:text-[11px] lowercase tracking-normal">
            change by design
          </span>
        </div>
      );

    case "steelcase":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-black font-bold text-2xl sm:text-3xl tracking-tight font-sans">
            Steelcase
          </span>
        </div>
      );

    case "orient-craft":
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-3 border-[#F58220] absolute -left-1" />
            <div className="w-6 h-6 rounded-full border-3 border-[#00A389] absolute -right-1 opacity-80" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-slate-800 font-extrabold text-xs sm:text-sm uppercase tracking-wide">
              Orient Craft
            </span>
            <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest">
              LIMITED
            </span>
          </div>
        </div>
      );

    case "walking-tree":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none">
            <circle cx="18" cy="14" r="11" fill="#78B833" opacity="0.85" />
            <circle cx="12" cy="16" r="8" fill="#5B9B26" opacity="0.9" />
            <circle cx="24" cy="16" r="8" fill="#88C738" opacity="0.9" />
            <path d="M18 20L18 34" stroke="#F58220" strokeWidth="3" strokeLinecap="round" />
            <path d="M14 26L18 22L22 28" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="text-[#5B9B26] font-extrabold text-lg tracking-tight lowercase">
            walking <span className="text-[#F58220]">tree</span>
          </span>
        </div>
      );

    case "tcs":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="w-8 h-8 rounded-full bg-[#004A99] flex items-center justify-center text-white font-bold text-xs">
            TATA
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[#004A99] font-black text-xl tracking-tight leading-none">
              TCS
            </span>
            <span className="text-[8px] font-semibold text-slate-500 uppercase">
              Consultancy Services
            </span>
          </div>
        </div>
      );

    case "infosys":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-[#007CC3] font-bold text-2xl sm:text-3xl tracking-tight font-sans">
            Infosys
          </span>
        </div>
      );

    case "wipro":
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <div className="w-7 h-7 rounded-full border-2 border-dashed border-[#0055FF] flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600" />
          </div>
          <span className="text-slate-900 font-extrabold text-2xl tracking-tight lowercase">
            wipro
          </span>
        </div>
      );

    case "cognizant":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="w-6 h-6 rounded-xs bg-[#0033A0] rotate-45 flex items-center justify-center text-white text-[10px] font-bold">
            <span className="-rotate-45">C</span>
          </div>
          <span className="text-[#0033A0] font-bold text-xl sm:text-2xl tracking-tight">
            Cognizant
          </span>
        </div>
      );

    case "tech-mahindra":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="flex gap-1 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E31837]" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-slate-800 font-bold text-sm tracking-tight">Tech</span>
            <span className="text-[#E31837] font-black text-base tracking-tight">Mahindra</span>
          </div>
        </div>
      );

    case "hcltech":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-[#2C2E82] font-black text-2xl sm:text-3xl tracking-tight font-sans">
            HCL<span className="text-[#0085CA]">Tech</span>
          </span>
        </div>
      );

    case "accenture":
      return (
        <div className={`flex items-center gap-1 ${className}`}>
          <span className="text-slate-900 font-bold text-2xl tracking-tight lowercase">
            accenture
          </span>
          <span className="text-[#A100FF] font-black text-2xl leading-none">&gt;</span>
        </div>
      );

    case "sap":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <div className="bg-gradient-to-r from-[#008FD3] to-[#0055A5] px-4 py-1.5 rounded-xs shadow-xs">
            <span className="text-white font-black text-xl sm:text-2xl tracking-widest font-sans">
              SAP
            </span>
          </div>
        </div>
      );

    case "oracle":
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-[#C74634] font-black text-2xl sm:text-3xl tracking-wider font-sans uppercase">
            ORACLE
          </span>
        </div>
      );

    case "salesforce":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 32 32" className="w-8 h-8 shrink-0 text-[#00A1E0] fill-current">
            <path d="M19.5 7.5a6 6 0 0 0-5.7 4.1A5 5 0 0 0 9 15.5a5 5 0 0 0 .3 1.7A6 6 0 0 0 5 22.5 6 6 0 0 0 11 28.5h11a6 6 0 0 0 6-6 6 6 0 0 0-4.5-5.8 7 7 0 0 0-4-9.2z" />
          </svg>
          <span className="text-[#00A1E0] font-black text-xl tracking-tight">
            salesforce
          </span>
        </div>
      );

    case "google-cloud":
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <div className="flex items-center font-medium text-lg">
            <span className="text-[#4285F4] font-bold">G</span>
            <span className="text-[#EA4335] font-bold">o</span>
            <span className="text-[#FBBC05] font-bold">o</span>
            <span className="text-[#4285F4] font-bold">g</span>
            <span className="text-[#34A853] font-bold">l</span>
            <span className="text-[#EA4335] font-bold">e</span>
          </div>
          <span className="text-slate-600 font-semibold text-lg tracking-tight">Cloud</span>
        </div>
      );

    case "lt-technology":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="w-8 h-8 rounded-full border-2 border-[#0055A5] flex items-center justify-center font-black text-xs text-[#0055A5]">
            L&T
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-slate-900 font-extrabold text-sm tracking-tight">
              L&T Tech
            </span>
            <span className="text-[8px] font-semibold text-slate-500 uppercase mt-0.5">
              Services
            </span>
          </div>
        </div>
      );

    default:
      return (
        <div className={`flex items-center justify-center font-bold text-lg text-slate-800 ${className}`}>
          {logoKey}
        </div>
      );
  }
}
