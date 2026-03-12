import { createHmac, randomUUID } from "node:crypto";
import { env, requireEnvValue } from "@/lib/config";
import type { BillingProvider, CancelSubscriptionInput, CheckoutSessionInput } from "@/lib/billing/types";
import { createAdminClient } from "@/lib/supabase/admin";

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    reference: string;
  };
};

type PaystackPlanResponse = {
  status: boolean;
  message: string;
  data?: {
    plan_code?: string;
    amount?: number;
    interval?: string;
    currency?: string;
    active?: boolean;
  };
};

type PaystackEventPayload = {
  event: string;
  data?: Record<string, unknown>;
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: Record<string, unknown>;
};

type PaystackListSubscriptionsResponse = {
  status: boolean;
  message: string;
  data?: Array<Record<string, unknown>>;
};

type PaystackFetchSubscriptionResponse = {
  status: boolean;
  message: string;
  data?: Record<string, unknown>;
};

function getPaystackSecret() {
  return requireEnvValue(env.paystackSecretKey, "PAYSTACK_SECRET_KEY");
}

function getPaystackWebhookSecret() {
  return env.paystackWebhookSecret || getPaystackSecret();
}

async function paystackRequest<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://api.paystack.co${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${getPaystackSecret()}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = (await res.json()) as T & { message?: string; data?: unknown };
  if (!res.ok) {
    const details =
      json && typeof json === "object" && "message" in json && typeof json.message === "string"
        ? json.message
        : "Unknown Paystack error";
    throw new Error(`Paystack API error (${res.status}): ${details}`);
  }
  return json;
}

