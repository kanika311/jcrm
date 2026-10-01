"use client";

import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 10);

    // Always clean up timers in useEffects!
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex-1 flex flex-col w-full min-h-0"
      style={{
        opacity,
        // Opacity-only: transform on this wrapper makes position:fixed
        // descendants (admin sidebar, nav) stick to the page instead of the viewport.
        transition: "opacity 0.4s ease-out",
      }}
    >
      {children}
    </div>
  );
}
