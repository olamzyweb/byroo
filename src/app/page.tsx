import { Badge, ButtonLink, Card } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";

const features = [
  {
    title: "Build one smart link",
    body: "Create a page for your links, portfolio, and services in minutes.",
  },
  {
    title: "Designed for trust",
    body: "Polished mobile-first pages that look credible to clients.",
  },
  {
    title: "Convert profile visits",
    body: "Use WhatsApp and action links to turn visitors into conversations.",
  },
];

const steps = [
  "Sign up and claim your username",
  "Add links, services, and portfolio",
  "Share byroo.digital/username anywhere",
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-6 md:px-8 md:py-8">
      <header className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-soft)]">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <ButtonLink href="/pricing" variant="ghost" size="sm">
            Pricing
          </ButtonLink>
          <ButtonLink href="/login" size="sm">
            Login
          </ButtonLink>
        </div>
      </header>

      <section className="grid gap-6 pb-12 pt-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <Badge tone="brand">Your business deserves its own space online.</Badge>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-[var(--text-strong)] md:text-5xl">
            One link for your work, services, and contact.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-soft)]">
            Byroo helps freelancers, creators, and small businesses launch a premium public page at <span className="font-semibold">byroo.digital/username</span>.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/signup" size="lg">
              Create your space
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary" size="lg">
              View plans
            </ButtonLink>
          </div>
        </div>

        <Card className="p-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-[var(--brand-200)]" />
              <div>
                <p className="text-sm font-semibold">Maya Creative Studio</p>
                <p className="text-xs text-[var(--text-soft)]">Brand designer and creative partner</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {["Book a strategy call", "View portfolio", "Instagram", "WhatsApp"].map((label) => (
                <div key={label} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-sm">
                  {label}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-[var(--text-soft)]">Live profile preview</p>
        </Card>
      </section>

      <section className="grid gap-4 pb-12 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <h2 className="text-base font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">{feature.body}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 pb-12 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">How it works</h2>
          <ol className="mt-4 space-y-2 text-sm text-[var(--text-soft)]">
            {steps.map((step, idx) => (
              <li key={step} className="rounded-lg bg-[var(--surface-muted)] px-3 py-2">
                {idx + 1}. {step}
              </li>
            ))}
          </ol>
        </Card>

        <Card accent>
          <h2 className="text-xl font-semibold">Simple pricing</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[var(--surface-muted)] p-3">
              <p className="text-sm font-medium">Free</p>
              <p className="mt-1 text-xs text-[var(--text-soft)]">5 links • 3 portfolio items</p>
            </div>
            <div className="rounded-xl bg-[var(--brand-50)] p-3">
              <p className="text-sm font-medium text-[var(--brand-700)]">Pro</p>
              <p className="mt-1 text-xs text-[var(--text-soft)]">Unlimited + analytics</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="rounded-3xl border border-[var(--brand-200)] bg-[var(--surface)] p-7 text-center shadow-[var(--shadow-soft)]">
        <h2 className="text-2xl font-semibold">Ready to create your Byroo page?</h2>
        <p className="mt-2 text-sm text-[var(--text-soft)]">Launch your profile in minutes and share one smart link everywhere.</p>
        <ButtonLink href="/signup" className="mt-5" size="lg">
          Create your space
        </ButtonLink>
      </section>

      <footer className="pb-6 pt-12 text-center text-xs text-[var(--text-soft)]">
        <div className="flex items-center justify-center gap-2">
          <BrandLogo className="h-5" />
          <span>Your business space online</span>
        </div>
      </footer>
    </main>
  );
}
