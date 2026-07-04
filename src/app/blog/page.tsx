import { Badge, ButtonLink, Card } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";

export default function BlogPage() {
  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text-strong)] font-sans">
      <header className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 flex items-center justify-between">
        <BrandLogo />
        <ButtonLink href="/login" variant="ghost" size="sm">Log in</ButtonLink>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-16 md:px-8">
        <div className="text-center mb-16">
          <Badge tone="brand">Blog</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Byroo Insights</h1>
          <p className="mt-4 text-lg text-[var(--text-soft)] max-w-2xl mx-auto">
            Tips, stories, and strategies to help you grow your business and convert more profile visitors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Post 1 */}
          <Card className="flex flex-col p-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-[var(--border-subtle)] group">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" alt="Blog Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Growth</p>
              <h2 className="text-xl font-semibold mb-3">Why Every Freelancer Needs a Link in Bio</h2>
              <p className="text-[var(--text-soft)] text-sm leading-relaxed mb-6 flex-1">Stop sending clients to a messy PDF portfolio. Learn why a centralized digital hub is the fastest way to build authority.</p>
              <div className="text-sm font-medium text-indigo-600 group-hover:underline">Read article &rarr;</div>
            </div>
          </Card>

          {/* Post 2 */}
          <Card className="flex flex-col p-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-[var(--border-subtle)] group">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80" alt="Blog Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Sales</p>
              <h2 className="text-xl font-semibold mb-3">How to Use WhatsApp to Close More Deals</h2>
              <p className="text-[var(--text-soft)] text-sm leading-relaxed mb-6 flex-1">Email is slow. Discover how routing your profile traffic directly into WhatsApp can double your conversion rate.</p>
              <div className="text-sm font-medium text-indigo-600 group-hover:underline">Read article &rarr;</div>
            </div>
          </Card>

          {/* Post 3 */}
          <Card className="flex flex-col p-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-[var(--border-subtle)] group">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Blog Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Design</p>
              <h2 className="text-xl font-semibold mb-3">The Anatomy of a High-Converting Portfolio</h2>
              <p className="text-[var(--text-soft)] text-sm leading-relaxed mb-6 flex-1">You don't need 50 case studies. See the exact 3-step portfolio structure that top creatives use to secure bookings.</p>
              <div className="text-sm font-medium text-indigo-600 group-hover:underline">Read article &rarr;</div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
