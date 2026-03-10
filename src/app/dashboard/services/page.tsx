import { addServiceAction, deleteServiceAction } from "@/app/dashboard/actions";
import { Button, Card, Input, SectionTitle, TextArea } from "@/components/ui";
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
      <SectionTitle title="Services" subtitle="List services and inquiry actions." />
      {params.error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{params.error}</p> : null}
      {params.message ? <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">{params.message}</p> : null}

      <Card>
        <form action={addServiceAction} className="grid gap-3">
          <Input name="name" placeholder="Website Design" required />
          <TextArea name="description" rows={3} placeholder="What this service includes" />
          <Input name="startingPrice" placeholder="$500" />
          <Input name="ctaText" defaultValue="Contact me" />
          <Input name="ctaUrl" placeholder="https://wa.me/234..." />
          <Button type="submit" className="w-fit">
            Add service
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        {(services ?? []).length === 0 ? <Card>No services yet.</Card> : null}
        {(services ?? []).map((service) => (
          <Card key={service.id} className="space-y-2">
            <h3 className="font-semibold text-slate-900">{service.name}</h3>
            {service.description ? <p className="text-sm text-slate-600">{service.description}</p> : null}
            {service.starting_price ? <p className="text-sm font-medium text-slate-700">From {service.starting_price}</p> : null}
            <form action={deleteServiceAction}>
              <input type="hidden" name="serviceId" value={service.id} />
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
