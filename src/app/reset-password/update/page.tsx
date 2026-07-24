import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import { Card, HelperText, Input } from "@/components/ui";

async function updateAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

  if (password.length < 6) {
    redirect(`/reset-password/update?error=${encodeURIComponent("Password must be at least 6 characters.")}`);
  }

  if (password !== confirmPassword) {
    redirect(`/reset-password/update?error=${encodeURIComponent("Passwords do not match.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password/update?error=${encodeURIComponent(error.message)}`);
  }

  // Trigger security notification email
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    try {
      const { enqueueEmail } = await import("@/lib/email/queue");
      await enqueueEmail(
        user.email ?? "",
        "password-changed",
        {
          name: user.user_metadata?.full_name || "Byroo User",
          changeTime: new Date().toUTCString(),
        },
        { userId: user.id }
      );
    } catch (e) {
      console.warn("Failed to trigger password changed email:", e);
    }
  }

  redirect("/login?message=Password updated successfully. Please log in.");
}

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-10">
      <Card className="w-full">
        <BrandLogo />
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">Change password</p>
        <h1 className="mt-2 text-2xl font-semibold">Set new password</h1>
        <p className="mt-1 text-sm text-[var(--text-soft)]">Please enter a secure new password for your account.</p>

        <div className="mt-4 space-y-2">
          {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
        </div>

        <form action={updateAction} className="mt-4 space-y-3">
          <Input
            name="password"
            type="password"
            placeholder="New Password"
            minLength={6}
            required
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            minLength={6}
            required
          />
          <SubmitButton className="w-full" pendingText="Saving...">
            Update password
          </SubmitButton>
        </form>
      </Card>
    </main>
  );
}
