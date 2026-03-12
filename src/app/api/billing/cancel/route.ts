import { NextResponse } from "next/server";
import { getBillingProvider } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/config";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", env.appUrl));
  }

  const providerKey = env.billingProvider;
  let { data: subscription } = await supabase
    .from("subscriptions")
    .select("provider_subscription_id, provider_subscription_token, provider_customer_id, status")
    .eq("user_id", user.id)
    .eq("provider", providerKey)
    .eq("status", "active")
    .not("provider_subscription_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!subscription?.provider_subscription_id) {
    const fallback = await supabase
      .from("subscriptions")
      .select("provider_subscription_id, provider_subscription_token, provider_customer_id, status")
      .eq("user_id", user.id)
      .eq("provider", providerKey)
      .not("provider_subscription_id", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    subscription = fallback.data;
  }

  if (!subscription?.provider_subscription_id && providerKey === "paystack") {
    // Attempt to hydrate subscription data from latest checkout reference when webhook is delayed/missing.
    const { data: pendingByRef } = await supabase
      .from("subscriptions")
      .select("provider_reference")
      .eq("user_id", user.id)
      .eq("provider", "paystack")
      .not("provider_reference", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pendingByRef?.provider_reference) {
      try {
        const provider = getBillingProvider();
        if (provider.verifyCheckoutReference) {
          await provider.verifyCheckoutReference(pendingByRef.provider_reference);
        }
      } catch {
        // Ignore sync errors here; final query below determines if cancellation can proceed.
      }
    }

    const afterVerify = await supabase
      .from("subscriptions")
      .select("provider_subscription_id, provider_subscription_token, provider_customer_id, status")
      .eq("user_id", user.id)
      .eq("provider", "paystack")
      .not("provider_subscription_id", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    subscription = afterVerify.data;
  }

  if (!subscription?.provider_subscription_id && providerKey === "paystack") {
    try {
      const provider = getBillingProvider();
      if (provider.syncSubscriptionForUser) {
        await provider.syncSubscriptionForUser({
          userId: user.id,
          email: user.email ?? "",
          customerCode: subscription?.provider_customer_id ?? null,
        });
      }
    } catch {
      // Ignore sync errors here; final query below determines if cancellation can proceed.
    }

    const afterCustomerSync = await supabase
      .from("subscriptions")
      .select("provider_subscription_id, provider_subscription_token, provider_customer_id, status")
      .eq("user_id", user.id)
      .eq("provider", "paystack")
      .not("provider_subscription_id", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    subscription = afterCustomerSync.data;
  }

  if (!subscription?.provider_subscription_id) {
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=No+synced+subscription+found.+Complete+checkout+or+check+webhook+setup", env.appUrl),
    );
  }

  try {
    const provider = getBillingProvider();
    if (!provider.cancelSubscription) {
      return NextResponse.redirect(new URL("/dashboard/billing?error=Cancellation+not+supported+for+provider", env.appUrl));
    }

    await provider.cancelSubscription({
      subscriptionId: subscription.provider_subscription_id,
      subscriptionToken: subscription.provider_subscription_token,
    });

    return NextResponse.redirect(new URL("/dashboard/billing?message=Subscription+cancellation+requested", env.appUrl));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to cancel subscription";
    return NextResponse.redirect(new URL(`/dashboard/billing?error=${encodeURIComponent(message)}`, env.appUrl));
  }
}
