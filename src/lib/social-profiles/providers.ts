import { env } from "@/lib/config";
import { getApifyProvider } from "@/lib/social-profiles/apify";
import { getSearchApiProvider } from "@/lib/social-profiles/searchapi";
import type { SocialPlatform, SocialProfileProvider } from "@/lib/social-profiles/types";

export function getSocialProfileProvider(platform: SocialPlatform): SocialProfileProvider {
  if (env.socialProfileProvider === "searchapi") {
    return getSearchApiProvider(platform);
  }

  if (env.socialProfileProvider === "apify") {
    return getApifyProvider(platform);
  }

  throw new Error(`Unsupported social profile provider: ${env.socialProfileProvider}`);
}
