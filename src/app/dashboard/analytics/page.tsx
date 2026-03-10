import Link from "next/link";
import { Card, SectionTitle } from "@/components/ui";
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
        <SectionTitle title="Analytics" subtitle="Pro-only dashboard analytics." />
        <Card>
          <p className="text-sm text-slate-700">Upgrade to Pro to unlock analytics.</p>
          <Link href="/dashboard/billing" className="mt-3 inline-block text-sm font-semibold text-sky-700">
            Go to billing
          </Link>
        </Card>
      </div>
    );
  }

  const summary = await getAnalyticsSummary(user.id);

  return (
    <div className="space-y-6">
      <SectionTitle title="Analytics" subtitle="Track page visits and link engagement." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-500">Total profile views</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalProfileViews}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Total link clicks</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.totalLinkClicks}</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-slate-900">Top clicked links</h3>
        <div className="mt-3 space-y-2 text-sm">
          {summary.topLinks.length === 0 ? <p className="text-slate-500">No clicks recorded yet.</p> : null}
          {summary.topLinks.map((item) => (
            <div key={item.title} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-700">{item.title}</span>
              <span className="font-semibold text-slate-900">{item.clicks}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
