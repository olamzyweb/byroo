import { env, requireEnvValue } from "@/lib/config";
import type { SocialPlatform, SocialProfileData, SocialProfileProvider } from "@/lib/social-profiles/types";
import { parseBoolean, parseNumber, socialProfileUrl } from "@/lib/social-profiles/utils";

type SearchApiResponse = Record<string, unknown>;

function pickString(payload: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = getByPath(payload, key);
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function getByPath(payload: Record<string, unknown>, path: string): unknown {
  if (!path.includes(".")) {
    return payload[path];
  }

  const parts = path.split(".");
  let current: unknown = payload;
  for (const part of parts) {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function getRecord(payload: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const value = payload[key];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function normalizeImageUrl(url: string | null): string | null {
  if (!url) {
    return null;
  }
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
}

async function searchApiRequest(params: Record<string, string>): Promise<SearchApiResponse> {
  const apiKey = requireEnvValue(env.searchApiKey, "SEARCHAPI_API_KEY");
  const query = new URLSearchParams(params);
  query.set("api_key", apiKey);

  const response = await fetch(`${env.searchApiBaseUrl}/api/v1/search?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const payload = (await response.json()) as SearchApiResponse;
  if (!response.ok) {
    const message = typeof payload.error === "string" ? payload.error : typeof payload.message === "string" ? payload.message : "Unknown SearchAPI error";
    throw new Error(`SearchAPI request failed (${response.status}): ${message}`);
  }
  return payload;
}

class SearchApiInstagramProvider implements SocialProfileProvider {
  platform: SocialPlatform = "instagram";

  async fetchProfile(username: string): Promise<SocialProfileData> {
    const payload = await searchApiRequest({
      engine: "instagram_profile",
      username,
    });

    const profile = getRecord(payload, "profile") ?? payload;
    const normalizedUsername = pickString(profile, ["username", "user_name"]) ?? username;

    const profileImageUrl = normalizeImageUrl(
      pickString(profile, [
        "avatar_hd",
        "avatar",
        "profile_image_url",
        "profile_picture",
        "profile_pic_url_hd",
        "profile_pic_url",
        "hd_profile_pic_url_info.url",
        "thumbnail",
      ])
    );

    return {
      platform: "instagram",
      username: normalizedUsername,
      displayName: pickString(profile, ["name", "full_name", "display_name"]),
      profileImageUrl,
      bio: pickString(profile, ["bio", "biography", "description"]),
      followersCount: parseNumber(profile.followers ?? profile.followers_count),
      followingCount: parseNumber(profile.following ?? profile.following_count),
      contentCount: parseNumber(profile.posts ?? profile.posts_count),
      verified: parseBoolean(profile.is_verified ?? profile.verified),
      profileUrl: pickString(profile, ["profile_url", "url"]) ?? socialProfileUrl("instagram", normalizedUsername),
      rawPayload: payload,
    };
  }
}

class SearchApiTikTokProvider implements SocialProfileProvider {
  platform: SocialPlatform = "tiktok";

  async fetchProfile(username: string): Promise<SocialProfileData> {
    const payload = await searchApiRequest({
      engine: "tiktok_profile",
      username,
    });

    const profile = getRecord(payload, "profile") ?? payload;
    const normalizedUsername = pickString(profile, ["username", "unique_id", "uniqueId"]) ?? username;

    const profileImageUrl = normalizeImageUrl(
      pickString(profile, ["avatar_hd", "avatar", "avatarLarger", "avatarMedium", "avatarThumb"])
    );

    return {
      platform: "tiktok",
      username: normalizedUsername,
      displayName: pickString(profile, ["name", "nickname", "display_name"]),
      profileImageUrl,
      bio: pickString(profile, ["bio", "signature", "description"]),
      followersCount: parseNumber(profile.followers ?? profile.follower_count ?? profile.followers_count),
      followingCount: parseNumber(profile.following ?? profile.following_count),
      contentCount: parseNumber(profile.posts ?? profile.video_count ?? profile.posts_count),
      verified: parseBoolean(profile.is_verified ?? profile.verified),
      profileUrl: pickString(profile, ["profile_url", "url"]) ?? socialProfileUrl("tiktok", normalizedUsername),
      rawPayload: payload,
    };
  }
}

export function getSearchApiProvider(platform: SocialPlatform): SocialProfileProvider {
  return platform === "instagram" ? new SearchApiInstagramProvider() : new SearchApiTikTokProvider();
}
