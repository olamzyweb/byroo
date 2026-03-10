import { NextResponse, type NextRequest } from "next/server";
import { getBillingProvider } from "@/lib/billing";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  try {
    const provider = getBillingProvider();
    await provider.handleWebhook(body, signature);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
