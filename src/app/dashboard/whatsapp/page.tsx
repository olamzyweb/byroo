import { saveWhatsAppSettingsAction } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, HelperText, Input, SectionHeader, TextArea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function WhatsAppPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("whatsapp_number, whatsapp_prefill")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <SectionHeader title="WhatsApp Settings" subtitle="Set your global order/inquiry channel and default message." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card>
        <form action={saveWhatsAppSettingsAction} className="space-y-3">
          <Input name="whatsappNumber" defaultValue={profile?.whatsapp_number ?? ""} placeholder="2348012345678" />
          <TextArea
            name="whatsappPrefill"
            rows={3}
            defaultValue={profile?.whatsapp_prefill ?? "Hello, I found your store on Byroo and I want to place an order."}
            placeholder="Default prefilled message"
          />
          <p className="text-xs text-[var(--text-soft)]">
            Tip: item-specific and service-specific messages can override this default.
          </p>
          <SubmitButton>Save WhatsApp settings</SubmitButton>
        </form>
      </Card>
    </div>
  );
}



