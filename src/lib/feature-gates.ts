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

export function canUseTheme(plan: Plan, themeKey: ThemeKey): boolean {
  return getPlanConfig(plan).allowedThemes.includes(themeKey);
}

export function canHideBranding(plan: Plan): boolean {
  return getPlanConfig(plan).canHideBranding;
}

export function hasAnalytics(plan: Plan): boolean {
  return getPlanConfig(plan).analyticsEnabled;
}
