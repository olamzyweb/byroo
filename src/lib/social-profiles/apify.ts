import { env, requireEnvValue } from "@/lib/config";
import type { SocialPlatform, SocialProfileData, SocialProfileProvider } from "@/lib/social-profiles/types";
import { parseBoolean, parseNumber, socialProfileUrl } from "@/lib/social-profiles/utils";

function pickString(payload: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

async function runApifyActor(actorId: string, username: string): Promise<Record<string, unknown>> {
  const token = requireEnvValue(env.apifyToken, "APIFY_TOKEN");
  const normalizedActorId = normalizeActorId(actorId);
  const startResponse = await fetch(
    `https://api.apify.com/v2/acts/${encodeURIComponent(normalizedActorId)}/runs?token=${token}&waitForFinish=120`,
    {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usernames: [username],
      username,
      resultsLimit: 1,
      addParentData: false,
    }),
  });

  if (!startResponse.ok) {
    const details = await safeErrorMessage(startResponse);
    throw new Error(`Apify actor run failed (${startResponse.status}) for actor "${normalizedActorId}": ${details}`);
  }

  const runPayload = (await startResponse.json()) as {
    data?: {
      defaultDatasetId?: string;
    };
  };
  const datasetId = runPayload.data?.defaultDatasetId;
  if (!datasetId) {
    throw new Error("Apify dataset id missing from actor run response");
  }

  const datasetResponse = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true&limit=1`
  );
  if (!datasetResponse.ok) {
    const details = await safeErrorMessage(datasetResponse);
    throw new Error(`Apify dataset fetch failed (${datasetResponse.status}): ${details}`);
  }

  const items = (await datasetResponse.json()) as Array<Record<string, unknown>>;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No social profile data returned from provider");
  }
  return items[0];
}

function normalizeActorId(value: string) {
  let actor = value.trim();
  if (!actor) {
    return actor;
  }

  actor = actor.replace(/^https?:\/\/(www\.)?apify\.com\/actors\//i, "");
  actor = actor.replace(/^https?:\/\/api\.apify\.com\/v2\/acts\//i, "");
  actor = actor.split(/[?#]/)[0] ?? actor;
  actor = actor.replace(/\/runs$/i, "");

  // Apify actor path format should be user~actor-name.
  if (actor.includes("/")) {
    const parts = actor.split("/").filter(Boolean);
    if (parts.length >= 2) {
      actor = `${parts[0]}~${parts[1]}`;
    }
  }
  return actor;
}

async function safeErrorMessage(response: Response) {
  try {
    const json = (await response.json()) as { error?: { message?: string }; message?: string };
    return json.error?.message || json.message || "Unknown provider error";
  } catch {
    return "Unknown provider error";
  }
}

class ApifyInstagramProvider implements SocialProfileProvider {
  platform: SocialPlatform = "instagram";

  async fetchProfile(username: string): Promise<SocialProfileData> {
    const actorId = requireEnvValue(env.apifyInstagramActorId, "APIFY_INSTAGRAM_ACTOR_ID");
    const payload = await runApifyActor(actorId, username);

    const normalizedUsername =
      pickString(payload, ["username", "userName", "handle", "ownerUsername"]) ?? username;
    const profileUrl = pickString(payload, ["url", "profileUrl", "profile_url"]) ?? socialProfileUrl("instagram", normalizedUsername);

    return {
      platform: "instagram",
      username: normalizedUsername,
      displayName: pickString(payload, ["fullName", "full_name", "displayName", "name"]),
      profileImageUrl: pickString(payload, ["profilePicUrl", "profilePicUrlHD", "profileImageUrl", "profile_pic_url"]),
      bio: pickString(payload, ["biography", "bio", "description"]),
      followersCount: parseNumber(payload.followersCount ?? payload.followers ?? payload.followerCount),
      followingCount: parseNumber(payload.followsCount ?? payload.following ?? payload.followingCount),
      contentCount: parseNumber(payload.postsCount ?? payload.postCount ?? payload.posts),
      verified: parseBoolean(payload.isVerified ?? payload.verified),
      profileUrl,
      rawPayload: payload,
    };
  }
}

class ApifyTikTokProvider implements SocialProfileProvider {
  platform: SocialPlatform = "tiktok";

  async fetchProfile(username: string): Promise<SocialProfileData> {
    const actorId = requireEnvValue(env.apifyTiktokActorId, "APIFY_TIKTOK_ACTOR_ID");
    const payload = await runApifyActor(actorId, username);

    const normalizedUsername =
      pickString(payload, ["uniqueId", "username", "userName", "authorUniqueId", "handle"]) ?? username;
    const profileUrl = pickString(payload, ["profileUrl", "url", "profile_url"]) ?? socialProfileUrl("tiktok", normalizedUsername);

    return {
      platform: "tiktok",
      username: normalizedUsername,
      displayName: pickString(payload, ["nickname", "displayName", "name"]),
      profileImageUrl: pickString(payload, ["avatarLarger", "avatarMedium", "avatarThumb", "profileImageUrl"]),
      bio: pickString(payload, ["signature", "bio", "description"]),
      followersCount: parseNumber(payload.followerCount ?? payload.followersCount ?? payload.followers),
      followingCount: parseNumber(payload.followingCount ?? payload.following),
      contentCount: parseNumber(payload.videoCount ?? payload.videosCount ?? payload.contentCount),
      verified: parseBoolean(payload.verified ?? payload.isVerified),
      profileUrl,
      rawPayload: payload,
    };
  }
}

export function getApifyProvider(platform: SocialPlatform): SocialProfileProvider {
  return platform === "instagram" ? new ApifyInstagramProvider() : new ApifyTikTokProvider();
}
