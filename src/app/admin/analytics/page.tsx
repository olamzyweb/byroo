import { Card, SectionHeader, StatCard } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

export default async function AdminAnalyticsPage() {
  const admin = createAdminClient();

  const [{ count: totalViews }, { count: totalClicks }, { data: events }, { data: links }, { data: profiles }] = await Promise.all([
    admin.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "profile_view"),
    admin.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "link_click"),
    admin.from("analytics_events").select("profile_user_id, link_id, event_type").order("created_at", { ascending: false }).limit(5000),
    admin.from("links").select("id, title, user_id"),
    admin.from("profiles").select("id, display_name, username"),
  ]);

  const linkTitleById = new Map((links ?? []).map((link) => [link.id, link.title]));
  const profileNameById = new Map((profiles ?? []).map((profile) => [profile.id, profile.display_name || profile.username || profile.id]));

  const profileCounts = new Map<string, number>();
  const linkCounts = new Map<string, number>();

  for (const event of events ?? []) {
    if (event.event_type === "profile_view") {
      increment(profileCounts, event.profile_user_id);
    } else if (event.event_type === "link_click" && event.link_id) {
      increment(linkCounts, event.link_id);
    }
  }

  const topProfiles = Array.from(profileCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([profileId, count]) => ({ label: profileNameById.get(profileId) ?? profileId, count }));

  const topLinks = Array.from(linkCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([linkId, count]) => ({ label: linkTitleById.get(linkId) ?? linkId, count }));

  return (
    <div className="space-y-6">
      <SectionHeader title="Platform Analytics" subtitle="First-party traffic and engagement snapshots." />

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Total profile views" value={totalViews ?? 0} />
        <StatCard label="Total link clicks" value={totalClicks ?? 0} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-[var(--text-strong)]">Top profiles</h3>
          <div className="mt-3 space-y-2">
            {topProfiles.length === 0 ? <p className="text-sm text-[var(--text-soft)]">No profile views yet.</p> : null}
            {topProfiles.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-soft)]">{item.label}</span>
                <span className="font-medium text-[var(--text-strong)]">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[var(--text-strong)]">Top links</h3>
          <div className="mt-3 space-y-2">
            {topLinks.length === 0 ? <p className="text-sm text-[var(--text-soft)]">No link clicks yet.</p> : null}
            {topLinks.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-soft)]">{item.label}</span>
                <span className="font-medium text-[var(--text-strong)]">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
