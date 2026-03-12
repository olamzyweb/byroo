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

  const free = PLAN_CONFIG.free;
  const pro = PLAN_CONFIG.pro;
  const prettyLimit = (value: number) => (Number.isFinite(value) ? String(value) : "Unlimited");

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
        ) : isPaystack ? (
          <form action="/api/billing/cancel" method="post">
            <SubmitButton variant="danger">
              Cancel subscription
            </SubmitButton>
          </form>
        ) : (
          <form action="/api/billing/portal" method="post">
            <SubmitButton>Open billing portal</SubmitButton>
          </form>
        )}

        {subscription?.status ? <p className="text-sm text-[var(--text-soft)]">Subscription: {subscription.status}</p> : null}
        {isPaystack && profile?.plan === "pro" ? (
          <p className="text-xs text-[var(--text-soft)]">
            Paystack does not provide a hosted billing portal. Use cancellation above.
          </p>
        ) : null}
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



