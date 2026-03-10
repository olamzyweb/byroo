import { addPortfolioAction, deletePortfolioAction } from "@/app/dashboard/actions";
import { Button, Card, Input, SectionTitle, TextArea } from "@/components/ui";
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
      <SectionTitle title="Portfolio" subtitle="Show your best work with images and links." />
      {params.error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{params.error}</p> : null}
      {params.message ? <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">{params.message}</p> : null}

      <Card>
        <form action={addPortfolioAction} className="grid gap-3" encType="multipart/form-data">
          <Input name="title" placeholder="Project title" required />
          <TextArea name="description" rows={3} placeholder="Short description" />
          <Input name="externalUrl" placeholder="https://project-link.com" />
          <Input type="file" name="image" accept="image/*" />
          <Button type="submit" className="w-fit">
            Add portfolio item
          </Button>
        </form>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {(items ?? []).length === 0 ? <Card>No portfolio items yet.</Card> : null}
        {(items ?? []).map((item) => (
          <Card key={item.id} className="space-y-2">
            {item.image_url ? <img src={item.image_url} alt={item.title} className="h-40 w-full rounded-xl object-cover" /> : null}
            <h3 className="font-semibold text-slate-900">{item.title}</h3>
            {item.description ? <p className="text-sm text-slate-600">{item.description}</p> : null}
            {item.external_url ? (
              <a className="text-sm font-medium text-sky-700" href={item.external_url} target="_blank" rel="noreferrer">
                Visit project
              </a>
            ) : null}
            <form action={deletePortfolioAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <Button type="submit" variant="danger">
                Delete
              </Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
