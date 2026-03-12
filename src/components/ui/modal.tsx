"use client";

import { useState, type ReactNode } from "react";

export function Modal({
  triggerText,
  title,
  children,
}: {
  triggerText: string;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-soft)]"
      >
        {triggerText}
      </button>
      {open ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[var(--text-strong)]">{title}</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-[var(--text-soft)]">
                Close
              </button>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
