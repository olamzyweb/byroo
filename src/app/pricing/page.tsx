import { Badge, ButtonLink, Card } from "@/components/ui";
import { PLAN_CONFIG } from "@/lib/plans";

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-10 md:px-8">
      <div className="text-center">
        <Badge tone="brand">Pricing</Badge>
        <h1 className="mt-3 text-4xl font-semibold">Simple plans for creators</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)]">Start free and unlock growth features with Pro.</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Free</p>
          <p className="mt-2 text-3xl font-semibold">₦0</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--text-soft)]">
            <li>Up to {PLAN_CONFIG.free.maxLinks} links</li>
            <li>Up to {PLAN_CONFIG.free.maxPortfolioItems} portfolio items</li>
            <li>Basic theme</li>
            <li>Byroo branding</li>
          </ul>
        </Card>

        <Card accent>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--brand-600)]">Pro</p>
          <p className="mt-2 text-3xl font-semibold">₦{PLAN_CONFIG.pro.priceMonthly}<span className="text-sm text-[var(--text-soft)]">/month</span></p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--text-soft)]">
            <li>Unlimited links and portfolio</li>
            <li>Premium themes</li>
            <li>Analytics dashboard</li>
            <li>Remove Byroo branding</li>
          </ul>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <ButtonLink href="/signup" size="lg">
          Create your space
        </ButtonLink>
      </div>
    </main>
  );
}
