import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import { HelperText, Input } from "@/components/ui";
import { TypingEffect } from "@/components/typing-effect";

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
    <main className="min-h-screen w-full flex bg-white font-sans">
      
      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32">
        <div className="w-full max-w-[420px] mx-auto">
          <Link href="/" className="inline-block mb-10 hover:opacity-80 transition-opacity">
            <BrandLogo className="h-10 md:h-12" />
          </Link>
          
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)] mb-2">Welcome back</p>
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
              Log in to your space
            </h1>
            <p className="mt-3 text-base text-[var(--text-soft)]">
              Manage your profile, links, and clients securely.
            </p>
          </div>

          <div className="mb-6 space-y-3">
            {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
            {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}
          </div>

          <form action={loginAction} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email address</label>
              <Input name="email" type="email" placeholder="name@company.com" required className="h-12" />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link href="/reset-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input name="password" type="password" placeholder="••••••••" minLength={6} required className="h-12" />
            </div>
            
            <SubmitButton className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors mt-2 shadow-md shadow-slate-900/10" pendingText="Logging in...">
              Sign in to dashboard
            </SubmitButton>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--text-soft)]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Create your space
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column - Premium Minimalist Vibe (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        {/* Professional Subtle Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} 
        />
        
        {/* Sleek Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none" />
        
        <div className="relative z-10 max-w-lg w-full">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
              <BrandLogo className="h-8 grayscale brightness-200" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-medium text-white tracking-tight leading-snug">
              The professional infrastructure for your digital presence.
            </h2>
            
            <TypingEffect 
              text="Everything you need to showcase your work, capture leads, and scale your business all from a single, powerful link."
              className="text-slate-400 text-lg leading-relaxed h-20"
            />
          </div>
        </div>
      </div>

    </main>
  );
}
