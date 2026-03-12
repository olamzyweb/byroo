import { Card, SectionHeader, StatCard } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";

function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function buildDailySeries(rows: Array<{ created_at: string }>, days: number) {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  for (const row of rows) {
    const key = row.created_at.slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([date, value]) => ({ date, value }));
}

function Sparkline({
  values,
  color,
}: {
  values: number[];
  color: string;
}) {
  const width = 320;
  const height = 80;
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / max) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full">
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MiniBars({
  values,
  color,
}: {
  values: number[];
  color: string;
}) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-24 items-end gap-1">
      {values.map((value, idx) => (
        <div
          key={idx}
          className="flex-1 rounded-t-md"
          style={{
            height: `${Math.max(8, (value / max) * 100)}%`,
            backgroundColor: color,
            opacity: 0.9,
          }}
          title={`${value}`}
        />
      ))}
    </div>
  );
}

export default async function AdminOverviewPage() {
  const admin = createAdminClient();
  const last7Days = daysAgoIso(7);
  const last14Days = daysAgoIso(14);

  const [
    { count: totalUsers },
    { count: proUsers },
    { count: onboardedUsers },
    { count: newUsers7d },
    { count: totalViews },
    { count: totalClicks },
    { count: activeSubscriptions },
    { count: unsyncedPaystackSubscriptions },
    { data: recentProfiles },
    { data: recentViews },
    { data: recentClicks },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "pro"),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("onboarded", true),
    admin.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", last7Days),
    admin.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "profile_view"),
    admin.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "link_click"),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    admin
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("provider", "paystack")
      .eq("status", "active")
      .or("provider_subscription_id.is.null,provider_subscription_token.is.null"),
    admin.from("profiles").select("created_at").gte("created_at", last14Days),
    admin.from("analytics_events").select("created_at").eq("event_type", "profile_view").gte("created_at", last14Days),
    admin.from("analytics_events").select("created_at").eq("event_type", "link_click").gte("created_at", last14Days),
  ]);

  const signupsSeries = buildDailySeries((recentProfiles ?? []) as Array<{ created_at: string }>, 14);
  const viewsSeries = buildDailySeries((recentViews ?? []) as Array<{ created_at: string }>, 14);
  const clicksSeries = buildDailySeries((recentClicks ?? []) as Array<{ created_at: string }>, 14);

  return (
    <div className="space-y-6">
      <SectionHeader title="Admin Overview" subtitle="Platform health, growth, and billing quality in one view." />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total users" value={totalUsers ?? 0} />
        <StatCard label="Pro users" value={proUsers ?? 0} />
        <StatCard label="Onboarded users" value={onboardedUsers ?? 0} />
        <StatCard label="New users (7d)" value={newUsers7d ?? 0} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Profile views" value={totalViews ?? 0} />
        <StatCard label="Link clicks" value={totalClicks ?? 0} />
        <StatCard label="Active subscriptions" value={activeSubscriptions ?? 0} />
        <StatCard label="Unsynced Paystack" value={unsyncedPaystackSubscriptions ?? 0} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-strong)]">New users (last 14 days)</h3>
            <p className="text-xs text-[var(--text-soft)]">{signupsSeries.reduce((a, b) => a + b.value, 0)} total</p>
          </div>
          <div className="mt-3">
            <MiniBars values={signupsSeries.map((s) => s.value)} color="var(--brand-500)" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-strong)]">Traffic trend (last 14 days)</h3>
            <p className="text-xs text-[var(--text-soft)]">Views vs clicks</p>
          </div>
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-xs text-[var(--text-soft)]">Views</p>
              <Sparkline values={viewsSeries.map((s) => s.value)} color="var(--brand-500)" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-soft)]">Clicks</p>
              <Sparkline values={clicksSeries.map((s) => s.value)} color="#0ea5a4" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-[var(--text-strong)]">Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--text-soft)]">
          <li>Unsynced Paystack means active rows missing subscription id or token.</li>
          <li>Use Admin Subscriptions to force sync when webhook races happen.</li>
          <li>Use Admin Users to adjust plans or admin access during support operations.</li>
        </ul>
      </Card>
    </div>
  );
}
