import Stripe from "stripe";
import { env } from "@/lib/config";
import type { BillingProvider, CheckoutSessionInput } from "@/lib/billing/types";
import { createAdminClient } from "@/lib/supabase/admin";

function getStripe() {
  if (!env.stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(env.stripeSecretKey, { apiVersion: "2026-02-25.clover" });
}

async function upsertSubscription(params: {
  userId: string;
  customerId: string;
  subscriptionId?: string;
  status: string;
  priceId?: string | null;
  currentPeriodEnd?: number;
}) {
  const admin = createAdminClient();
  const plan = params.status === "active" || params.status === "trialing" ? "pro" : "free";

  await admin.from("profiles").update({ plan }).eq("id", params.userId);

  await admin.from("subscriptions").upsert(
    {
      user_id: params.userId,
      provider: "stripe",
      provider_customer_id: params.customerId,
      provider_subscription_id: params.subscriptionId ?? null,
      status: params.status,
      plan_key: "pro_monthly",
      price_id: params.priceId ?? null,
      current_period_end: params.currentPeriodEnd
        ? new Date(params.currentPeriodEnd * 1000).toISOString()
        : null,
    },
    { onConflict: "provider,provider_subscription_id" },
  );
}

export class StripeBillingProvider implements BillingProvider {
  async createCheckoutSession(input: CheckoutSessionInput): Promise<string> {
    if (!env.stripeProMonthlyPriceId) {
      throw new Error("Missing STRIPE_PRO_MONTHLY_PRICE_ID");
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      line_items: [{ price: env.stripeProMonthlyPriceId, quantity: 1 }],
      customer_email: input.email,
      metadata: { userId: input.userId },
    });

    if (!session.url) {
      throw new Error("Stripe did not return checkout URL");
    }
    return session.url;
  }

  async createPortalSession(customerId: string, returnUrl: string): Promise<string> {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session.url;
  }

  async handleWebhook(rawBody: string, headers: Headers): Promise<void> {
    if (!env.stripeWebhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }
    const stripe = getStripe();
    const signature = headers.get("stripe-signature");
    const event = stripe.webhooks.constructEvent(rawBody, signature ?? "", env.stripeWebhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId || !session.customer) {
        return;
      }
      await upsertSubscription({
        userId,
        customerId: String(session.customer),
        subscriptionId: String(session.subscription ?? ""),
        status: "active",
      });
      return;
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = String(subscription.customer);
      const admin = createAdminClient();
      const { data } = await admin
        .from("subscriptions")
        .select("user_id")
        .eq("provider", "stripe")
        .eq("provider_customer_id", customerId)
        .limit(1)
        .single();

      if (!data?.user_id) {
        return;
      }

      await upsertSubscription({
        userId: data.user_id as string,
        customerId,
        subscriptionId: subscription.id,
        status: subscription.status,
        priceId: subscription.items.data[0]?.price?.id ?? null,
        currentPeriodEnd: subscription.items.data[0]?.current_period_end,
      });
    }
  }
}
