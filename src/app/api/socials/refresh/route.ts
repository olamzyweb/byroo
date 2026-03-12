import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/config";
import { syncSocialProfile } from "@/lib/social-profiles/service";
import type { SocialPlatform } from "@/lib/social-profiles/types";
import { createAdminClient } from "@/lib/supabase/admin";

function isAuthorized(request: NextRequest) {
  const expected = env.socialSyncCronSecret;
  if (!expected) {
    return false;
  }
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
  const querySecret = request.nextUrl.searchParams.get("secret") ?? "";
  return bearer === expected || querySecret === expected;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const staleCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: rows } = await admin
    .from("social_profiles")
    .select("user_id, platform, username, last_synced_at, sync_status")
    .neq("sync_status", "syncing")
    .or(`last_synced_at.is.null,last_synced_at.lt.${staleCutoff}`)
    .limit(20);

  let synced = 0;
  let failed = 0;

  for (const row of rows ?? []) {
    const result = await syncSocialProfile(row.user_id, row.platform as SocialPlatform, row.username);
    if (result.ok) {
      synced += 1;
    } else {
      failed += 1;
    }
  }

  return NextResponse.json({
    processed: (rows ?? []).length,
    synced,
    failed,
  });
}
