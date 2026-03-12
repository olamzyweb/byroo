import { saveAppearanceAction } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, HelperText, SectionHeader } from "@/components/ui";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { PLAN_CONFIG } from "@/lib/plans";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AppearancePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("plan, theme_key, branding_hidden").eq("id", user.id).single();

  return (
    <div className="space-y-6">
      <SectionHeader title="Appearance" subtitle="Customize how your public page feels." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card>
        <form action={saveAppearanceAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Theme</label>
            <select name="themeKey" defaultValue={profile?.theme_key ?? "byroo-light"} className="h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm">
              <option value="byroo-light">Default (Free)</option>
              <option value="byroo-sunset">Sunset (Pro)</option>
              <option value="byroo-forest">Forest (Pro)</option>
              <option value="byroo-ocean">Ocean (Pro)</option>
              <option value="byroo-sand">Sand (Pro)</option>
              <option value="byroo-charcoal">Charcoal (Pro)</option>
            </select>
          </div>

          <ToggleSwitch name="hideBranding" defaultChecked={Boolean(profile?.branding_hidden)} label="Hide Powered by Byroo (Pro)" />

          <SubmitButton pendingText="Saving...">Save appearance</SubmitButton>
        </form>

        <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-soft)]">
          <Badge tone={profile?.plan === "pro" ? "brand" : "neutral"}>Plan: {profile?.plan ?? "free"}</Badge>
          {profile?.plan === "free" ? (
            <span>Free includes {PLAN_CONFIG.free.allowedThemes.length} theme and visible branding.</span>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
