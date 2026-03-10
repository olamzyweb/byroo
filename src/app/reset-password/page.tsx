import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/config";
import { Button, Card, Input } from "@/components/ui";

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
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
      <Card className="w-full space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reset password</h1>
          <p className="mt-1 text-sm text-slate-600">We will email a reset link to you.</p>
        </div>

        {params.error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{params.error}</p> : null}
        {params.message ? <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">{params.message}</p> : null}

        <form action={resetAction} className="space-y-3">
          <Input name="email" type="email" placeholder="Email" required />
          <Button type="submit" className="w-full justify-center">
            Send reset link
          </Button>
        </form>

        <p className="text-sm text-slate-600">
          Back to <Link href="/login" className="font-medium text-sky-700">login</Link>.
        </p>
      </Card>
    </main>
  );
}
