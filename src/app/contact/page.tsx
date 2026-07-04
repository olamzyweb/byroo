import { Badge, ButtonLink, Card, SectionHeader } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";
import { Mail, MessageCircle, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text-strong)] font-sans">
      <header className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 flex items-center justify-between">
        <BrandLogo />
        <ButtonLink href="/login" variant="ghost" size="sm">Log in</ButtonLink>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-16 md:px-8">
        <div className="text-center mb-16">
          <Badge tone="brand">Get in Touch</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Contact Us</h1>
          <p className="mt-4 text-lg text-[var(--text-soft)] max-w-2xl mx-auto">
            Have a question, need technical support, or want to discuss a custom enterprise plan? We are here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center flex flex-col items-center py-10 shadow-sm border border-[var(--border-subtle)]">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold">Email Support</h3>
            <p className="mt-2 text-sm text-[var(--text-soft)] mb-4">For general inquiries and technical assistance.</p>
            <a href="mailto:byroo.digital@gmail.com" className="text-indigo-600 font-medium hover:underline">byroo.digital@gmail.com</a>
          </Card>

          <Card className="text-center flex flex-col items-center py-10 shadow-sm border border-[var(--border-subtle)] bg-gradient-to-b from-[#FAFAFA] to-white">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">WhatsApp Support</h3>
            <p className="mt-2 text-sm text-[var(--text-soft)] mb-4">Get faster responses via our official WhatsApp line.</p>
            <a href="https://wa.me/2348165621984" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline">Message us on WhatsApp</a>
          </Card>

          <Card className="text-center flex flex-col items-center py-10 shadow-sm border border-[var(--border-subtle)]">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold">Headquarters</h3>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Lagos, Nigeria.<br />
              Operating globally.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
