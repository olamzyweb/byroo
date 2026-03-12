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

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("provider_customer_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const customerId = subscription?.provider_customer_id ?? "";
  if (!customerId && env.billingProvider === "stripe") {
    return NextResponse.redirect(new URL("/dashboard/billing?error=No+billing+profile+found", env.appUrl));
  }

  const provider = getBillingProvider();

  try {
    const portalUrl = await provider.createPortalSession(customerId, `${env.appUrl}/dashboard/billing`);
    return NextResponse.redirect(portalUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to open portal";
    return NextResponse.redirect(new URL(`/dashboard/billing?error=${encodeURIComponent(message)}`, env.appUrl));
  }
}
