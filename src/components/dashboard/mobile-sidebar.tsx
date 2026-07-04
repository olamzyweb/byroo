"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function MobileSidebarWrapper({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col md:grid md:grid-cols-[255px_1fr] md:gap-5 md:px-8 md:py-8">
      {/* Mobile Top Header (Visible only on mobile) */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3 md:hidden">
        <Link href="/" className="inline-flex">
          <BrandLogo />
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md p-2 hover:bg-[var(--surface-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-[var(--text)]" />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Fixed on Desktop, Slide-over on Mobile) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px] transform flex-col overflow-y-auto bg-[var(--surface)] p-4 shadow-2xl transition-transform duration-300 ease-in-out
          md:static md:w-auto md:translate-x-0 md:rounded-2xl md:border md:border-[var(--border-subtle)] md:shadow-[var(--shadow-soft)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile Close Button */}
        <div className="mb-2 flex justify-end md:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 hover:bg-[var(--surface-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-[var(--text-soft)]" />
          </button>
        </div>

        {/* Injected Sidebar Content */}
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 p-4 md:rounded-2xl md:border md:border-[var(--border-subtle)] md:bg-[var(--surface)] md:p-6 md:shadow-[var(--shadow-soft)]">
        {children}
      </section>
    </div>
  );
}
