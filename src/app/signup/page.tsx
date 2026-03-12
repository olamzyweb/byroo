import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import { Card, HelperText, Input } from "@/components/ui";

async function signupAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Account created. Please log in.");
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-10">
      <Card className="w-full">
        <BrandLogo />
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">Create account</p>
        <h1 className="mt-2 text-2xl font-semibold">Create your Byroo space</h1>
        <p className="mt-1 text-sm text-[var(--text-soft)]">Publish a premium profile page in minutes.</p>

        <div className="mt-4 space-y-2">
          {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
          {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}
        </div>

        <form action={signupAction} className="mt-4 space-y-3">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" minLength={6} required />
          <SubmitButton className="w-full" pendingText="Creating account...">
            Create account
          </SubmitButton>
        </form>

        <p className="mt-4 text-sm text-[var(--text-soft)]">
          Already have an account? <Link href="/login" className="font-medium text-[var(--brand-600)]">Log in</Link>
        </p>
      </Card>
    </main>
  );
}
