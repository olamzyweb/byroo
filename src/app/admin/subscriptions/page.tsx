import { syncPaystackSubscriptionAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, HelperText, SectionHeader } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const admin = createAdminClient();

  const { data: subscriptions } = await admin
    .from("subscriptions")
    .select(
      "id, user_id, provider, status, provider_customer_id, provider_subscription_id, provider_subscription_token, provider_reference, current_period_end, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(150);

  const userIds = Array.from(new Set((subscriptions ?? []).map((row) => row.user_id)));
  const { data: profiles } = userIds.length
    ? await admin.from("profiles").select("id, email, username, display_name, plan").in("id", userIds)
    : { data: [] as Array<{ id: string; email: string; username: string | null; display_name: string; plan: string }> };
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <SectionHeader title="Subscriptions" subtitle="Monitor billing records, identify broken sync states, and trigger repair actions." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sync health</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(subscriptions ?? []).map((row) => {
              const profile = profileMap.get(row.user_id);
              const hasCode = Boolean(row.provider_subscription_id);
              const hasToken = Boolean(row.provider_subscription_token);
              const isPaystackBroken = row.provider === "paystack" && row.status === "active" && (!hasCode || !hasToken);
              return (
                <tr key={row.id} className="border-t border-[var(--border-subtle)] align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text-strong)]">{profile?.display_name ?? row.user_id}</p>
                    <p className="text-xs text-[var(--text-soft)]">{profile?.email ?? "Unknown email"}</p>
                    <p className="text-xs text-[var(--text-soft)]">/{profile?.username ?? "no-username"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="neutral">{row.provider}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={row.status === "active" ? "success" : "warning"}>{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1 text-xs text-[var(--text-soft)]">
                      <p>customer: {row.provider_customer_id ? "yes" : "no"}</p>
                      <p>subscription code: {hasCode ? "yes" : "no"}</p>
                      <p>subscription token: {hasToken ? "yes" : "no"}</p>
                      {isPaystackBroken ? <Badge tone="warning">needs sync</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-soft)]">
                    <p>updated: {new Date(row.updated_at).toLocaleString()}</p>
                    <p>period end: {row.current_period_end ? new Date(row.current_period_end).toLocaleDateString() : "-"}</p>
                  </td>
                  <td className="px-4 py-3">
                    {row.provider === "paystack" ? (
                      <form action={syncPaystackSubscriptionAction} className="space-y-2">
                        <input type="hidden" name="targetUserId" value={row.user_id} />
                        <input type="hidden" name="customerCode" value={row.provider_customer_id ?? ""} />
                        <input type="hidden" name="returnTo" value="/admin/subscriptions" />
                        <SubmitButton size="sm" variant="secondary" pendingText="Syncing...">
                          Sync Paystack
                        </SubmitButton>
                      </form>
                    ) : (
                      <span className="text-xs text-[var(--text-soft)]">No action</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
