"use client";

import { useState, useEffect } from "react";
import { getOptimizedImageUrl } from "@/lib/imageOptimize";

function initialsFromName(name?: string) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function hueFromName(name?: string) {
  let hash = 0;
  for (const ch of name || "JCRM") hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash % 360;
}

export default function NameAvatar({
  name,
  src,
  alt,
  className = "",
  textClassName = "",
  showName = false,
  size = 320,
}: {
  name?: string;
  src?: string | null;
  alt?: string;
  className?: string;
  textClassName?: string;
  showName?: boolean;
  size?: number;
}) {
  const trimmed = (src || "").trim();
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    if (trimmed) {
      // Generate WebP compressed URL
      const optimized = getOptimizedImageUrl(trimmed, {
        width: size,
        height: size,
        quality: 80,
        fit: "cover",
      });
      setCurrentSrc(optimized);
    } else {
      setCurrentSrc("");
    }
  }, [trimmed, size]);

  const showImage = Boolean(currentSrc) && !failed;
  const initials = initialsFromName(name);
  const hue = hueFromName(name);

  if (showImage) {
    return (
      <img
        src={currentSrc}
        alt={alt || name || "Profile"}
        className={className}
        loading="lazy"
        decoding="async"
        onError={() => {
          // If the optimized URL failed, fallback to original once (only if not a heavy data URL)
          if (currentSrc !== trimmed && trimmed && !trimmed.startsWith("data:")) {
            setCurrentSrc(trimmed);
          } else {
            setFailed(true);
          }
        }}
      />
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center select-none ${className}`}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 72% 42%), hsl(${(hue + 28) % 360} 78% 28%))`,
      }}
      aria-label={name || "Profile"}
    >
      <span className={`font-black tracking-wide text-white ${textClassName || "text-xl"}`}>
        {initials}
      </span>
      {showName && name ? (
        <span className="mt-2 px-2 text-center text-xs sm:text-sm font-bold text-white/90 line-clamp-2">
          {name}
        </span>
      ) : null}
    </div>
  );
}
