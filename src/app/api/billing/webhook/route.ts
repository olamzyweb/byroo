import { NextResponse, type NextRequest } from "next/server";
import { getBillingProvider } from "@/lib/billing";
import { env } from "@/lib/config";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (env.billingWebhookDebug) {
    let event: string | null = null;
    let reference: string | null = null;
    let customerCode: string | null = null;
    let subscriptionCode: string | null = null;
    let hasSubscriptionToken = false;

    try {
      const parsed = JSON.parse(body) as {
        event?: string;
        data?: {
          reference?: string;
          subscription_code?: string;
          email_token?: string;
          customer?: { customer_code?: string };
        };
      };
      event = parsed.event ?? null;
      reference = parsed.data?.reference ?? null;
      customerCode = parsed.data?.customer?.customer_code ?? null;
      subscriptionCode = parsed.data?.subscription_code ?? null;
      hasSubscriptionToken = Boolean(parsed.data?.email_token);
    } catch {
      // no-op; keep raw debug details only
    }

    console.info("[billing:webhook] incoming", {
      provider: env.billingProvider,
      hasSignature: Boolean(signature),
      bodyLength: body.length,
      event,
      reference,
      customerCode,
      subscriptionCode,
      hasSubscriptionToken,
    });
  }

  try {
    const provider = getBillingProvider();
    await provider.handleWebhook(body, request.headers);
    if (env.billingWebhookDebug) {
      console.info("[billing:webhook] processed", { provider: env.billingProvider });
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    if (env.billingWebhookDebug) {
      console.error("[billing:webhook] failed", {
        provider: env.billingProvider,
        hasSignature: Boolean(signature),
        error: message,
      });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
