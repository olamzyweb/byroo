import { Badge, ButtonLink, Card } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";
import { BookOpen, TrendingUp, Zap } from "lucide-react";

export default function GuidesPage() {
  const guides = [
    {
      title: "The Perfect Bio Formula",
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
      description: "How to write a bio that builds instant trust and drives clicks to your links.",
    },
    {
      title: "Converting Traffic to Sales",
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      description: "Step-by-step strategies for pushing your Instagram followers to your Byroo WhatsApp button.",
    },
    {
      title: "Optimizing Your Portfolio",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      description: "Learn what types of images and descriptions generate the most client inquiries.",
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
          <Badge tone="brand">Guides</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Growth Guides</h1>
          <p className="mt-4 text-lg text-[var(--text-soft)] max-w-2xl mx-auto">
            Actionable playbooks designed to help you get the most out of your Byroo space.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {guides.map((guide, idx) => (
            <Card key={idx} className="flex flex-col p-8 hover:shadow-md transition-shadow cursor-pointer border border-[var(--border-subtle)]">
              <div className="bg-slate-50 p-3 rounded-full w-fit mb-6 border border-slate-100">
                {guide.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{guide.title}</h3>
              <p className="text-sm text-[var(--text-soft)] leading-relaxed mb-6 flex-1">
                {guide.description}
              </p>
              <div className="text-sm font-medium text-indigo-600 hover:underline mt-auto">
                Read guide &rarr;
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
