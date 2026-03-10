import { saveAppearanceAction } from "@/app/dashboard/actions";
import { Button, Card, SectionTitle } from "@/components/ui";
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
      <SectionTitle title="Appearance" subtitle="Choose your theme and branding settings." />
      {params.error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{params.error}</p> : null}
      {params.message ? <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">{params.message}</p> : null}

      <Card>
        <form action={saveAppearanceAction} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-slate-700">Theme</label>
            <select name="themeKey" defaultValue={profile?.theme_key ?? "byroo-light"} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="byroo-light">Byroo Light (Free)</option>
              <option value="byroo-sunset">Sunset Pro</option>
              <option value="byroo-forest">Forest Pro</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="hideBranding" defaultChecked={Boolean(profile?.branding_hidden)} />
            Hide &quot;Powered by Byroo&quot; (Pro)
          </label>

          <Button type="submit">Save appearance</Button>
        </form>

        {profile?.plan === "free" ? (
          <p className="mt-3 text-sm text-slate-600">
            Free plan includes {PLAN_CONFIG.free.allowedThemes.length} theme and requires Byroo branding.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
