import type { SocialPlatform } from "@/lib/social-profiles/types";

export function normalizeSocialUsername(platform: SocialPlatform, value: string): string {
  let username = value.trim();

  username = username.replace(/^@+/, "");
  username = username.replace(/^https?:\/\/(www\.)?/i, "");
  if (platform === "instagram") {
    username = username.replace(/^instagram\.com\//i, "");
  } else {
    username = username.replace(/^tiktok\.com\//i, "");
    username = username.replace(/^@/, "");
  }

  username = username.split(/[/?#]/)[0] ?? "";
  return username.trim();
}

export function isValidSocialUsername(platform: SocialPlatform, username: string): boolean {
  if (platform === "instagram") {
    return /^[A-Za-z0-9._]{1,30}$/.test(username);
  }
  return /^[A-Za-z0-9._]{2,24}$/.test(username);
}

export function socialProfileUrl(platform: SocialPlatform, username: string): string {
  if (platform === "instagram") {
    return `https://www.instagram.com/${username}/`;
  }
  return `https://www.tiktok.com/@${username}`;
}

export function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const normalized = value.replace(/[^\d.-]/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value === 1;
  }
  if (typeof value === "string") {
    const lowered = value.toLowerCase();
    return lowered === "true" || lowered === "1" || lowered === "yes";
  }
  return false;
}
