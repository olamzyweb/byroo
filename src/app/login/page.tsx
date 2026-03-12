import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import { Card, HelperText, Input } from "@/components/ui";

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-10">
      <Card className="w-full">
        <BrandLogo />
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">Welcome back</p>
        <h1 className="mt-2 text-2xl font-semibold">Log in to Byroo</h1>
        <p className="mt-1 text-sm text-[var(--text-soft)]">Manage your profile, links, and clients.</p>

        <div className="mt-4 space-y-2">
          {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
          {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}
        </div>

        <form action={loginAction} className="mt-4 space-y-3">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" minLength={6} required />
          <SubmitButton className="w-full" pendingText="Logging in...">
            Log in
          </SubmitButton>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/reset-password" className="text-[var(--brand-600)]">
            Forgot password?
          </Link>
          <Link href="/signup" className="text-[var(--brand-600)]">
            Create account
          </Link>
        </div>
      </Card>
    </main>
  );
}
