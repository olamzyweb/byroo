import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/config";
import { SubmitButton } from "@/components/submit-button";
import { Card, HelperText, Input } from "@/components/ui";

async function resetAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.appUrl}/login`,
  });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/reset-password?message=Password reset email sent.");
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-10">
      <Card className="w-full">
        <BrandLogo />
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">Reset password</p>
        <h1 className="mt-2 text-2xl font-semibold">Recover access</h1>
        <p className="mt-1 text-sm text-[var(--text-soft)]">We will send a reset link to your email.</p>

        <div className="mt-4 space-y-2">
          {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
          {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}
        </div>

        <form action={resetAction} className="mt-4 space-y-3">
          <Input name="email" type="email" placeholder="Email" required />
          <SubmitButton className="w-full" pendingText="Sending...">
            Send reset link
          </SubmitButton>
        </form>

        <p className="mt-4 text-sm text-[var(--text-soft)]">
          Back to <Link href="/login" className="text-[var(--brand-600)]">Login</Link>
        </p>
      </Card>
    </main>
  );
}
