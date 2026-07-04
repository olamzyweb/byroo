import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, HelperText, SectionHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getBillingProvider } from "@/lib/billing";
import { env } from "@/lib/config";
import { PLAN_CONFIG } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();
  const isPaystack = env.billingProvider === "paystack";

  const incomingReference = params.reference || params.trxref;
  if (isPaystack && incomingReference) {
    try {
      const provider = getBillingProvider();
      if (provider.verifyCheckoutReference) {
        await provider.verifyCheckoutReference(incomingReference);
      }
    } catch {
      // Do not hard-fail billing page rendering on verification errors.
    }
  }

  const provider = getBillingProvider();

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
    supabase
      .from("subscriptions")
      .select("status, provider_customer_id, provider_subscription_id, current_period_end")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  let transactions: any[] = [];
  if (subscription?.provider_customer_id && provider.getTransactionHistory) {
    transactions = await provider.getTransactionHistory(subscription.provider_customer_id);
  }

  const free = PLAN_CONFIG.free;
  const pro = PLAN_CONFIG.pro;
  const prettyLimit = (value: number) => (Number.isFinite(value) ? String(value) : "Unlimited");

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Billing" subtitle="Manage upgrades and subscription status." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[var(--text-soft)]">Current plan:</p>
          <Badge tone={profile?.plan === "pro" ? "brand" : "neutral"}>{profile?.plan ?? "free"}</Badge>
        </div>

        {profile?.plan !== "pro" ? (
          <form action="/api/billing/checkout" method="post">
            <SubmitButton>Upgrade to Pro</SubmitButton>
          </form>
        ) : (
          <form action="/api/billing/portal" method="post">
            <SubmitButton>Open billing portal</SubmitButton>
          </form>
        )}

        {subscription?.status ? (
          <div className="flex flex-col gap-1 text-sm text-[var(--text-soft)]">
            <p>Subscription: <span className="capitalize text-[var(--text-strong)]">{subscription.status}</span></p>
            {subscription.current_period_end && (
              <p>Renews/Expires: <span className="text-[var(--text-strong)]">{formatDate(subscription.current_period_end)}</span></p>
            )}
          </div>
        ) : null}
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-strong)]">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-[var(--text-soft)] italic">No recent transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-soft)]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {transactions.map((t) => (
                  <tr key={t.id} className="group">
                    <td className="py-3 pr-4 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="py-3 pr-4">₦{t.amount.toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <Badge tone={t.status === "success" ? "success" : "neutral"}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3 whitespace-nowrap font-mono text-xs">{t.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-strong)]">Free</h3>
            <Badge tone="neutral">₦0</Badge>
          </div>
          <ul className="space-y-2 text-sm text-[var(--text-soft)]">
            <li>{prettyLimit(free.maxLinks)} links</li>
            <li>{prettyLimit(free.maxPortfolioItems)} portfolio items</li>
            <li>{prettyLimit(free.maxCatalogItems)} catalog items</li>
            <li>{prettyLimit(free.maxServices)} services</li>
            <li>{prettyLimit(free.maxTestimonials)} reviews</li>
            <li>{prettyLimit(free.maxSocialProofCards)} social proof card</li>
            <li>{free.analyticsEnabled ? "Analytics included" : "No analytics"}</li>
            <li>{free.canHideBranding ? "Can hide branding" : "Byroo branding visible"}</li>
          </ul>
        </Card>

        <Card accent className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-strong)]">Pro</h3>
            <Badge tone="brand">₦{pro.priceMonthly}/month</Badge>
          </div>
          <ul className="space-y-2 text-sm text-[var(--text-soft)]">
            <li>{prettyLimit(pro.maxLinks)} links</li>
            <li>{prettyLimit(pro.maxPortfolioItems)} portfolio items</li>
            <li>{prettyLimit(pro.maxCatalogItems)} catalog items</li>
            <li>{prettyLimit(pro.maxServices)} services</li>
            <li>{prettyLimit(pro.maxTestimonials)} reviews</li>
            <li>{prettyLimit(pro.maxSocialProofCards)} social proof cards</li>
            <li>{pro.analyticsEnabled ? "Analytics included" : "No analytics"}</li>
            <li>{pro.canHideBranding ? "Can hide branding" : "Byroo branding visible"}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}



