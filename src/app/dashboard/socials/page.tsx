import {
  disconnectSocialProfileAction,
  refreshSocialProfileAction,
  saveSocialProfileAction,
} from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, HelperText, Input, SectionHeader } from "@/components/ui";
import { getPlanConfig } from "@/lib/plans";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type SocialRow = {
  platform: "instagram" | "tiktok";
  username: string;
  display_name: string | null;
  profile_image_url: string | null;
  bio: string | null;
  followers_count: number | null;
  following_count: number | null;
  content_count: number | null;
  verified: boolean;
  profile_url: string;
  sync_status: "idle" | "syncing" | "success" | "error";
  sync_error: string | null;
  last_synced_at: string | null;
};

const platforms: Array<{ key: "instagram" | "tiktok"; label: string; placeholder: string }> = [
  { key: "instagram", label: "Instagram", placeholder: "your_instagram_username" },
  { key: "tiktok", label: "TikTok", placeholder: "yourtiktokusername" },
];

function formatCount(value: number | null) {
  if (value == null) {
    return "-";
  }
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export default async function SocialsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: profile }, { data: socialRows }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
    supabase.from("social_profiles").select("*").eq("user_id", user.id),
  ]);

  const rowsByPlatform = new Map((socialRows ?? []).map((row) => [row.platform, row as SocialRow]));
  const connectedCount = socialRows?.length ?? 0;
  const maxCards = getPlanConfig((profile?.plan ?? "free") as "free" | "pro").maxSocialProofCards;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Social Proof"
        subtitle="Connect Instagram and TikTok usernames so visitors can verify your audience and trust signals."
      />

      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card>
        <p className="text-sm text-[var(--text-soft)]">
          Plan limit: <span className="font-medium text-[var(--text-strong)]">{connectedCount}</span> /{" "}
          <span className="font-medium text-[var(--text-strong)]">{Number.isFinite(maxCards) ? maxCards : "∞"}</span> connected social proof cards.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {platforms.map((platform) => {
          const row = rowsByPlatform.get(platform.key);
          return (
            <Card key={platform.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-strong)]">{platform.label}</h3>
                <Badge tone={row?.sync_status === "success" ? "success" : row?.sync_status === "error" ? "warning" : "neutral"}>
                  {row?.sync_status ?? "not connected"}
                </Badge>
              </div>

              <form action={saveSocialProfileAction} className="space-y-2">
                <input type="hidden" name="platform" value={platform.key} />
                <Input
                  name="username"
                  defaultValue={row?.username ?? ""}
                  placeholder={platform.placeholder}
                  required
                />
                <SubmitButton variant="secondary" pendingText="Syncing...">
                  {row ? "Update + Sync" : `Connect ${platform.label}`}
                </SubmitButton>
              </form>

              {row ? (
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3">
                  <div className="flex items-center gap-3">
                    {row.profile_image_url ? (
                      <img
                        src={row.profile_image_url}
                        alt={row.display_name ?? row.username}
                        className="h-12 w-12 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-[var(--surface)]" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-strong)]">
                        {row.display_name ?? row.username} {row.verified ? "✓" : ""}
                      </p>
                      <p className="text-xs text-[var(--text-soft)]">@{row.username}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[var(--text-soft)]">
                    <div>
                      <p className="font-medium text-[var(--text-strong)]">{formatCount(row.followers_count)}</p>
                      <p>followers</p>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-strong)]">{formatCount(row.following_count)}</p>
                      <p>following</p>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-strong)]">{formatCount(row.content_count)}</p>
                      <p>content</p>
                    </div>
                  </div>
                  {row.bio ? <p className="mt-2 line-clamp-2 text-xs text-[var(--text-soft)]">{row.bio}</p> : null}
                  <p className="mt-2 text-[11px] text-[var(--text-soft)]">
                    Last synced: {row.last_synced_at ? new Date(row.last_synced_at).toLocaleString() : "Never"}
                  </p>
                  {row.sync_error ? <p className="mt-1 text-[11px] text-rose-600">{row.sync_error}</p> : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <form action={refreshSocialProfileAction}>
                      <input type="hidden" name="platform" value={platform.key} />
                      <SubmitButton size="sm" variant="secondary" pendingText="Refreshing...">
                        Refresh
                      </SubmitButton>
                    </form>
                    <form action={disconnectSocialProfileAction}>
                      <input type="hidden" name="platform" value={platform.key} />
                      <SubmitButton size="sm" variant="danger" pendingText="Disconnecting...">
                        Disconnect
                      </SubmitButton>
                    </form>
                    <a href={row.profile_url} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center rounded-lg px-3 text-xs font-medium text-[var(--brand-600)]">
                      View profile
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[var(--text-soft)]">
                  {platform.key === "instagram"
                    ? "Add your Instagram username to show customers your audience and activity."
                    : "Connect your TikTok profile to build trust with visitors."}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
