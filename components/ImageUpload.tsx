"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  currentImage?: string;
  onUploadSuccess: (url: string) => void;
}

export default function ImageUpload({ currentImage, onUploadSuccess }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentImage);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("File size must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Only image files are allowed");
      return;
    }

    setErrorMsg("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Upload failed");
      }

      const data = await res.json();
      setPreview(data.url);
      onUploadSuccess(data.url);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
        {preview ? (
          <Image src={preview} alt="Profile" fill className="object-cover" />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

      <div className="flex-1">
        <input 
          type="file" 
          accept="image/*"
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="btn-secondary px-4 py-2 rounded-xl text-sm"
        >
          {isUploading ? "Uploading..." : "Upload New Picture"}
        </button>
        <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
        {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
      </div>
    </div>
  );
}
