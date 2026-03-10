import { saveProfileAction, uploadAvatarAction } from "@/app/dashboard/actions";
import { Card, Button, Input, SectionTitle, TextArea } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

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
      <SectionTitle title="Profile" subtitle="Set your username and basic profile details." />

      {params.error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{params.error}</p> : null}
      {params.message ? <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">{params.message}</p> : null}

      <Card>
        <h3 className="text-sm font-semibold text-slate-900">Avatar</h3>
        <form action={uploadAvatarAction} className="mt-3 flex flex-wrap items-center gap-3">
          <Input type="file" name="avatar" accept="image/*" className="max-w-sm" />
          <Button type="submit">Upload</Button>
        </form>
        {profile?.avatar_url ? <img src={profile.avatar_url} alt="avatar" className="mt-3 h-20 w-20 rounded-full object-cover" /> : null}
      </Card>

      <Card>
        <form action={saveProfileAction} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-slate-700">Display name</label>
            <Input name="displayName" defaultValue={profile?.display_name ?? ""} required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-700">Username</label>
            <Input name="username" defaultValue={profile?.username ?? ""} placeholder="yourname" required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-700">Bio</label>
            <TextArea name="bio" rows={3} defaultValue={profile?.bio ?? ""} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-700">WhatsApp number</label>
            <Input name="whatsappNumber" defaultValue={profile?.whatsapp_number ?? ""} placeholder="2348012345678" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-700">WhatsApp prefilled message</label>
            <TextArea name="whatsappPrefill" rows={2} defaultValue={profile?.whatsapp_prefill ?? "Hello, I found your page on Byroo and I want to inquire."} />
          </div>
          <Button type="submit">Save profile</Button>
        </form>
      </Card>
    </div>
  );
}
