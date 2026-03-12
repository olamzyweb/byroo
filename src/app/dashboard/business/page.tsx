import { saveBusinessInfoAction } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, HelperText, Input, SectionHeader, TextArea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function BusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_location, google_maps_url, delivery_info, opening_hours, nationwide_delivery, in_store_pickup")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <SectionHeader title="Business Info" subtitle="Add trust details customers need before contacting you." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card>
        <form action={saveBusinessInfoAction} className="space-y-3">
          <Input name="businessLocation" defaultValue={profile?.business_location ?? ""} placeholder="Lekki, Lagos" />
          <Input name="googleMapsUrl" defaultValue={profile?.google_maps_url ?? ""} placeholder="Google Maps link" />
          <TextArea name="deliveryInfo" rows={2} defaultValue={profile?.delivery_info ?? ""} placeholder="Delivery timelines and areas" />
          <TextArea name="openingHours" rows={2} defaultValue={profile?.opening_hours ?? ""} placeholder="Mon-Sat: 9am - 7pm" />

          <label className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
            <input type="checkbox" name="nationwideDelivery" defaultChecked={Boolean(profile?.nationwide_delivery)} />
            Nationwide delivery
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
            <input type="checkbox" name="inStorePickup" defaultChecked={Boolean(profile?.in_store_pickup)} />
            In-store pickup
          </label>

          <SubmitButton>Save business info</SubmitButton>
        </form>
      </Card>
    </div>
  );
}



