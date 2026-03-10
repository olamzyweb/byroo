import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function parseHostFromReferrer(referrer: string | null): string | null {
  if (!referrer) {
    return null;
  }
  try {
    return new URL(referrer).host;
  } catch {
    return null;
  }
}

export async function recordProfileView(params: { profileUserId: string; request: NextRequest }) {
  const admin = createAdminClient();
  const ip = params.request.headers.get("x-forwarded-for") ?? "unknown";
  const ua = params.request.headers.get("user-agent") ?? "unknown";
  const referrer = params.request.headers.get("referer");

  await admin.from("analytics_events").insert({
    profile_user_id: params.profileUserId,
    event_type: "profile_view",
    referrer_host: parseHostFromReferrer(referrer),
    ip_hash: sha256(ip),
    user_agent_hash: sha256(ua),
  });
}

export async function recordLinkClick(params: {
  profileUserId: string;
  linkId: string;
  request: NextRequest;
}) {
  const admin = createAdminClient();
  const ip = params.request.headers.get("x-forwarded-for") ?? "unknown";
  const ua = params.request.headers.get("user-agent") ?? "unknown";
  const referrer = params.request.headers.get("referer");

  await admin.from("analytics_events").insert({
    profile_user_id: params.profileUserId,
    link_id: params.linkId,
    event_type: "link_click",
    referrer_host: parseHostFromReferrer(referrer),
    ip_hash: sha256(ip),
    user_agent_hash: sha256(ua),
  });
}

export async function getAnalyticsSummary(userId: string) {
  const admin = createAdminClient();

  const [viewsResult, clicksResult, topLinksResult] = await Promise.all([
    admin
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("profile_user_id", userId)
      .eq("event_type", "profile_view"),
    admin
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("profile_user_id", userId)
      .eq("event_type", "link_click"),
    admin
      .from("analytics_events")
      .select("link_id, links!inner(title)")
      .eq("profile_user_id", userId)
      .eq("event_type", "link_click")
      .not("link_id", "is", null),
  ]);

  const frequency = new Map<string, { title: string; clicks: number }>();
  for (const row of topLinksResult.data ?? []) {
    const linkId = row.link_id as string;
    const title = (row as { links?: { title?: string } }).links?.title ?? "Link";
    const current = frequency.get(linkId);
    frequency.set(linkId, { title, clicks: (current?.clicks ?? 0) + 1 });
  }

  const topLinks = [...frequency.values()].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  return {
    totalProfileViews: viewsResult.count ?? 0,
    totalLinkClicks: clicksResult.count ?? 0,
    topLinks,
  };
}
