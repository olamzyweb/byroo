export type SocialPlatform = "instagram" | "tiktok";

export type SocialSyncStatus = "idle" | "syncing" | "success" | "error";

export interface SocialProfileData {
  platform: SocialPlatform;
  username: string;
  displayName: string | null;
  profileImageUrl: string | null;
  bio: string | null;
  followersCount: number | null;
  followingCount: number | null;
  contentCount: number | null;
  verified: boolean;
  profileUrl: string;
  rawPayload: Record<string, unknown> | null;
}

export interface SocialProfileProvider {
  platform: SocialPlatform;
  fetchProfile(username: string): Promise<SocialProfileData>;
}
