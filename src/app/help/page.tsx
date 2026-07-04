import { Badge, ButtonLink, Card } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";
import { Book, LifeBuoy, Zap, CreditCard } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  const categories = [
    {
      title: "Getting Started",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      description: "Learn how to claim your username, set up your profile, and add your first links.",
    },
    {
      title: "Billing & Subscriptions",
      icon: <CreditCard className="w-5 h-5 text-indigo-500" />,
      description: "Manage your Pro plan, understand Paystack billing, and view transaction history.",
    },
    {
      title: "Profile Customization",
      icon: <Book className="w-5 h-5 text-emerald-500" />,
      description: "How to use themes, add portfolio items, and configure the Verified Vendor Badge.",
    },
    {
      title: "Troubleshooting",
      icon: <LifeBuoy className="w-5 h-5 text-rose-500" />,
      description: "Fix common issues with link previews, social proof syncing, and analytics.",
    }
  ];

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text-strong)] font-sans">
      <header className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 flex items-center justify-between">
        <BrandLogo />
        <ButtonLink href="/login" variant="ghost" size="sm">Log in</ButtonLink>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-16 md:px-8">
        <div className="text-center mb-16">
          <Badge tone="brand">Help Center</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">How can we help?</h1>
          <p className="mt-4 text-lg text-[var(--text-soft)] max-w-2xl mx-auto">
            Browse our knowledge base or reach out to support if you cannot find what you are looking for.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <Card key={idx} className="flex gap-4 p-6 hover:shadow-md transition-shadow cursor-pointer border border-[var(--border-subtle)]">
              <div className="mt-1 bg-slate-50 p-3 rounded-full h-fit border border-slate-100">
                {cat.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{cat.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-soft)] leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-4 text-sm font-medium text-indigo-600 hover:underline">
                  View articles &rarr;
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-[#FAFAFA] rounded-3xl p-8 md:p-12 text-center border border-[var(--border-subtle)]">
          <h2 className="text-2xl font-semibold mb-3">Still need help?</h2>
          <p className="text-[var(--text-soft)] mb-8 max-w-lg mx-auto">Our support team is available Monday through Friday to assist you with any technical issues or billing questions.</p>
          <ButtonLink href="/contact" size="lg">Contact Support</ButtonLink>
        </div>
      </main>
    </div>
  );
}
