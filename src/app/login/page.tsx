import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button, Card, Input } from "@/components/ui";

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
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
      <Card className="w-full space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">Log in to your Byroo dashboard.</p>
        </div>

        {params.error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{params.error}</p> : null}
        {params.message ? <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">{params.message}</p> : null}

        <form action={loginAction} className="space-y-3">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" minLength={6} required />
          <Button type="submit" className="w-full justify-center">
            Log in
          </Button>
        </form>

        <div className="text-sm text-slate-600">
          <Link href="/reset-password" className="font-medium text-sky-700">
            Forgot password?
          </Link>
        </div>

        <p className="text-sm text-slate-600">
          Need an account? <Link href="/signup" className="font-medium text-sky-700">Sign up</Link>
        </p>
      </Card>
    </main>
  );
}
