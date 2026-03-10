import Link from "next/link";
import { PLAN_CONFIG } from "@/lib/plans";
import { Card } from "@/components/ui";

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10 md:px-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Simple pricing</h1>
        <p className="mt-2 text-slate-600">Start free and upgrade when your business grows.</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold text-slate-900">{PLAN_CONFIG.free.label}</h2>
          <p className="mt-1 text-2xl font-bold">$0<span className="text-base font-medium text-slate-500">/month</span></p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Up to 5 links</li>
            <li>Up to 3 portfolio items</li>
            <li>1 basic theme</li>
            <li>Byroo branding</li>
          </ul>
        </Card>

        <Card className="border-sky-300">
          <h2 className="text-xl font-semibold text-slate-900">{PLAN_CONFIG.pro.label}</h2>
          <p className="mt-1 text-2xl font-bold">${PLAN_CONFIG.pro.priceMonthly}<span className="text-base font-medium text-slate-500">/month</span></p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Unlimited links</li>
            <li>Unlimited portfolio items</li>
            <li>All themes</li>
            <li>Analytics + remove branding</li>
          </ul>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link href="/signup" className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500">
          Create your space
        </Link>
      </div>
    </main>
  );
}
