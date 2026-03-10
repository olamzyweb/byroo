import { addLinkAction, deleteLinkAction, reorderLinkAction } from "@/app/dashboard/actions";
import { Button, Card, Input, SectionTitle } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <SectionTitle title="Links" subtitle="Add action links shown on your public page." />
      {params.error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{params.error}</p> : null}
      {params.message ? <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">{params.message}</p> : null}

      <Card>
        <form action={addLinkAction} className="grid gap-3 md:grid-cols-4">
          <Input name="title" placeholder="Instagram" required />
          <Input name="url" placeholder="https://instagram.com/..." required />
          <select name="type" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="website">Website</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="email">Email</option>
            <option value="github">GitHub</option>
            <option value="linkedin">LinkedIn</option>
            <option value="booking">Booking</option>
            <option value="other">Other</option>
          </select>
          <Button type="submit">Add link</Button>
        </form>
      </Card>

      <div className="space-y-3">
        {(links ?? []).length === 0 ? <Card>No links yet.</Card> : null}
        {(links ?? []).map((link) => (
          <Card key={link.id} className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-slate-900">{link.title}</p>
              <p className="text-sm text-slate-600">{link.url}</p>
            </div>
            <div className="flex gap-2">
              <form action={reorderLinkAction}>
                <input type="hidden" name="linkId" value={link.id} />
                <input type="hidden" name="direction" value="up" />
                <Button type="submit" variant="secondary">
                  Up
                </Button>
              </form>
              <form action={reorderLinkAction}>
                <input type="hidden" name="linkId" value={link.id} />
                <input type="hidden" name="direction" value="down" />
                <Button type="submit" variant="secondary">
                  Down
                </Button>
              </form>
              <form action={deleteLinkAction}>
                <input type="hidden" name="linkId" value={link.id} />
                <Button type="submit" variant="danger">
                  Delete
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
