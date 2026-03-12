"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Tabs({ items }: { items: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap gap-2 rounded-xl bg-[var(--surface-muted)] p-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-lg px-3 py-2 text-sm transition",
            pathname === item.href
              ? "bg-[var(--surface)] font-medium text-[var(--text-strong)] shadow-[var(--shadow-soft)]"
              : "text-[var(--text-soft)] hover:text-[var(--text-strong)]",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
