import { Card, SectionTitle } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
    supabase
      .from("subscriptions")
      .select("status, provider_customer_id, current_period_end")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <div className="space-y-6">
      <SectionTitle title="Billing" subtitle="Manage your subscription and upgrades." />
      {params.error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{params.error}</p> : null}
      {params.message ? <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">{params.message}</p> : null}

      <Card className="space-y-3">
        <p className="text-sm text-slate-500">Current plan</p>
        <p className="text-2xl font-semibold capitalize text-slate-900">{profile?.plan ?? "free"}</p>

        {profile?.plan === "pro" ? (
          <form action="/api/billing/portal" method="post">
            <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">
              Open billing portal
            </button>
          </form>
        ) : (
          <form action="/api/billing/checkout" method="post">
            <button type="submit" className="rounded-xl bg-sky-600 px-4 py-2 text-sm text-white">
              Upgrade to Pro
            </button>
          </form>
        )}

        {subscription?.status ? (
          <p className="text-sm text-slate-600">
            Subscription status: <span className="font-semibold">{subscription.status}</span>
          </p>
        ) : null}
      </Card>
    </div>
  );
}
