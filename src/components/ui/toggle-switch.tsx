"use client";

import { cn } from "@/lib/utils";

export function ToggleSwitch({
  name,
  defaultChecked,
  label,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-3 text-sm text-[var(--text-soft)]">
      <span>{label}</span>
      <span className="relative inline-flex h-6 w-11 items-center">
        <input name={name} type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <span
          className={cn(
            "absolute inset-0 rounded-full bg-[var(--surface-muted)] transition",
            "peer-checked:bg-[var(--brand-600)]",
          )}
        />
        <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
