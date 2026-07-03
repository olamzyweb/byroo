import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import { HelperText, Input } from "@/components/ui";
import { CheckCircle2, Layout, Zap, LineChart } from "lucide-react";
import { TypingEffect } from "@/components/typing-effect";

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
    <main className="min-h-screen w-full flex bg-white font-sans">
      
      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32">
        <div className="w-full max-w-[420px] mx-auto">
          <Link href="/" className="inline-block mb-10 hover:opacity-80 transition-opacity">
            <BrandLogo className="h-10 md:h-12" />
          </Link>
          
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Join Byroo</p>
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
              Create your space
            </h1>
            <p className="mt-3 text-base text-[var(--text-soft)]">
              Publish a premium, high-converting profile page in minutes.
            </p>
          </div>

          <div className="mb-6 space-y-3">
            {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
            {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}
          </div>

          <form action={signupAction} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email address</label>
              <Input name="email" type="email" placeholder="name@company.com" required className="h-12" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input name="password" type="password" placeholder="Create a secure password" minLength={6} required className="h-12" />
              <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters long.</p>
            </div>
            
            <SubmitButton className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors mt-2 shadow-md shadow-indigo-600/20" pendingText="Creating account...">
              Create my account
            </SubmitButton>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--text-soft)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
              Log in instead
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
