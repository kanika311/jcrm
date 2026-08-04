"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }
    setIsUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Upload failed.");
        return;
      }
      const { url } = await res.json();
      onChange(url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-soft)' }}>
          <img
            src={value}
            alt={label || "Uploaded image"}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-black hover:bg-gray-100 transition-colors"
            >
              Replace Image
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500/80 text-white hover:bg-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className="w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200"
          style={{
            borderColor: isDragging ? 'var(--accent-primary)' : 'var(--border-soft)',
            background: isDragging
              ? 'color-mix(in srgb, var(--accent-primary) 8%, transparent)'
              : 'var(--bg-base)',
          }}
        >
          {isUploading ? (
            <>
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Uploading...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Drag &amp; drop or{" "}
                  <span style={{ color: 'var(--accent-primary)' }}>click to browse</span>
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>PNG, JPG, WEBP — max 2MB</p>
              </div>
            </>
          )}
        </div>
      )}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
