import { addPortfolioAction, deletePortfolioAction } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, EmptyState, HelperText, Input, SectionHeader, TextArea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <SectionHeader title="Portfolio" subtitle="Showcase your work with links and visuals." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card>
        <form action={addPortfolioAction} className="grid gap-3" encType="multipart/form-data">
          <Input name="title" placeholder="Project title" required />
          <TextArea name="description" rows={3} placeholder="What did you build?" />
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="externalUrl" placeholder="https://project-link.com" />
            <Input type="file" name="image" accept="image/*" />
          </div>
          <SubmitButton className="w-fit">
            Add portfolio item
          </SubmitButton>
        </form>
      </Card>

      {(items ?? []).length === 0 ? (
        <EmptyState title="No portfolio yet" body="Add your first project to build trust with visitors." />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {(items ?? []).map((item) => (
          <Card key={item.id} className="space-y-2">
            {item.image_url ? <img src={item.image_url} alt={item.title} className="h-40 w-full rounded-xl object-cover" /> : null}
            <h3 className="text-sm font-semibold text-[var(--text-strong)]">{item.title}</h3>
            {item.description ? <p className="text-sm text-[var(--text-soft)]">{item.description}</p> : null}
            <div className="flex items-center justify-between">
              {item.external_url ? (
                <a className="text-sm font-medium text-[var(--brand-600)]" href={item.external_url} target="_blank" rel="noreferrer">
                  Visit project
                </a>
              ) : <span />}
              <form action={deletePortfolioAction}>
                <input type="hidden" name="itemId" value={item.id} />
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



