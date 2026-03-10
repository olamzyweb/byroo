import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", className)}>{children}</div>;
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit" | "reset";
}) {
  const base = "inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-sky-600 text-white hover:bg-sky-500"
      : variant === "danger"
        ? "bg-rose-600 text-white hover:bg-rose-500"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200";

  return (
    <button type={type} className={cn(base, styles, className)}>
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-400 placeholder:text-slate-400 focus:ring-2",
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
        "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-400 placeholder:text-slate-400 focus:ring-2",
        props.className,
      )}
    />
  );
}
