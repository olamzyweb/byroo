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
    const now = new Date().toISOString();
    
    // Find all 'pro' users whose subscription period has definitively ended
    const { data: expiredSubs } = await admin
      .from("subscriptions")
      .select("user_id, current_period_end")
      .eq("status", "inactive")
      .not("current_period_end", "is", null)
      .lt("current_period_end", now);
      
    const { data: proProfiles } = await admin
      .from("profiles")
      .select("id")
      .eq("plan", "pro");

    const proUserIds = new Set((proProfiles ?? []).map(p => p.id));
    const toDowngrade = (expiredSubs ?? [])
      .filter(sub => proUserIds.has(sub.user_id))
      .map(sub => sub.user_id);

    if (toDowngrade.length > 0) {
      await admin.from("profiles").update({ plan: "free" }).in("id", toDowngrade);
      sweepCount = toDowngrade.length;
      console.info(`[billing-cron] Swept and downgraded ${sweepCount} expired accounts.`);
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
