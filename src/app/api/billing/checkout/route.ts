import { NextResponse } from "next/server";
import { getBillingProvider } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/config";

export async function GET() {
  return NextResponse.redirect(new URL("/dashboard/billing?error=Use+the+upgrade+button+to+start+checkout", env.appUrl));
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", env.appUrl));
  }

  const provider = getBillingProvider();

  try {
    const checkoutUrl = await provider.createCheckoutSession({
      userId: user.id,
      email: user.email ?? "",
      successUrl: `${env.appUrl}/dashboard/billing?message=Upgrade+started`,
      cancelUrl: `${env.appUrl}/dashboard/billing?error=Checkout+cancelled`,
    });

    return NextResponse.redirect(checkoutUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout";
    return NextResponse.redirect(new URL(`/dashboard/billing?error=${encodeURIComponent(message)}`, env.appUrl));
  }
}
