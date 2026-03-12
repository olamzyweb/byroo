"use client";

import { useState } from "react";

export function Dropdown({
  label,
  items,
}: {
  label: string;
  items: Array<{ id: string; label: string; onClick: () => void }>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-soft)]"
      >
        {label}
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 min-w-40 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-1 shadow-[var(--shadow-soft)]">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--text-soft)] hover:bg-[var(--surface-muted)]"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
