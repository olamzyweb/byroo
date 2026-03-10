export interface CheckoutSessionInput {
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

export interface BillingProvider {
  createCheckoutSession(input: CheckoutSessionInput): Promise<string>;
  createPortalSession(customerId: string, returnUrl: string): Promise<string>;
  handleWebhook(rawBody: string, signature: string | null): Promise<void>;
}
