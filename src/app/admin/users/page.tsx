import { setAdminAccessAction, setUserPlanAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, HelperText, Input, SectionHeader } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const admin = createAdminClient();

  let request = admin
    .from("profiles")
    .select("id, email, username, display_name, plan, onboarded, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (query) {
    request = request.or(`email.ilike.%${query}%,username.ilike.%${query}%,display_name.ilike.%${query}%`);
  }

  const [{ data: profiles }, { data: adminRows }] = await Promise.all([
    request,
    admin.from("admin_users").select("user_id"),
  ]);

  const adminIds = new Set((adminRows ?? []).map((row) => row.user_id));

  return (
    <div className="space-y-6">
      <SectionHeader title="Users" subtitle="Search users, inspect account state, and apply support actions." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card>
        <form className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input name="q" placeholder="Search by email, username, display name" defaultValue={query} />
          <SubmitButton variant="secondary" pendingText="Searching...">
            Search
          </SubmitButton>
        </form>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((profile) => {
              const isAdmin = adminIds.has(profile.id);
              return (
                <tr key={profile.id} className="border-t border-[var(--border-subtle)] align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text-strong)]">{profile.display_name}</p>
                    <p className="text-xs text-[var(--text-soft)]">{profile.email}</p>
                    <p className="text-xs text-[var(--text-soft)]">/{profile.username || "no-username"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={profile.plan === "pro" ? "brand" : "neutral"}>{profile.plan}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={profile.onboarded ? "success" : "warning"}>{profile.onboarded ? "onboarded" : "pending"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={isAdmin ? "brand" : "neutral"}>{isAdmin ? "admin" : "user"}</Badge>
                  </td>
                  <td className="space-y-2 px-4 py-3">
                    <form action={setUserPlanAction} className="flex flex-wrap items-center gap-2">
                      <input type="hidden" name="targetUserId" value={profile.id} />
                      <input type="hidden" name="returnTo" value={`/admin/users${query ? `?q=${encodeURIComponent(query)}` : ""}`} />
                      <select
                        name="plan"
                        defaultValue={profile.plan}
                        className="h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2 text-xs"
                      >
                        <option value="free">free</option>
                        <option value="pro">pro</option>
                      </select>
                      <SubmitButton size="sm" variant="secondary" pendingText="Saving...">
                        Save plan
                      </SubmitButton>
                    </form>
                    <form action={setAdminAccessAction}>
                      <input type="hidden" name="targetUserId" value={profile.id} />
                      <input type="hidden" name="mode" value={isAdmin ? "revoke" : "grant"} />
                      <input type="hidden" name="returnTo" value={`/admin/users${query ? `?q=${encodeURIComponent(query)}` : ""}`} />
                      <SubmitButton size="sm" variant={isAdmin ? "danger" : "secondary"} pendingText="Saving...">
                        {isAdmin ? "Revoke admin" : "Grant admin"}
                      </SubmitButton>
                    </form>
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
