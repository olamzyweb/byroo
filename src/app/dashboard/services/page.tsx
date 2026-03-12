import { addServiceAction, deleteServiceAction } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, EmptyState, HelperText, Input, SectionHeader, TextArea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <SectionHeader title="Services / Price List" subtitle="Create a WhatsApp-first service menu for clients." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card>
        <form action={addServiceAction} className="grid gap-3">
          <Input name="name" placeholder="Bridal Makeup" required />
          <TextArea name="description" rows={3} placeholder="What this service includes" />
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="startingPrice" placeholder="From ₦35,000" />
            <select name="availabilityStatus" className="h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm">
              <option value="available">Available</option>
              <option value="limited">Limited slots</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Input name="ctaText" defaultValue="Inquire on WhatsApp" />
            <select name="ctaType" className="h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm">
              <option value="whatsapp">WhatsApp inquiry</option>
              <option value="external">External link</option>
            </select>
            <Input name="ctaUrl" placeholder="External URL (if selected)" />
          </div>
          <TextArea name="whatsappPrefill" rows={2} placeholder="Hello, I want to inquire about {service_name}." />
          <SubmitButton className="w-fit">
            Add service
          </SubmitButton>
        </form>
      </Card>

      {(services ?? []).length === 0 ? (
        <EmptyState title="No services yet" body="Add your first service and let customers inquire instantly on WhatsApp." />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {(services ?? []).map((service) => (
          <Card key={service.id} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[var(--text-strong)]">{service.name}</h3>
              <Badge tone={service.availability_status === "available" ? "success" : "warning"}>{service.availability_status}</Badge>
            </div>
            {service.description ? <p className="text-sm text-[var(--text-soft)]">{service.description}</p> : null}
            {service.starting_price ? <p className="text-sm font-medium">From {service.starting_price}</p> : null}
            <div className="flex items-center justify-end">
              <form action={deleteServiceAction}>
                <input type="hidden" name="serviceId" value={service.id} />
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



