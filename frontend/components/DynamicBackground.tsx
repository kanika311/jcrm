"use client";
import { useEffect, useState } from "react";

export default function DynamicBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden pointer-events-none">
       {/* Base Color */}
       <div className="absolute inset-0 transition-colors duration-1000" style={{ background: 'var(--bg-base)' }}></div>

       {/* Moving Gradients (CSS Animation) */}
       <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20 blur-[120px] animate-spin-slow mix-blend-screen">
          <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full animate-blob" style={{ background: 'var(--accent-primary)', animationDelay: '0s' }}></div>
          <div className="absolute top-[30%] right-[20%] w-[45vw] h-[45vw] rounded-full animate-blob" style={{ background: 'var(--accent-cyan)', animationDelay: '5s' }}></div>
          <div className="absolute bottom-[20%] left-[30%] w-[35vw] h-[35vw] rounded-full animate-blob" style={{ background: 'var(--accent-success)', animationDelay: '10s' }}></div>
       </div>
    </div>
  );
}
