"use client";

import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(10);

  useEffect(() => {
    // Wrap in a tiny timeout to ensure it runs AFTER the initial paint
    const timer = setTimeout(() => {
      setOpacity(1);
      setTranslateY(0);
    }, 10); // 10ms delay is imperceptible but satisfies React's rules

    // Always clean up timers in useEffects!
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      style={{ 
        opacity, 
        transform: `translateY(${translateY}px)`,
        transition: "opacity 0.4s ease-out, transform 0.4s ease-out" 
      }}
    >
      {children}
    </div>
  );
}