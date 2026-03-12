export interface CheckoutSessionInput {
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CancelSubscriptionInput {
  subscriptionId: string;
  subscriptionToken?: string | null;
}

export interface BillingProvider {
  createCheckoutSession(input: CheckoutSessionInput): Promise<string>;
  createPortalSession(customerId: string, returnUrl: string): Promise<string>;
  cancelSubscription?(input: CancelSubscriptionInput): Promise<void>;
  verifyCheckoutReference?(reference: string): Promise<void>;
  syncSubscriptionForUser?(input: { userId: string; email?: string; customerCode?: string | null }): Promise<void>;
  handleWebhook(rawBody: string, headers: Headers): Promise<void>;
}
