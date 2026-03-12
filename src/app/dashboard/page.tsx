import { ButtonLink, Card, EmptyState, SectionHeader, StatCard } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [
    { count: linkCount },
    { count: portfolioCount },
    { count: catalogCount },
    { count: serviceCount },
    { count: socialProofCount },
    { data: profile },
  ] = await Promise.all([
    supabase.from("links").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("portfolio_items").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("catalog_items").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("social_profiles").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("sync_status", "success"),
    supabase
      .from("profiles")
      .select("display_name, username, plan, onboarded, bio, avatar_url, whatsapp_number, header_image_url")
      .eq("id", user.id)
      .single(),
  ]);

  const completionItems = [
    {
      label: "Claim your username",
      done: Boolean(profile?.username),
      href: "/dashboard/profile",
    },
    {
      label: "Add profile photo",
      done: Boolean(profile?.avatar_url),
      href: "/dashboard/profile",
    },
    {
      label: "Write a short bio",
      done: Boolean(profile?.bio),
      href: "/dashboard/profile",
    },
    {
      label: "Set WhatsApp number",
      done: Boolean(profile?.whatsapp_number),
      href: "/dashboard/whatsapp",
    },
    {
      label: "Add at least one link",
      done: (linkCount ?? 0) > 0,
      href: "/dashboard/links",
    },
    {
      label: "Add one offer (catalog or service)",
      done: (catalogCount ?? 0) > 0 || (serviceCount ?? 0) > 0,
      href: (catalogCount ?? 0) > 0 ? "/dashboard/services" : "/dashboard/catalog",
    },
    {
      label: "Connect social proof",
      done: (socialProofCount ?? 0) > 0,
      href: "/dashboard/socials",
    },
  ];

  const completedCount = completionItems.filter((item) => item.done).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" subtitle="Manage your page and monitor growth." />

      {!profile?.onboarded ? (
        <EmptyState
          title="Complete onboarding"
          body="Set your username and profile details before sharing your page."
          action={<ButtonLink href="/dashboard/profile">Finish setup</ButtonLink>}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Plan" value={String(profile?.plan ?? "free").toUpperCase()} />
        <StatCard label="Links" value={linkCount ?? 0} />
        <StatCard label="Portfolio" value={portfolioCount ?? 0} />
        <StatCard label="Catalog Items" value={catalogCount ?? 0} />
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[var(--text-strong)]">Profile completion</h3>
          <p className="text-sm font-semibold text-[var(--brand-600)]">{completionPercent}%</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[var(--surface-muted)]">
          <div
            className="h-2 rounded-full bg-[var(--brand-500)] transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--text-soft)]">
          {completedCount} of {completionItems.length} setup steps completed
        </p>
        <div className="mt-4 grid gap-2">
          {completionItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={
                    item.done
                      ? "inline-block h-2.5 w-2.5 rounded-full bg-emerald-500"
                      : "inline-block h-2.5 w-2.5 rounded-full bg-amber-500"
                  }
                />
                <p className="text-sm text-[var(--text-strong)]">{item.label}</p>
              </div>
              <ButtonLink href={item.href} variant="ghost" size="sm">
                {item.done ? "Edit" : "Complete"}
              </ButtonLink>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-[var(--text-strong)]">Quick actions</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <ButtonLink href="/dashboard/profile" variant="secondary">
            Edit profile
          </ButtonLink>
          <ButtonLink href="/dashboard/links" variant="secondary">
            Add link
          </ButtonLink>
          <ButtonLink href="/dashboard/socials" variant="secondary">
            Connect socials
          </ButtonLink>
          <ButtonLink href="/dashboard/catalog" variant="secondary">
            Add catalog item
          </ButtonLink>
          <ButtonLink href="/dashboard/billing">Upgrade</ButtonLink>
        </div>
      </Card>
    </div>
  );
}
