"use client";

import JoinForm from "./JoinForm";

export default function JoinUsClient() {
  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-28 sm:pb-20 relative overflow-x-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent dark:bg-gray-950">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#0055FF]/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 pt-2 sm:pt-4">
        <JoinForm />
      </div>
    </div>
  );
}
