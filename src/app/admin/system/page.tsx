import { Badge, Card, SectionHeader, StatCard } from "@/components/ui";
import { env } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminSystemPage() {
  const admin = createAdminClient();

  const [
    { count: avatarObjects },
    { count: portfolioObjects },
    { count: catalogObjects },
    { count: paystackBrokenRows },
    { data: recentAuditLogs },
  ] = await Promise.all([
    admin.schema("storage").from("objects").select("id", { count: "exact", head: true }).eq("bucket_id", "avatars"),
    admin.schema("storage").from("objects").select("id", { count: "exact", head: true }).eq("bucket_id", "portfolio"),
    admin.schema("storage").from("objects").select("id", { count: "exact", head: true }).eq("bucket_id", "catalog"),
    admin
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("provider", "paystack")
      .eq("status", "active")
      .or("provider_subscription_id.is.null,provider_subscription_token.is.null"),
    admin
      .from("admin_audit_logs")
      .select("id, actor_user_id, action, target_user_id, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="space-y-6">
      <SectionHeader title="System Health" subtitle="Billing sync, storage footprint, and admin activity." />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Avatar files" value={avatarObjects ?? 0} />
        <StatCard label="Portfolio files" value={portfolioObjects ?? 0} />
        <StatCard label="Catalog files" value={catalogObjects ?? 0} />
        <StatCard label="Broken Paystack rows" value={paystackBrokenRows ?? 0} />
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-[var(--text-strong)]">Runtime config</h3>
        <div className="mt-3 space-y-2 text-sm text-[var(--text-soft)]">
          <p>
            Billing provider: <span className="font-medium text-[var(--text-strong)]">{env.billingProvider}</span>
          </p>
          <p>
            Webhook debug: <Badge tone={env.billingWebhookDebug ? "warning" : "neutral"}>{String(env.billingWebhookDebug)}</Badge>
          </p>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <div className="border-b border-[var(--border-subtle)] px-4 py-3">
          <h3 className="text-sm font-semibold text-[var(--text-strong)]">Recent admin actions</h3>
        </div>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Target</th>
            </tr>
          </thead>
          <tbody>
            {(recentAuditLogs ?? []).map((row) => (
              <tr key={row.id} className="border-t border-[var(--border-subtle)]">
                <td className="px-4 py-3 text-xs text-[var(--text-soft)]">{new Date(row.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-xs font-medium text-[var(--text-strong)]">{row.action}</td>
                <td className="px-4 py-3 text-xs text-[var(--text-soft)]">{row.actor_user_id}</td>
                <td className="px-4 py-3 text-xs text-[var(--text-soft)]">{row.target_user_id ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
