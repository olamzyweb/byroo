import { getPlanConfig } from "@/lib/plans";
import type { Plan, ThemeKey } from "@/lib/types";

export function canCreateLink(plan: Plan, currentCount: number): boolean {
  const cfg = getPlanConfig(plan);
  return currentCount < cfg.maxLinks;
}

export function canCreatePortfolioItem(plan: Plan, currentCount: number): boolean {
  const cfg = getPlanConfig(plan);
  return currentCount < cfg.maxPortfolioItems;
}

export function canCreateCatalogItem(plan: Plan, currentCount: number): boolean {
  const cfg = getPlanConfig(plan);
  return currentCount < cfg.maxCatalogItems;
}

export function canCreateService(plan: Plan, currentCount: number): boolean {
  const cfg = getPlanConfig(plan);
  return currentCount < cfg.maxServices;
}

export function canCreateTestimonial(plan: Plan, currentCount: number): boolean {
  const cfg = getPlanConfig(plan);
  return currentCount < cfg.maxTestimonials;
}

export function canConnectSocialProofCard(plan: Plan, currentCount: number): boolean {
  const cfg = getPlanConfig(plan);
  return currentCount < cfg.maxSocialProofCards;
}

export function canUseTheme(plan: Plan, themeKey: ThemeKey): boolean {
  return getPlanConfig(plan).allowedThemes.includes(themeKey);
}

export function canHideBranding(plan: Plan): boolean {
  return getPlanConfig(plan).canHideBranding;
}

export function hasAnalytics(plan: Plan): boolean {
  return getPlanConfig(plan).analyticsEnabled;
}
