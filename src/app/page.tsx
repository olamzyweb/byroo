import Link from "next/link";
import { Card } from "@/components/ui";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 md:px-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900">
          Byroo
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">
            Pricing
          </Link>
          <Link href="/login" className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">
            Login
          </Link>
        </div>
      </header>

      <section className="grid flex-1 items-center gap-8 py-16 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Your business space online</p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            One link for your work, services, and contact.
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
            Byroo helps freelancers and creators publish a polished page at <span className="font-semibold">byroo.space/username</span>.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500">
              Create your space
            </Link>
            <Link href="/pricing" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              View pricing
            </Link>
          </div>
        </div>

        <Card className="space-y-3 bg-white/90">
          <p className="text-sm font-semibold text-slate-900">MVP Features</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Public profile by username</li>
            <li>Links, services, portfolio blocks</li>
            <li>WhatsApp action support</li>
            <li>Free and Pro plans with limits</li>
            <li>Analytics for profile views and clicks</li>
          </ul>
        </Card>
      </section>
    </main>
  );
}
