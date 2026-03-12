"use client";

import { useState } from "react";

type ShareProfileButtonProps = {
  title: string;
  text: string;
  className?: string;
};

export function ShareProfileButton({ title, text, className }: ShareProfileButtonProps) {
  const [status, setStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setStatus("shared");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setStatus("copied");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 1800);
  }

  const label = status === "shared" ? "Shared" : status === "copied" ? "Link copied" : status === "error" ? "Share failed" : "Share profile";

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition hover:translate-y-[-1px]"
      }
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M8 12a2 2 0 1 0-2-2 2 2 0 0 0 2 2Zm8-8a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm0 16a2 2 0 1 0 2-2 2 2 0 0 0-2 2Zm-6.3-9.2 3.8-2.2m-3.8 4.8 3.8 2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {label}
    </button>
  );
}
