import { createAdminClient } from "@/lib/supabase/admin";
import { getSocialProfileProvider } from "@/lib/social-profiles/providers";
import type { SocialPlatform } from "@/lib/social-profiles/types";

export async function syncSocialProfile(userId: string, platform: SocialPlatform, username: string) {
  const admin = createAdminClient();
  await admin
    .from("social_profiles")
    .update({
      sync_status: "syncing",
      sync_error: null,
    })
    .eq("user_id", userId)
    .eq("platform", platform);

  try {
    const provider = getSocialProfileProvider(platform);
    const result = await provider.fetchProfile(username);

    await admin.from("social_profiles").upsert(
      {
        user_id: userId,
        platform,
        username: result.username,
        display_name: result.displayName,
        profile_image_url: result.profileImageUrl,
        bio: result.bio,
        followers_count: result.followersCount,
        following_count: result.followingCount,
        content_count: result.contentCount,
        verified: result.verified,
        profile_url: result.profileUrl,
        raw_payload: result.rawPayload,
        sync_status: "success",
        sync_error: null,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "user_id,platform" }
    );

    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    await admin
      .from("social_profiles")
      .update({
        sync_status: "error",
        sync_error: message.slice(0, 400),
      })
      .eq("user_id", userId)
      .eq("platform", platform);
    return { ok: false as const, error: message };
  }
}