async function getPlanDetails(planCode: string): Promise<{
  amount: number;
  currency: string;
  active: boolean;
}> {
  try {
    const res = await paystackRequest<PaystackPlanResponse>(`/plan/${encodeURIComponent(planCode)}`);
    const amount = Number(res.data?.amount ?? 0);
    const currency = String(res.data?.currency ?? "NGN");
    const active = Boolean(res.data?.active ?? true);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Plan amount is missing or invalid");
    }
    return { amount, currency, active };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid PAYSTACK_PRO_PLAN_CODE (${planCode}): ${error.message}`);
    }
    throw error;
  }
}

async function fetchSubscriptionByCode(code: string): Promise<Record<string, unknown> | null> {
  if (!code) {
    return null;
  }
  try {
    const res = await paystackRequest<PaystackFetchSubscriptionResponse>(`/subscription/${encodeURIComponent(code)}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

function verifyPaystackSignature(rawBody: string, headers: Headers): boolean {
  const signature = headers.get("x-paystack-signature");
  if (!signature) {
    return false;
  }
  const hash = createHmac("sha512", getPaystackWebhookSecret()).update(rawBody).digest("hex");
  return hash === signature;
}

function debugPaystackWebhook(message: string, data?: Record<string, unknown>) {
  if (!env.billingWebhookDebug) {
    return;
  }
  console.info("[billing:paystack]", message, data ?? {});
}

function parseDate(value: unknown): string | null {
  if (typeof value !== "string" || !value) {
    return null;
  }
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
}

async function upsertPaystackSubscription(params: {
  userId: string;
  customerCode?: string | null;
  subscriptionCode?: string | null;
  subscriptionToken?: string | null;
  reference?: string | null;
  status: string;
  planCode?: string | null;
  nextPaymentDate?: string | null;
}) {
  const admin = createAdminClient();
  const isActive = params.status === "active" || params.status === "success";
  await admin.from("profiles").update({ plan: isActive ? "pro" : "free" }).eq("id", params.userId);

  await admin.from("subscriptions").upsert(
    {
      user_id: params.userId,
      provider: "paystack",
      provider_customer_id: params.customerCode ?? null,
      provider_subscription_id: params.subscriptionCode ?? null,
      provider_subscription_token: params.subscriptionToken ?? null,
      provider_reference: params.reference ?? null,
      status: isActive ? "active" : params.status || "inactive",
      plan_key: "pro_monthly",
      price_id: params.planCode ?? null,
      current_period_end: params.nextPaymentDate ?? null,
    },
    { onConflict: "provider,provider_subscription_id" },
  );
}

export class PaystackBillingProvider implements BillingProvider {
  async createCheckoutSession(input: CheckoutSessionInput): Promise<string> {
    const planCode = requireEnvValue(env.paystackProPlanCode, "PAYSTACK_PRO_PLAN_CODE").trim();
    if (!input.email?.trim()) {
      throw new Error("Missing customer email for Paystack checkout");
    }
    const plan = await getPlanDetails(planCode);
    if (!plan.active) {
      throw new Error(`Paystack plan ${planCode} is not active`);
    }
    const callbackUrl = env.paystackCallbackUrl || input.successUrl;
    const reference = `byroo_${input.userId}_${randomUUID()}`;
    const admin = createAdminClient();

    await admin.from("subscriptions").upsert(
      {
        user_id: input.userId,
        provider: "paystack",
        provider_reference: reference,
        status: "pending",
        plan_key: "pro_monthly",
      },
      { onConflict: "provider,provider_subscription_id" },
    );

    const payload = await paystackRequest<PaystackInitializeResponse>("/transaction/initialize", {
      email: input.email,
      plan: planCode,
      amount: plan.amount,
      callback_url: callbackUrl,
      reference,
      metadata: { userId: input.userId },
    });

    const url = payload.data?.authorization_url;
    if (!payload.status || !url) {
      throw new Error(payload.message || "Failed to initialize Paystack checkout");
    }
    return url;
  }

  async createPortalSession(_customerId: string, returnUrl: string): Promise<string> {
    return `${returnUrl}?message=Manage+subscription+with+cancel+button+below`;
  }

  async cancelSubscription(input: CancelSubscriptionInput): Promise<void> {
    if (!input.subscriptionToken) {
      throw new Error("Missing provider subscription token");
    }
    await paystackRequest("/subscription/disable", {
      code: input.subscriptionId,
      token: input.subscriptionToken,
    });
  }

  async syncSubscriptionForUser(input: { userId: string; email?: string; customerCode?: string | null }): Promise<void> {
    const admin = createAdminClient();
    let customerCode = input.customerCode ?? null;

    if (!customerCode) {
      const { data: subscription } = await admin
        .from("subscriptions")
        .select("provider_customer_id")
        .eq("user_id", input.userId)
        .eq("provider", "paystack")
        .not("provider_customer_id", "is", null)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      customerCode = subscription?.provider_customer_id ?? null;
    }

    if (!customerCode) {
      return;
    }

    const query = `/subscription?customer=${encodeURIComponent(customerCode)}`;
    const payload = await paystackRequest<PaystackListSubscriptionsResponse>(query);
    const rows = payload.data ?? [];

    const preferred = rows.find((row) => {
      const status = String(row.status ?? "").toLowerCase();
      return status === "active" || status === "non-renewing" || status === "attention";
    });
    const latestWithToken = rows.find((row) => {
      const codeOk = typeof row.subscription_code === "string" && row.subscription_code.length > 0;
      const tokenOk = typeof row.email_token === "string" && row.email_token.length > 0;
      return codeOk && tokenOk;
    });
    const chosen = preferred ?? latestWithToken ?? null;
    if (!chosen) {
      return;
    }

    const subscriptionCode =
      typeof chosen.subscription_code === "string" ? String(chosen.subscription_code) : null;
    let subscriptionToken = typeof chosen.email_token === "string" ? String(chosen.email_token) : null;
    const plan = (chosen.plan ?? {}) as Record<string, unknown>;
    const planCode = typeof plan.plan_code === "string" ? plan.plan_code : env.paystackProPlanCode || null;
    const nextPaymentDate = parseDate(chosen.next_payment_date);
    const chosenStatus = String(chosen.status ?? "active").toLowerCase();
    const mappedStatus = chosenStatus === "active" ? "active" : "inactive";

    if (subscriptionCode && !subscriptionToken) {
      const full = await fetchSubscriptionByCode(subscriptionCode);
      if (full && typeof full.email_token === "string") {
        subscriptionToken = full.email_token;
      }
    }

    if (!subscriptionCode || !subscriptionToken) {
      return;
    }

    await upsertPaystackSubscription({
      userId: input.userId,
      customerCode,
      subscriptionCode,
      subscriptionToken,
      status: mappedStatus,
      planCode,
      nextPaymentDate,
    });
  }

  async verifyCheckoutReference(reference: string): Promise<void> {
    const payload = await paystackRequest<PaystackVerifyResponse>(`/transaction/verify/${encodeURIComponent(reference)}`);
    const data = payload.data ?? {};
    const status = String(data.status ?? "failed");
    const metadata = (data.metadata ?? {}) as Record<string, unknown>;
    const customer = (data.customer ?? {}) as Record<string, unknown>;
    const plan = (data.plan ?? {}) as Record<string, unknown>;
    const subscription = (data.subscription ?? {}) as Record<string, unknown>;

    const admin = createAdminClient();
    let userId = typeof metadata.userId === "string" ? metadata.userId : null;

    if (!userId) {
      const { data: subByRef } = await admin
        .from("subscriptions")
        .select("user_id")
        .eq("provider", "paystack")
        .eq("provider_reference", reference)
        .maybeSingle();
      if (subByRef?.user_id) {
        userId = String(subByRef.user_id);
      }
    }

    if (!userId) {
      return;
    }

    const customerCode = typeof customer.customer_code === "string" ? customer.customer_code : null;
    const nextPaymentDate = parseDate(data.next_payment_date);
    const isSuccess = status === "success";
    const subscriptionCode =
      typeof data.subscription_code === "string"
        ? data.subscription_code
        : typeof subscription.subscription_code === "string"
          ? subscription.subscription_code
          : null;
    let subscriptionToken =
      typeof data.email_token === "string"
        ? data.email_token
        : typeof subscription.email_token === "string"
          ? subscription.email_token
          : null;
    if (subscriptionCode && !subscriptionToken) {
      const full = await fetchSubscriptionByCode(subscriptionCode);
      if (full && typeof full.email_token === "string") {
        subscriptionToken = full.email_token;
      }
    }
    const planCode = typeof plan.plan_code === "string" ? plan.plan_code : env.paystackProPlanCode || null;

    await admin.from("profiles").update({ plan: isSuccess ? "pro" : "free" }).eq("id", userId);

    await admin
      .from("subscriptions")
      .update({
        provider_customer_id: customerCode,
        provider_subscription_id: subscriptionCode,
        provider_subscription_token: subscriptionToken,
        status: isSuccess ? "active" : "inactive",
        price_id: planCode,
        current_period_end: nextPaymentDate,
      })
      .eq("provider", "paystack")
      .eq("provider_reference", reference);
  }

  async handleWebhook(rawBody: string, headers: Headers): Promise<void> {
    const hasSignature = Boolean(headers.get("x-paystack-signature"));
    const signatureValid = verifyPaystackSignature(rawBody, headers);
    debugPaystackWebhook("webhook.signature", { hasSignature, signatureValid });
    if (!signatureValid) {
      throw new Error("Invalid Paystack webhook signature");
    }

    const payload = JSON.parse(rawBody) as PaystackEventPayload;
    const event = payload.event;
    const data = payload.data ?? {};
    const admin = createAdminClient();

    const metadata = (data.metadata ?? {}) as Record<string, unknown>;
    const customer = (data.customer ?? {}) as Record<string, unknown>;
    const plan = (data.plan ?? {}) as Record<string, unknown>;

    let userId = typeof metadata.userId === "string" ? metadata.userId : null;
    const reference = typeof data.reference === "string" ? data.reference : null;
    const customerCode = typeof customer.customer_code === "string" ? customer.customer_code : null;
    const subscriptionCode = typeof data.subscription_code === "string" ? data.subscription_code : null;
    let subscriptionToken = typeof data.email_token === "string" ? data.email_token : null;
    if (subscriptionCode && !subscriptionToken) {
      const full = await fetchSubscriptionByCode(subscriptionCode);
      if (full && typeof full.email_token === "string") {
        subscriptionToken = full.email_token;
      }
    }
    const planCode = typeof plan.plan_code === "string" ? plan.plan_code : env.paystackProPlanCode || null;
    const nextPayment = parseDate(data.next_payment_date);
    debugPaystackWebhook("webhook.payload", {
      event,
      reference,
      customerCode,
      subscriptionCode,
      hasSubscriptionToken: Boolean(subscriptionToken),
      metadataUserId: typeof metadata.userId === "string" ? metadata.userId : null,
    });

    if (!userId && reference) {
      const { data: subByRef } = await admin
        .from("subscriptions")
        .select("user_id")
        .eq("provider", "paystack")
        .eq("provider_reference", reference)
        .maybeSingle();
      if (subByRef?.user_id) {
        userId = String(subByRef.user_id);
      }
    }

    if (!userId && customerCode) {
      const { data: subByCustomer } = await admin
        .from("subscriptions")
        .select("user_id")
        .eq("provider", "paystack")
        .eq("provider_customer_id", customerCode)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (subByCustomer?.user_id) {
        userId = String(subByCustomer.user_id);
      }
    }

    if (!userId) {
      debugPaystackWebhook("webhook.user.unresolved", { event, reference, customerCode });
      return;
    }

    if (event === "charge.success" || event === "subscription.create" || event === "invoice.update") {
      debugPaystackWebhook("webhook.subscription.upsert", {
        userId,
        status: "active",
        reference,
        customerCode,
        subscriptionCode,
        hasSubscriptionToken: Boolean(subscriptionToken),
      });
      await upsertPaystackSubscription({
        userId,
        customerCode,
        subscriptionCode,
        subscriptionToken,
        reference,
        status: "active",
        planCode,
        nextPaymentDate: nextPayment,
      });
      if (event === "charge.success" && customerCode && (!subscriptionCode || !subscriptionToken)) {
        // subscription.create may arrive without resolvable user context; hydrate by customer now.
        await this.syncSubscriptionForUser({ userId, customerCode });
      }
      return;
    }

    if (event === "subscription.not_renew" || event === "subscription.disable" || event === "invoice.payment_failed") {
      debugPaystackWebhook("webhook.subscription.upsert", {
        userId,
        status: "inactive",
        reference,
        customerCode,
        subscriptionCode,
        hasSubscriptionToken: Boolean(subscriptionToken),
      });
      await upsertPaystackSubscription({
        userId,
        customerCode,
        subscriptionCode,
        subscriptionToken,
        reference,
        status: "inactive",
        planCode,
        nextPaymentDate: nextPayment,
      });
    }
  }
}
