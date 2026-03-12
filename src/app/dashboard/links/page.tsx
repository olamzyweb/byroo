import {
  addLinkAction,
  deleteLinkAction,
  reorderLinkAction,
  toggleLinkVisibilityAction,
} from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, EmptyState, HelperText, Input, SectionHeader } from "@/components/ui";
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
      <SectionHeader title="Links" subtitle="Add and arrange action links on your public page." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card>
        <form action={addLinkAction} className="grid gap-3 md:grid-cols-[1fr_1.2fr_170px_auto]">
          <Input name="title" placeholder="Instagram" required />
          <Input name="url" placeholder="https://instagram.com/..." required />
          <select name="type" className="h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm">
            <option value="website">Website</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="email">Email</option>
            <option value="github">GitHub</option>
            <option value="linkedin">LinkedIn</option>
            <option value="booking">Booking</option>
            <option value="other">Other</option>
          </select>
          <SubmitButton>Add link</SubmitButton>
        </form>
      </Card>

      {(links ?? []).length === 0 ? (
        <EmptyState title="No links yet" body="Add your first link to start converting profile visitors." />
      ) : null}

      <div className="space-y-3">
        {(links ?? []).map((link) => (
          <Card key={link.id} className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="select-none pt-1 text-[var(--text-soft)]">??</span>
              <div>
                <p className="text-sm font-semibold text-[var(--text-strong)]">{link.title}</p>
                <p className="text-xs text-[var(--text-soft)]">{link.url}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={link.is_active ? "success" : "neutral"}>{link.is_active ? "Visible" : "Hidden"}</Badge>
              <form action={toggleLinkVisibilityAction}>
                <input type="hidden" name="linkId" value={link.id} />
                <input type="hidden" name="nextValue" value={String(!link.is_active)} />
                <SubmitButton variant="secondary" size="sm">
                  {link.is_active ? "Hide" : "Show"}
                </SubmitButton>
              </form>
              <form action={reorderLinkAction}>
                <input type="hidden" name="linkId" value={link.id} />
                <input type="hidden" name="direction" value="up" />
                <SubmitButton variant="ghost" size="sm">
                  Up
                </SubmitButton>
              </form>
              <form action={reorderLinkAction}>
                <input type="hidden" name="linkId" value={link.id} />
                <input type="hidden" name="direction" value="down" />
                <SubmitButton variant="ghost" size="sm">
                  Down
                </SubmitButton>
              </form>
              <form action={deleteLinkAction}>
                <input type="hidden" name="linkId" value={link.id} />
                <SubmitButton variant="danger" size="sm">
                  Delete
                </SubmitButton>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}



