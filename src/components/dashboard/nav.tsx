"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/whatsapp", label: "WhatsApp" },
  { href: "/dashboard/socials", label: "Social Proof" },
  { href: "/dashboard/links", label: "Links" },
  { href: "/dashboard/catalog", label: "Catalog" },
  { href: "/dashboard/portfolio", label: "Portfolio" },
  { href: "/dashboard/services", label: "Services" },
  { href: "/dashboard/reviews", label: "Reviews" },
  { href: "/dashboard/business", label: "Business Info" },
  { href: "/dashboard/appearance", label: "Appearance" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/billing", label: "Billing" },
];

export function DashboardNav() {
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
