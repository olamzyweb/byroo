import { env } from "@/lib/config";
import type { BillingProvider } from "@/lib/billing/types";
import { StripeBillingProvider } from "@/lib/billing/stripe";

let provider: BillingProvider | null = null;

export function getBillingProvider(): BillingProvider {
  if (provider) {
    return provider;
  }

  if (env.billingProvider === "stripe") {
    provider = new StripeBillingProvider();
    return provider;
  }

  throw new Error(`Unsupported billing provider: ${env.billingProvider}`);
}
