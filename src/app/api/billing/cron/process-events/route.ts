import { NextResponse } from "next/server";
import { getBillingProvider } from "@/lib/billing";
import { createAdminClient } from "@/lib/supabase/admin";
import { env } from "@/lib/config";

export async function GET(request: Request) {
  // Simple cron secret protection
  const url = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const token = url.searchParams.get("token") || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null);

  // In production, require a cron secret. Local dev allows bypassing if not set.
  if (process.env.NODE_ENV === "production" && token !== env.socialSyncCronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const provider = getBillingProvider();

  if (!provider.processBillingEvent) {
    return NextResponse.json({ message: "Provider does not support event queue processing" });
  }

  // 1. Process pending webhook events
  const { data: pendingEvents, error } = await admin
    .from("billing_events")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(20);

  if (error) {
    console.error("[billing-cron] Error fetching pending events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }

  let processedCount = 0;
  let failedCount = 0;

  for (const event of pendingEvents ?? []) {
    try {
      // Mark as processing
      await admin.from("billing_events").update({ status: "processing" }).eq("id", event.id);

      await provider.processBillingEvent(event.id, event.payload);

      // Mark as processed
      await admin.from("billing_events").update({ status: "processed", error_message: null }).eq("id", event.id);
      processedCount++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[billing-cron] Event ${event.id} failed:`, msg);
      await admin.from("billing_events").update({ status: "failed", error_message: msg }).eq("id", event.id);
      failedCount++;
    }
  }

  // 2. Nightly Expiration Sweep
  let sweepCount = 0;
  try {
    const now = new Date();
    // 48-Hour Grace Period Cutoff
    const graceCutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    
    // Find all 'pro' users
    const { data: proProfiles } = await admin
      .from("profiles")
      .select("id")
      .eq("plan", "pro");

    const proUserIds = (proProfiles ?? []).map(p => p.id);

    if (proUserIds.length > 0) {
      // A user is valid if they have AT LEAST ONE subscription that is active OR hasn't expired past the grace period
      const { data: validSubs } = await admin
        .from("subscriptions")
        .select("user_id")
        .in("user_id", proUserIds)
        .or(`status.eq.active,current_period_end.gt.${graceCutoff}`);

      const validUserIds = new Set((validSubs ?? []).map(s => s.user_id));

      // Anyone who is Pro but NOT in the valid list gets downgraded
      const toDowngrade = proUserIds.filter(id => !validUserIds.has(id));

      if (toDowngrade.length > 0) {
        await admin.from("profiles").update({ plan: "free" }).in("id", toDowngrade);
        sweepCount = toDowngrade.length;
        console.info(`[billing-cron] Swept and downgraded ${sweepCount} expired accounts.`);
      }
    }
  } catch (err) {
    console.error("[billing-cron] Expiration sweep failed:", err);
  }

  return NextResponse.json({ 
    success: true, 
    processed: processedCount, 
    failed: failedCount,
    swept: sweepCount 
  });
}
