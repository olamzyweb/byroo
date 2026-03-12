import { addCatalogItemAction, deleteCatalogItemAction } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, EmptyState, HelperText, Input, SectionHeader, TextArea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("catalog_items")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <SectionHeader title="Catalog" subtitle="Manage products for your WhatsApp storefront." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card>
        <form action={addCatalogItemAction} className="grid gap-3" encType="multipart/form-data">
          <Input name="name" placeholder="Product name" required />
          <div className="grid gap-3 md:grid-cols-3">
            <Input name="price" placeholder="₦15,000" />
            <Input name="category" placeholder="Category" />
            <select name="availabilityStatus" className="h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm">
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <TextArea name="shortDescription" rows={2} placeholder="Short product description" />
          <div className="grid gap-3 md:grid-cols-3">
            <select name="ctaType" className="h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm">
              <option value="order_whatsapp">Order on WhatsApp</option>
              <option value="inquire_whatsapp">Inquire on WhatsApp</option>
            </select>
            <Input name="ctaText" defaultValue="Order on WhatsApp" placeholder="CTA text" />
            <Input type="file" name="image" accept="image/*" />
          </div>
          <TextArea name="whatsappPrefill" rows={2} placeholder="Hello, I found your store on Byroo and I want to order {item_name}." />
          <SubmitButton className="w-fit">
            Add catalog item
          </SubmitButton>
        </form>
      </Card>

      {(items ?? []).length === 0 ? (
        <EmptyState title="No catalog items yet" body="Add your first product so customers can order directly on WhatsApp." />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {(items ?? []).map((item) => (
          <Card key={item.id} className="space-y-2">
            {item.image_url ? <img src={item.image_url} alt={item.name} className="h-36 w-full rounded-xl object-cover" /> : null}
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{item.name}</h3>
              <Badge tone={item.availability_status === "available" ? "success" : "warning"}>{item.availability_status}</Badge>
            </div>
            {item.price ? <p className="text-sm font-medium">{item.price}</p> : null}
            {item.short_description ? <p className="text-sm text-[var(--text-soft)]">{item.short_description}</p> : null}
            <form action={deleteCatalogItemAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <SubmitButton variant="danger" size="sm">
                Delete
              </SubmitButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}



