import { Badge, ButtonLink } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text-strong)] font-sans">
      <header className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 flex items-center justify-between">
        <BrandLogo />
        <ButtonLink href="/login" variant="ghost" size="sm">Log in</ButtonLink>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-16 md:px-8">
        <Badge tone="brand">Legal</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)] mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <article className="prose prose-slate max-w-none text-[var(--text-soft)]">
          <p className="text-base leading-relaxed mb-6">
            At Byroo, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website byroo.digital and use our services.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-strong)] mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-base leading-relaxed mb-6">
            We collect information that you provide directly to us when you register for an account, create a profile, or contact customer support. This may include your name, email address, WhatsApp number, and billing information.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-strong)] mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-base leading-relaxed mb-6">
            We use the information we collect to operate and maintain your profile, process your transactions (via Paystack), analyze platform usage to improve our service, and communicate with you about updates or support requests.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-strong)] mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-base leading-relaxed mb-6">
            We do not sell or rent your personal information to third parties. We may share your information with trusted third-party service providers (such as hosting partners and payment processors) solely to facilitate our services.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-strong)] mt-8 mb-4">4. Data Security</h2>
          <p className="text-base leading-relaxed mb-6">
            We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-semibold text-[var(--text-strong)] mt-8 mb-4">5. Contact Us</h2>
          <p className="text-base leading-relaxed mb-6">
            If you have any questions about this Privacy Policy, please contact us at byroo.digital@gmail.com.
          </p>
        </article>
      </main>
    </div>
  );
}
