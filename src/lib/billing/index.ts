import { env } from "@/lib/config";
import type { BillingProvider } from "@/lib/billing/types";
import { StripeBillingProvider } from "@/lib/billing/stripe";
import { PaystackBillingProvider } from "@/lib/billing/paystack";

let provider: BillingProvider | null = null;

export function getBillingProvider(): BillingProvider {
  if (provider) {
    return provider;
  }

  if (env.billingProvider === "stripe") {
    provider = new StripeBillingProvider();
    return provider;
  }

  if (env.billingProvider === "paystack") {
    provider = new PaystackBillingProvider();
    return provider;
  }

  throw new Error(`Unsupported billing provider: ${env.billingProvider}`);
}
