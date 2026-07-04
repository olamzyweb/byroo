import { Badge, ButtonLink, Card } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";
import { Users } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text-strong)] font-sans">
      <header className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 flex items-center justify-between">
        <BrandLogo />
        <ButtonLink href="/login" variant="ghost" size="sm">Log in</ButtonLink>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-16 md:px-8">
        <div className="text-center mb-16">
          <Badge tone="brand">Community</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Join the Byroo Network</h1>
          <p className="mt-4 text-lg text-[var(--text-soft)] max-w-2xl mx-auto">
            Connect with thousands of other professionals, share your links, and collaborate on growth strategies.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-12 border-2 border-indigo-50 shadow-md">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Official Discord Server</h2>
            <p className="text-[var(--text-soft)] mb-8">
              Our community hub is launching very soon! You will be able to join channels specific to your industry, get early access to new features, and network directly with our team.
            </p>
            <ButtonLink href="/signup" size="lg" className="w-full justify-center">Get Early Access</ButtonLink>
          </Card>
        </div>
      </main>
    </div>
  );
}
