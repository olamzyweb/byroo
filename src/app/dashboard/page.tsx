import Link from "next/link";
import { Card, SectionTitle } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ count: linkCount }, { count: portfolioCount }, { data: profile }] = await Promise.all([
    supabase.from("links").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("portfolio_items").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("profiles").select("display_name, username, plan, onboarded").eq("id", user.id).single(),
  ]);

  return (
    <div className="space-y-6">
      <SectionTitle title="Dashboard" subtitle="Manage your Byroo page and track growth." />

      {!profile?.onboarded ? (
        <Card className="border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-700">Complete profile setup to publish your page.</p>
          <Link href="/dashboard/profile" className="mt-3 inline-block text-sm font-semibold text-amber-800">
            Finish onboarding
          </Link>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Plan</p>
          <p className="mt-2 text-2xl font-semibold capitalize text-slate-900">{profile?.plan ?? "free"}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Links</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{linkCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Portfolio items</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{portfolioCount ?? 0}</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-slate-900">Quick actions</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/dashboard/profile" className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">
            Edit profile
          </Link>
          <Link href="/dashboard/links" className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700">
            Add link
          </Link>
          <Link href="/dashboard/billing" className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700">
            Upgrade plan
          </Link>
        </div>
      </Card>
    </div>
  );
}
