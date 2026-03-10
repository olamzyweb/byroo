import type { Plan, ThemeKey } from "@/lib/types";

export const PLAN_CONFIG = {
  free: {
    key: "free",
    label: "Free",
    priceMonthly: 0,
    maxLinks: 5,
    maxPortfolioItems: 3,
    canHideBranding: false,
    analyticsEnabled: false,
    allowedThemes: ["byroo-light"] as ThemeKey[],
  },
  pro: {
    key: "pro",
    label: "Pro",
    priceMonthly: 12,
    maxLinks: Number.POSITIVE_INFINITY,
    maxPortfolioItems: Number.POSITIVE_INFINITY,
    canHideBranding: true,
    analyticsEnabled: true,
    allowedThemes: ["byroo-light", "byroo-sunset", "byroo-forest"] as ThemeKey[],
  },
} as const;

export const PRICE_CONFIG = {
  proMonthly: {
    key: "pro_monthly",
    plan: "pro" as Plan,
    interval: "month",
  },
};

export function getPlanConfig(plan: Plan) {
  return PLAN_CONFIG[plan];
}

export function isPro(plan: Plan): boolean {
  return plan === "pro";
}
