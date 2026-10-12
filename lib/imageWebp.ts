/**
 * Converts an image File from device media (JPG, PNG, BMP, HEIC, etc.)
 * into an optimized WebP format File using HTML5 Canvas.
 */
export interface WebPOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 - 1.0 (default 0.85)
}

export async function convertImageToWebP(
  file: File,
  options: WebPOptions = {}
): Promise<File> {
  const { maxWidth = 2000, maxHeight = 2000, quality = 0.85 } = options;

  // If already webp and reasonably sized, return as is
  if (file.type === "image/webp" && file.size < 1.5 * 1024 * 1024 && !maxWidth && !maxHeight) {
    return file;
  }

  // Check if it's an image
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|bmp|tiff|avif|heic)$/i.test(file.name)) {
    throw new Error("Please select a valid image file from your device.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Scale down if larger than maximum bounds while keeping aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            // Fallback to original file if canvas 2D context fails
            return resolve(file);
          }

          // Optional smoothing for higher quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(img, 0, 0, width, height);

          // Test if canvas supports webp export
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                // If webp blob generation is unsupported, resolve with original file
                return resolve(file);
              }

              const baseName = (file.name || "image")
                .replace(/\.[^/.]+$/, "")
                .replace(/[^\w-]/g, "_")
                .slice(0, 50);

              const webpFileName = `${baseName || "photo"}.webp`;

              const webpFile = new File([blob], webpFileName, {
                type: "image/webp",
                lastModified: Date.now(),
              });

              resolve(webpFile);
            },
            "image/webp",
            quality
          );
        } catch (err) {
          console.warn("[WEBP_CONVERSION_ERROR] Fallback to original file:", err);
          resolve(file);
        }
      };

      img.onerror = () => {
        reject(new Error("Unable to read this image from device media."));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image file from device."));
    };

    reader.readAsDataURL(file);
  });
}
