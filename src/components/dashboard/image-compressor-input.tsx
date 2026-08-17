"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export function ImageCompressorInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compress image client-side using Canvas API
  const compressImage = (file: File, maxW = 1200, maxH = 1200, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Resize while maintaining aspect ratio
          if (width > height) {
            if (width > maxW) {
              height = Math.round((height * maxW) / width);
              width = maxW;
            }
          } else {
            if (height > maxH) {
              width = Math.round((width * maxH) / height);
              height = maxH;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              // Save as optimized JPEG
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Don't compress already small images (less than 150KB)
    if (file.size < 150 * 1024) {
      if (props.onChange) props.onChange(e);
      return;
    }

    setIsCompressing(true);
    setStatus("Optimizing image...");

    try {
      const compressed = await compressImage(file);
      
      // Replace input files list using DataTransfer
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(compressed);
      if (inputRef.current) {
        inputRef.current.files = dataTransfer.files;
      }

      const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const compressedSizeKB = (compressed.size / 1024).toFixed(0);
      setStatus(`Optimized: ${originalSizeMB}MB → ${compressedSizeKB}KB`);
      
      // Fire standard onChange if parent components need it
      if (props.onChange) {
        const event = {
          ...e,
          target: { ...e.target, files: dataTransfer.files }
        };
        props.onChange(event as any);
      }
    } catch (err) {
      console.error("Compression failed", err);
      setStatus("Could not optimize, uploading original");
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-1 w-full">
      <input
        {...props}
        ref={inputRef}
        type="file"
        onChange={handleChange}
        className={cn(
          "h-10 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text-strong)] outline-none ring-[var(--brand-400)] transition focus:ring-2 file:mr-4 file:py-0 file:px-0 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-transparent file:text-[var(--brand-600)] hover:file:underline cursor-pointer",
          className
        )}
      />
      {status && (
        <p className={cn(
          "text-[10px] font-semibold pl-1",
          isCompressing ? "text-[var(--brand-600)] animate-pulse" : "text-emerald-600"
        )}>
          {status}
        </p>
      )}
    </div>
  );
}
