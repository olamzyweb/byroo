import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { AdminNav } from "@/components/admin/nav";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, Badge, Card, Divider } from "@/components/ui";
import { logoutAction } from "@/app/dashboard/actions";
import { requireAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser();
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("display_name, avatar_url, plan")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-5 md:grid-cols-[255px_1fr] md:px-8 md:py-8">
      <aside className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]">
        <Link href="/" className="inline-flex">
          <BrandLogo alt="Byroo Admin" />
        </Link>
        <p className="mt-1 text-xs text-[var(--text-soft)]">Internal control center</p>

        <div className="mt-4">
          <Card className="flex items-center gap-3 p-3">
            <Avatar name={profile?.display_name ?? "Admin"} src={profile?.avatar_url} size="sm" />
            <div>
              <p className="text-sm font-medium">{profile?.display_name ?? "Admin"}</p>
              <div className="flex gap-1">
                <Badge tone="brand">admin</Badge>
                <Badge tone={profile?.plan === "pro" ? "brand" : "neutral"}>{profile?.plan ?? "free"}</Badge>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-4">
          <AdminNav />
        </div>

        <Divider />
        <div className="mt-4 space-y-2">
          <Link href="/dashboard" className="block rounded-xl px-3 py-2 text-sm text-[var(--text-soft)] hover:bg-[var(--surface-muted)]">
            Back to dashboard
          </Link>
          <form action={logoutAction}>
            <SubmitButton variant="ghost" className="w-full justify-start" pendingText="Logging out...">
              Logout
            </SubmitButton>
          </form>
        </div>
      </aside>

      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] md:p-6">
        {children}
      </section>
    </main>
  );
}
