import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
}) {
  const variants = {
    primary: "bg-[var(--brand-600)] text-white hover:bg-[var(--brand-500)] shadow-[var(--shadow-soft)]",
    secondary: "bg-[var(--surface-muted)] text-[var(--text-strong)] hover:bg-[var(--border-subtle)]",
    ghost: "bg-transparent text-[var(--text-soft)] hover:bg-[var(--surface-muted)]",
    danger: "bg-[var(--danger)] text-white hover:opacity-95",
  };

  const sizes = {
    sm: "h-9 rounded-lg px-3 text-xs",
    md: "h-10 rounded-xl px-4 text-sm",
    lg: "h-12 rounded-xl px-5 text-sm",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  size = "md",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  const variants = {
    primary: "bg-[var(--brand-600)] text-white hover:bg-[var(--brand-500)]",
    secondary: "bg-[var(--surface-muted)] text-[var(--text-strong)] hover:bg-[var(--border-subtle)]",
    ghost: "bg-transparent text-[var(--text-soft)] hover:bg-[var(--surface-muted)]",
  };
  const sizes = {
    sm: "h-9 rounded-lg px-3 text-xs",
    md: "h-10 rounded-xl px-4 text-sm",
    lg: "h-12 rounded-xl px-5 text-sm",
  };
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm text-[var(--text-strong)] outline-none ring-[var(--brand-400)] transition focus:ring-2",
        props.className,
      )}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none ring-[var(--brand-400)] transition focus:ring-2",
        props.className,
      )}
    />
  );
}

export function Card({
  children,
  className,
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]",
        accent && "border-[var(--brand-200)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--text-strong)] md:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-[var(--text-soft)]">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "brand";
}) {
  const toneStyles = {
    neutral: "bg-[var(--surface-muted)] text-[var(--text-soft)]",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    brand: "bg-[var(--brand-50)] text-[var(--brand-700)]",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", toneStyles[tone])}>{children}</span>;
}

export function Divider() {
  return <div className="h-px w-full bg-[var(--border-subtle)]" />;
}

export function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeStyles = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-20 w-20 text-xl",
  };

  if (src) {
    return <img src={src} alt={name} className={cn("rounded-full object-cover", sizeStyles[size])} />;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-[var(--surface-muted)] font-semibold uppercase text-[var(--text-soft)]",
        sizeStyles[size],
      )}
    >
      {name.slice(0, 1)}
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card className="space-y-2">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">{label}</p>
      <p className="text-2xl font-semibold tracking-tight text-[var(--text-strong)]">{value}</p>
      {hint ? <p className="text-xs text-[var(--text-soft)]">{hint}</p> : null}
    </Card>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed bg-[var(--surface-muted)] text-center">
      <p className="text-sm font-semibold text-[var(--text-strong)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--text-soft)]">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}

export function HelperText({ tone = "neutral", children }: { tone?: "neutral" | "error" | "success"; children: ReactNode }) {
  const tones = {
    neutral: "bg-[var(--surface-muted)] text-[var(--text-soft)]",
    error: "bg-rose-50 text-rose-700",
    success: "bg-emerald-50 text-emerald-700",
  };
  return <p className={cn("rounded-xl px-3 py-2 text-sm", tones[tone])}>{children}</p>;
}
