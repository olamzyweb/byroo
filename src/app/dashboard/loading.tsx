export default function Loading() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-44 animate-pulse rounded bg-[var(--surface-muted)]" />
      <div className="h-24 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
      <div className="h-24 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
    </div>
  );
}
