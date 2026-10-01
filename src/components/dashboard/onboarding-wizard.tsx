"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronUp, ChevronDown, CheckCircle2, Circle, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { OnboardingItem } from "@/lib/onboarding";

interface OnboardingWizardBannerProps {
  completionItems: OnboardingItem[];
  completionPercent: number;
  completedCount: number;
  totalCount: number;
  nextItem: OnboardingItem | null;
}

export function OnboardingWizardBanner({
  completionItems,
  completionPercent,
  completedCount,
  totalCount,
  nextItem,
}: OnboardingWizardBannerProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Don't show the sticky wizard banner on the main dashboard view,
  // as it already lists all tasks in the center.
  // Also don't show it if the profile is 100% complete.
  if (pathname === "/dashboard" || completionPercent >= 100) {
    return null;
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2.5 text-xs font-semibold text-white shadow-xl hover:bg-[var(--brand-dark)] transition-all md:hidden animate-bounce"
        aria-label="Show setup checklist"
      >
        <Sparkles className="h-4 w-4" />
        <span>Setup: {completionPercent}%</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-45 border-t border-[var(--border-subtle)] bg-[var(--surface)]/95 backdrop-blur-md px-4 py-3 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] md:hidden transition-all duration-300">
      {/* Banner Header / Compact View */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[var(--text-strong)]">Profile setup progress</span>
            <span className="text-[var(--brand)]">{completionPercent}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--surface-muted)] overflow-hidden">
            <div
              className="h-full bg-[var(--brand)] transition-all duration-500 ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          {nextItem && !isExpanded && (
            <p className="mt-1 text-[11px] text-[var(--text-soft)] truncate">
              Next: <span className="font-medium text-[var(--text-strong)]">{nextItem.label}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {nextItem && !isExpanded && (
            <Link
              href={nextItem.href}
              className="inline-flex h-8 items-center rounded-lg bg-[var(--brand-50)] px-3 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--brand-100)] active:scale-95 transition"
            >
              Complete
            </Link>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-soft)] hover:bg-[var(--surface-muted)] active:scale-95 transition"
            aria-label={isExpanded ? "Collapse tasks" : "Expand tasks"}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-soft)] hover:bg-[var(--surface-muted)] active:scale-95 transition"
            aria-label="Hide checklist overlay"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Checklist */}
      {isExpanded && (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4 animate-in slide-in-from-bottom duration-200">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-soft)]">
            Setup Checklist ({completedCount}/{totalCount})
          </p>
          <div className="grid gap-2 max-h-[220px] overflow-y-auto pr-1">
            {completionItems.map((item, index) => {
              const isActive = nextItem?.label === item.label;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-3 py-2.5 transition ${
                    item.done
                      ? "bg-[var(--surface-muted)]/50 opacity-60"
                      : isActive
                      ? "bg-[var(--brand-50)]/30 border-[var(--brand-200)]"
                      : "hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className={`h-4 w-4 shrink-0 ${isActive ? "text-[var(--brand)] font-bold" : "text-[var(--text-soft)]"}`} />
                    )}
                    <span className={`text-xs ${isActive ? "font-semibold text-[var(--brand)]" : "text-[var(--text-strong)]"}`}>
                      {item.label}
                    </span>
                  </div>
                  {!item.done && (
                    <span className="text-[10px] font-semibold text-[var(--brand)]">
                      {isActive ? "Start ➔" : "Go ➔"}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
