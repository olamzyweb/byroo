import { replayBillingEventAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, HelperText, SectionHeader } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminBillingLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const admin = createAdminClient();

  const { data: events } = await admin
    .from("billing_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <SectionHeader title="Billing Event Logs" subtitle="Monitor the webhook queue and replay any failed billing events." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">
            <tr>
              <th className="px-4 py-3">Event ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Reference / Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(events ?? []).map((row) => {
              let tone: "neutral" | "success" | "warning" | "brand" = "neutral";
              if (row.status === "processed") tone = "success";
              if (row.status === "failed") tone = "warning";
              if (row.status === "processing") tone = "warning";

              return (
                <tr key={row.id} className="border-t border-[var(--border-subtle)] align-top">
                  <td className="px-4 py-3 text-xs">
                    <span className="font-mono text-[var(--text-soft)]">{row.id.split("-")[0]}...</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text-strong)]">{row.event_type}</p>
                    <p className="text-xs text-[var(--text-soft)]">{row.provider}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-soft)]">
                    <p>Ref: {row.reference || "-"}</p>
                    <p>Cus: {row.customer_id || "-"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <Badge tone={tone}>{row.status}</Badge>
                      {row.error_message && (
                        <p className="text-xs text-red-500 max-w-[200px] truncate" title={row.error_message}>
                          {row.error_message}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-soft)]">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {row.status === "failed" ? (
                      <form action={replayBillingEventAction}>
                        <input type="hidden" name="eventId" value={row.id} />
                        <SubmitButton size="sm" variant="secondary" pendingText="Replaying...">
                          Replay
                        </SubmitButton>
                      </form>
                    ) : (
                      <span className="text-xs text-[var(--text-soft)]">-</span>
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
