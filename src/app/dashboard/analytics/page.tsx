import { ButtonLink, Card, SectionHeader, StatCard } from "@/components/ui";
import { hasAnalytics } from "@/lib/feature-gates";
import { getAnalyticsSummary } from "@/lib/analytics";
import { getCurrentProfile, requireUser } from "@/lib/auth";

export default async function AnalyticsPage() {
  const user = await requireUser();
  const profile = await getCurrentProfile(user.id);

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  if (!hasAnalytics(profile.plan)) {
    return (
      <div className="space-y-4">
        <SectionHeader title="Analytics" subtitle="See profile views and clicks with Pro." />
        <Card>
          <p className="text-sm text-[var(--text-soft)]">Upgrade to Pro to unlock analytics insights.</p>
          <ButtonLink href="/dashboard/billing" className="mt-3">
            Go to billing
          </ButtonLink>
        </Card>
      </div>
    );
  }

  const summary = await getAnalyticsSummary(user.id);

  return (
    <div className="space-y-6">
      <SectionHeader title="Analytics" subtitle="Track your profile performance." />
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Total profile views" value={summary.totalProfileViews} />
        <StatCard label="Total link clicks" value={summary.totalLinkClicks} />
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-[var(--text-strong)]">Top links</h3>
        <div className="mt-3 space-y-2">
          {summary.topLinks.length === 0 ? <p className="text-sm text-[var(--text-soft)]">No clicks recorded yet.</p> : null}
          {summary.topLinks.map((item) => {
            const width = Math.max(8, Math.min(100, item.clicks * 10));
            return (
              <div key={item.title} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-soft)]">{item.title}</span>
                  <span className="font-medium text-[var(--text-strong)]">{item.clicks}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-muted)]">
                  <div className="h-2 rounded-full bg-[var(--brand-500)]" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
