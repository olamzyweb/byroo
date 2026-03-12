import { saveProfileAction, uploadAvatarAction, uploadHeaderImageAction } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, Card, HelperText, Input, SectionHeader, TextArea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="space-y-6">
      <SectionHeader title="Profile" subtitle="Core brand identity and social trust links." />

      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h3 className="text-sm font-semibold">Profile details</h3>
          <form action={saveProfileAction} className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Display name</label>
              <Input name="displayName" defaultValue={profile?.display_name ?? ""} required />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Username</label>
              <Input name="username" defaultValue={profile?.username ?? ""} placeholder="yourname" required />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Bio</label>
              <TextArea name="bio" rows={3} defaultValue={profile?.bio ?? ""} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Input name="instagramUrl" defaultValue={profile?.instagram_url ?? ""} placeholder="Instagram URL" />
              <Input name="tiktokUrl" defaultValue={profile?.tiktok_url ?? ""} placeholder="TikTok URL" />
              <Input name="facebookUrl" defaultValue={profile?.facebook_url ?? ""} placeholder="Facebook URL" />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Trusted badge text</label>
              <Input name="trustedBadgeText" defaultValue={profile?.trusted_badge_text ?? ""} placeholder="Trusted by 500+ happy customers" />
            </div>
            <SubmitButton pendingText="Saving...">Save profile</SubmitButton>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold">Avatar</h3>
            <form action={uploadAvatarAction} className="mt-3 space-y-3">
              <Input type="file" name="avatar" accept="image/*" />
              <SubmitButton variant="secondary" pendingText="Uploading...">
                Upload avatar
              </SubmitButton>
            </form>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold">Header background</h3>
            <form action={uploadHeaderImageAction} className="mt-3 space-y-3">
              <Input type="file" name="headerImage" accept="image/*" />
              <SubmitButton variant="secondary" pendingText="Uploading...">
                Upload header image
              </SubmitButton>
            </form>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold">Live preview</h3>
            <div className="mt-3 rounded-xl bg-[var(--surface-muted)] p-3">
              <div
                className="mb-3 h-24 rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: profile?.header_image_url
                    ? `linear-gradient(rgba(15,23,42,0.25), rgba(15,23,42,0.25)), url(${profile.header_image_url})`
                    : "none",
                  backgroundColor: profile?.header_image_url ? undefined : "var(--surface)",
                }}
              />
              <Avatar name={profile?.display_name ?? "User"} src={profile?.avatar_url} size="lg" />
              <p className="mt-3 text-sm font-semibold">{profile?.display_name ?? "Display Name"}</p>
              <p className="mt-1 text-xs text-[var(--text-soft)]">{profile?.bio || "Your business summary appears here."}</p>
              <div className="mt-3 rounded-lg bg-[var(--surface)] px-3 py-2 text-xs">/{profile?.username || "username"}</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
