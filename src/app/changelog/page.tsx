import { Badge, ButtonLink, Card } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";

export default function ChangelogPage() {
  const updates = [
    {
      version: "v1.2.0",
      date: "July 2026",
      title: "Real-Time Transaction History & Enhanced Billing",
      description: "We just rolled out a massive update to our billing infrastructure to give you more transparency and security.",
      features: [
        "Added real-time Transaction History to the Pro dashboard directly synced with Paystack.",
        "Implemented a 48-hour leniency grace period for failed subscription renewals.",
        "Introduced the 30-Day VIP Pass system for manual admin upgrades.",
        "Fixed a bug where cancelling a subscription incorrectly wiped out the active expiration date."
      ]
    },
    {
      version: "v1.1.0",
      date: "June 2026",
      title: "System Security & UI Overhaul",
      description: "A series of critical security patches and a massive upgrade to our mobile user experience.",
      features: [
        "Launched the new Mobile Slide-Over Sidebar for effortless dashboard navigation on phones.",
        "Added the dynamic Particle Swarm constellation background to the landing page.",
        "Implemented the Reserved Username Blocklist to prevent hijacking of system routes.",
        "Upgraded landing page social proof with premium, high-converting imagery."
      ]
    },
    {
      version: "v1.0.0",
      date: "May 2026",
      title: "Byroo Initial Launch 🚀",
      description: "The professional infrastructure for your digital presence is officially live.",
      features: [
        "Claim your custom byroo.digital/username.",
        "Add unlimited links, portfolio items, and services (Pro).",
        "Integration with WhatsApp for instant client messaging.",
        "Verified Vendor Badge system to build immediate trust with buyers."
      ]
    }
  ];

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text-strong)] font-sans">
      <header className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 flex items-center justify-between">
        <BrandLogo />
        <ButtonLink href="/login" variant="ghost" size="sm">Log in</ButtonLink>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-16 md:px-8">
        <div className="mb-16">
          <Badge tone="brand">Changelog</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Product Updates</h1>
          <p className="mt-4 text-lg text-[var(--text-soft)]">
            New features, fixes, and improvements to help you grow your business.
          </p>
        </div>

        <div className="space-y-16 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {updates.map((update, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-indigo-500 absolute left-0 md:left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 shadow-sm" />
              
              <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-6 md:p-8 hover:shadow-md transition-shadow border border-[var(--border-subtle)] relative ml-auto md:ml-0">
                <div className="flex items-center gap-3 mb-4">
                  <Badge tone="brand">{update.version}</Badge>
                  <span className="text-sm font-medium text-[var(--text-soft)]">{update.date}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{update.title}</h3>
                <p className="text-[var(--text-soft)] leading-relaxed text-sm md:text-base">
                  {update.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center border-t border-[var(--border-subtle)] pt-12">
          <h2 className="text-2xl font-semibold mb-4">Want to see these features in action?</h2>
          <ButtonLink href="/signup" size="lg">Create your free profile</ButtonLink>
        </div>
      </main>
    </div>
  );
}
