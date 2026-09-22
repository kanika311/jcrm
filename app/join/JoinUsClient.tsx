"use client";

import JoinForm from "./JoinForm";

export default function JoinUsClient() {
  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent dark:bg-gray-950">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#0055FF]/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4">
        <JoinForm />
      </div>
    </div>
  );
}
