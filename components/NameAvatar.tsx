"use client";

import { useState } from "react";

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
}: {
  name?: string;
  src?: string | null;
  alt?: string;
  className?: string;
  textClassName?: string;
  showName?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const trimmed = (src || "").trim();
  const showImage = Boolean(trimmed) && !failed;
  const initials = initialsFromName(name);
  const hue = hueFromName(name);

  if (showImage) {
    return (
      <img
        src={trimmed}
        alt={alt || name || "Profile"}
        className={className}
        onError={() => setFailed(true)}
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
