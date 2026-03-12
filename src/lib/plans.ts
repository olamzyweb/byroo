import type { Plan, ThemeKey } from "@/lib/types";

export const PLAN_CONFIG = {
  free: {
    key: "free",
    label: "Free",
    priceMonthly: 0,
    maxLinks: 5,
    maxPortfolioItems: 3,
    maxCatalogItems: 5,
    maxServices: 6,
    maxTestimonials: 2,
    maxSocialProofCards: 1,
    canHideBranding: false,
    analyticsEnabled: false,
    allowedThemes: ["byroo-light"] as ThemeKey[],
  },
  pro: {
    key: "pro",
    label: "Pro",
    priceMonthly: 500,
    maxLinks: Number.POSITIVE_INFINITY,
    maxPortfolioItems: Number.POSITIVE_INFINITY,
    maxCatalogItems: Number.POSITIVE_INFINITY,
    maxServices: Number.POSITIVE_INFINITY,
    maxTestimonials: Number.POSITIVE_INFINITY,
    maxSocialProofCards: 2,
    canHideBranding: true,
    analyticsEnabled: true,
    allowedThemes: [
      "byroo-light",
      "byroo-sunset",
      "byroo-forest",
      "byroo-ocean",
      "byroo-sand",
      "byroo-charcoal",
    ] as ThemeKey[],
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
