"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function SubmitButton({
  children,
  pendingText = "Processing...",
  className,
  variant = "primary",
  size = "md",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className={className} variant={variant} size={size}>
      {pending ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
