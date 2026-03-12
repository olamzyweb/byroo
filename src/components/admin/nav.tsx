"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/system", label: "System" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-3 py-2 text-sm transition-colors",
              active
                ? "bg-[var(--brand-50)] text-[var(--brand-600)]"
                : "text-[var(--text-soft)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-strong)]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
