import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { DashboardNav } from "@/components/dashboard/nav";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, Badge, Card, Divider } from "@/components/ui";
import { logoutAction } from "@/app/dashboard/actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, plan, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? "",
      display_name: user.user_metadata?.full_name ?? "New Byroo User",
      plan: "free",
    });
  }

  const publicPath = profile?.username ? `/${profile.username}` : "#";

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-5 md:grid-cols-[255px_1fr] md:px-8 md:py-8">
      <aside className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]">
        <Link href="/" className="inline-flex">
          <BrandLogo />
        </Link>
        <p className="mt-1 text-xs text-[var(--text-soft)]">Creator dashboard</p>

        <div className="mt-4">
          <Card className="flex items-center gap-3 p-3">
            <Avatar name={profile?.display_name ?? "User"} src={profile?.avatar_url} size="sm" />
            <div>
              <p className="text-sm font-medium">{profile?.display_name ?? "User"}</p>
              <Badge tone={profile?.plan === "pro" ? "brand" : "neutral"}>{profile?.plan ?? "free"}</Badge>
            </div>
          </Card>
        </div>

        <div className="mt-4">
          <DashboardNav />
        </div>

        <Divider />
        <div className="mt-4 space-y-2">
          <Link href={publicPath} className="block rounded-xl px-3 py-2 text-sm text-[var(--text-soft)] hover:bg-[var(--surface-muted)]">
            View public page
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
