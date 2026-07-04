import { Badge, ButtonLink } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";

export default function TermsOfServicePage() {
  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text-strong)] font-sans">
      <header className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 flex items-center justify-between">
        <BrandLogo />
        <ButtonLink href="/login" variant="ghost" size="sm">Log in</ButtonLink>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-16 md:px-8">
        <Badge tone="brand">Legal</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)] mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <article className="prose prose-slate max-w-none text-[var(--text-soft)]">
          <p className="text-base leading-relaxed mb-6">
            Welcome to Byroo. These Terms of Service govern your use of our website byroo.digital and the services we provide. By accessing or using our platform, you agree to be bound by these terms.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-strong)] mt-8 mb-4">1. Account Registration</h2>
          <p className="text-base leading-relaxed mb-6">
            You must register for an account to use most features of Byroo. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree not to claim reserved system routes as your username.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-strong)] mt-8 mb-4">2. Acceptable Use</h2>
          <p className="text-base leading-relaxed mb-6">
            You agree to use Byroo only for lawful purposes. You may not use our platform to distribute spam, malware, or illegal content. We reserve the right to suspend or terminate accounts that violate these guidelines without prior notice.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-strong)] mt-8 mb-4">3. Subscriptions and Payments</h2>
          <p className="text-base leading-relaxed mb-6">
            Byroo offers premium features through paid subscriptions (Pro Plan). Payments are processed securely via Paystack. Subscriptions automatically renew unless canceled. You may cancel at any time from your dashboard, and you will retain access until the end of your billing cycle.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-strong)] mt-8 mb-4">4. Intellectual Property</h2>
          <p className="text-base leading-relaxed mb-6">
            The content, design, and infrastructure of Byroo are owned by us. You retain all rights to the text, images, and links you upload to your own profile.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-strong)] mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="text-base leading-relaxed mb-6">
            Byroo is provided "as is" without warranties of any kind. We are not liable for any lost profits, lost data, or business interruptions resulting from the use of our platform.
          </p>
        </article>
      </main>
    </div>
  );
}
