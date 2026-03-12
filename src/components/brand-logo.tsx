import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  alt = "Byroo",
}: {
  className?: string;
  alt?: string;
}) {
  return <img src="/byroo-logo.png" alt={alt} className={cn("h-9 w-auto object-contain", className)} />;
}
