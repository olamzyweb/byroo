export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripeProMonthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY ?? "",
  paystackWebhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET ?? "",
  paystackProPlanCode: process.env.PAYSTACK_PRO_PLAN_CODE ?? "",
  paystackCallbackUrl: process.env.PAYSTACK_CALLBACK_URL ?? "",
  billingProvider: process.env.BILLING_PROVIDER ?? "stripe",
  billingWebhookDebug: process.env.BILLING_WEBHOOK_DEBUG === "true",
  socialProfileProvider: process.env.SOCIAL_PROFILE_PROVIDER ?? "searchapi",
  searchApiKey: process.env.SEARCHAPI_API_KEY ?? "",
  searchApiBaseUrl: process.env.SEARCHAPI_BASE_URL ?? "https://www.searchapi.io",
  apifyToken: process.env.APIFY_TOKEN ?? "",
  apifyInstagramActorId: process.env.APIFY_INSTAGRAM_ACTOR_ID ?? "",
  apifyTiktokActorId: process.env.APIFY_TIKTOK_ACTOR_ID ?? "",
  socialSyncCronSecret: process.env.SOCIAL_SYNC_CRON_SECRET ?? "",
};

export function hasRequiredPublicEnv(): boolean {
  return Boolean(env.supabaseUrl) && Boolean(env.supabaseAnonKey);
}

export function requireEnvValue(value: string, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}
