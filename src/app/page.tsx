"use client";

import { Badge, ButtonLink, Card, Avatar } from "@/components/ui";
import { BrandLogo } from "@/components/brand-logo";
import { motion, type Variants } from "framer-motion";
import { CheckCircle2, MessageCircle, ArrowRight, Check, Star } from "lucide-react";

const heroStats = [
  { label: "Profiles launched", value: "18k+" },
  { label: "Avg. conversion lift", value: "32%" },
  { label: "Minutes to publish", value: "4" },
];

const featureHighlights = [
  {
    title: "Magnetic hero layouts",
    body: "Choose bold, mobile-first layouts that feel premium like a mini website.",
  },
  {
    title: "Action-first buttons",
    body: "Lead with WhatsApp, booking, or payment links that drive revenue.",
  },
  {
    title: "Storytelling sections",
    body: "Mix services, portfolio, and testimonials in one scrollable narrative.",
  },
  {
    title: "Analytics that feel human",
    body: "See who clicked what and optimize with clarity, not dashboards.",
  },
];

const steps = [
  {
    title: "Claim your handle",
    body: "Pick a short link and instantly publish a draft profile.",
  },
  {
    title: "Drop in your proof",
    body: "Add services, social links, and client wins in a guided flow.",
  },
  {
    title: "Share everywhere",
    body: "Put one smart link in your bios, invoices, and WhatsApp.",
  },
];

const templateGallery = [
  {
    title: "Sunset Studio",
    tag: "Portfolio",
    description: "Bold hero, featured projects, and a sticky booking CTA.",
    imageClass: "bg-[linear-gradient(135deg,#e8eeff,#ffffff)]",
  },
  {
    title: "Aura Beauty",
    tag: "Bookings",
    description: "Services grid with proof highlights and instant WhatsApp.",
    imageClass: "bg-[linear-gradient(135deg,#f0f4fa,#ffffff)]",
  },
  {
    title: "Northwind",
    tag: "Consulting",
    description: "Authority-first layout with testimonials and pricing blocks.",
    imageClass: "bg-[linear-gradient(135deg,#ffffff,#e8eeff)]",
  },
  {
    title: "Pulse Fitness",
    tag: "Coaching",
    description: "High-energy hero with schedule call and social proof cards.",
    imageClass: "bg-[linear-gradient(135deg,#f6f8fb,#ffffff)]",
  },
];

const testimonials = [
  {
    name: "Adaeze",
    role: "Brand designer",
    quote: "Byroo feels like a tiny agency site in one link. Clients trust me faster.",
  },
  {
    name: "Kofi",
    role: "Fitness coach",
    quote: "The WhatsApp button doubled my inquiries. It feels effortless to share.",
  },
  {
    name: "Maya",
    role: "Product photographer",
    quote: "I replaced a messy Linktree with a clean story and got more bookings.",
  },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function Home() {
  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text-strong)] font-sans">
      
      {/* HEADER */}
      <header className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 flex items-center justify-between">
        <BrandLogo />
        <div className="flex items-center gap-4">
          <ButtonLink href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log in
          </ButtonLink>
          <ButtonLink href="/signup" size="sm" className="rounded-md">
            Sign up
          </ButtonLink>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-20 pt-10 md:px-10 md:pt-20">
          <div className="grid gap-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="max-w-2xl"
            >
              <motion.div variants={fadeUp}>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)] mb-4">
                  Your Business Space Online
                </p>
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
                Turn your bio into a brand experience.
              </motion.h1>
              
              <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-[var(--text-soft)]">
                Byroo gives freelancers and small businesses a high-converting page at <span className="font-semibold text-[var(--text-strong)]">byroo.digital/username</span> with the polish of a real site.
              </motion.p>
              
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href="/signup" size="lg" className="rounded-lg px-8 shadow-lg shadow-indigo-500/20">
                  Create your space
                </ButtonLink>
                <ButtonLink href="/pricing" variant="ghost" size="lg" className="px-6 font-medium">
                  View plans
                </ButtonLink>
              </motion.div>
              
              <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4 border-t border-[var(--border-subtle)] pt-6">
                <div className="flex -space-x-3">
                  <Avatar name="A" size="sm" className="border-2 border-white" />
                  <Avatar name="B" size="sm" className="border-2 border-white bg-indigo-100 text-indigo-700" />
                  <Avatar name="C" size="sm" className="border-2 border-white bg-rose-100 text-rose-700" />
                  <Avatar name="D" size="sm" className="border-2 border-white bg-emerald-100 text-emerald-700" />
                  <Avatar name="E" size="sm" className="border-2 border-white bg-amber-100 text-amber-700" />
                </div>
                <div className="text-sm font-medium text-[var(--text-soft)]">
                  <span className="flex items-center gap-1 text-amber-500 mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </span>
                  Trusted by 2,000+ professionals.
                </div>
              </motion.div>
            </motion.div>

            {/* HERO MOCKUP */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[320px] z-10"
            >
              <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-[var(--brand-200)]/40 to-[var(--brand-50)]/40 blur-2xl z-0" />
              
              {/* Hardware Buttons (Outside the frame) */}
              <div className="absolute -left-[2px] top-24 w-1.5 h-8 bg-slate-800 rounded-l-sm z-0" />
              <div className="absolute -left-[2px] top-40 w-1.5 h-14 bg-slate-800 rounded-l-sm z-0" />
              <div className="absolute -left-[2px] top-56 w-1.5 h-14 bg-slate-800 rounded-l-sm z-0" />
              <div className="absolute -right-[2px] top-48 w-1.5 h-20 bg-slate-800 rounded-r-sm z-0" />

              {/* Main Phone Frame */}
              <div className="relative rounded-[40px] border-[8px] border-slate-900 bg-black shadow-[var(--shadow-mockup)] overflow-hidden aspect-[1242/2443] flex flex-col z-10">
                
                {/* Glass Glare / Reflection Layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none z-30" />

                {/* Realistic Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-20 shadow-[inset_0_0_2px_rgba(255,255,255,0.1)] flex items-center justify-end px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80 mr-1 shadow-[inset_0_0_1px_rgba(255,255,255,0.2)]" />
                </div>
                
                {/* Mockup Content */}
                <div className="flex-1 w-full h-full relative z-10 bg-white">
                  <img src="/mockup.png" alt="Byroo Profile Preview" className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* VALUE PROPS - DE-NESTED */}
        <section className="bg-white py-24">
          <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
            <motion.div 
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="max-w-2xl mb-16"
            >
              <h2 className="text-3xl font-semibold leading-tight md:text-5xl tracking-tight">Built to convert.</h2>
              <p className="mt-4 text-lg text-[var(--text-soft)]">
                Everything you need to showcase your work, capture leads, and close deals—all in one beautifully designed space.
              </p>
            </motion.div>

            <div className="grid gap-16 md:grid-cols-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex flex-col"
              >
                <div>
                  <h3 className="text-xl font-semibold">Action-first buttons</h3>
                  <p className="mt-2 text-[var(--text-soft)] mb-8">Lead with WhatsApp, booking, or payment links that drive revenue immediately.</p>
                </div>
                {/* UI Snippet */}
                <div className="mt-auto bg-[#FAFAFA] rounded-2xl p-6 border border-[var(--border-subtle)] shadow-sm">
                  <div className="space-y-3">
                    <div className="h-12 w-full bg-[#25D366] rounded-xl flex items-center justify-center text-white font-semibold shadow-sm gap-2">
                      <MessageCircle className="w-5 h-5" /> Message on WhatsApp
                    </div>
                    <div className="h-12 w-full bg-white border border-[var(--border-subtle)] rounded-xl flex items-center px-4 font-medium text-sm text-slate-700 shadow-sm justify-between">
                      Book consultation <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="flex flex-col"
              >
                <div>
                  <h3 className="text-xl font-semibold">Designed for trust</h3>
                  <p className="mt-2 text-[var(--text-soft)] mb-8">Establish authority instantly with verified badges, clean typography, and reviews.</p>
                </div>
                {/* UI Snippet */}
                <div className="mt-auto bg-[#FAFAFA] rounded-2xl p-6 border border-[var(--border-subtle)] shadow-sm flex items-center justify-center h-full min-h-[200px]">
                  <div className="bg-white px-6 py-4 rounded-full shadow-md border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-indigo-600" fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none">Verified Professional</p>
                      <p className="text-xs text-slate-500 mt-1">Identity confirmed</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - TIMELINE */}
        <section className="bg-[#FAFAFA] py-24">
          <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl font-semibold mb-16 tracking-tight text-center md:text-left"
            >
              How it works
            </motion.h2>

            <div className="relative max-w-3xl">
              {/* Timeline Line */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 md:left-6"></div>
              
              <div className="space-y-12">
                {steps.map((step, idx) => (
                  <motion.div 
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                    className="relative pl-12 md:pl-16"
                  >
                    <div className="absolute left-0 top-1 w-8 h-8 md:w-12 md:h-12 md:-left-0 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center font-bold text-indigo-600 shadow-sm text-sm md:text-base z-10">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-[var(--text-soft)] md:text-lg">{step.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="bg-white py-24">
          <div className="mx-auto w-full max-w-5xl px-5 md:px-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-semibold md:text-5xl tracking-tight">Simple pricing</h2>
              <p className="mt-4 text-lg text-[var(--text-soft)]">Start free, upgrade when you are ready to scale.</p>
            </motion.div>

            <div className="mt-16 grid md:grid-cols-2 gap-8 text-left items-center">
              
              {/* Free Tier */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-3xl border border-[var(--border-subtle)] p-8 md:p-10 bg-[#FAFAFA]"
              >
                <h3 className="text-2xl font-semibold">Free</h3>
                <p className="mt-2 text-[var(--text-soft)]">Perfect for getting started.</p>
                <div className="my-8 text-4xl font-bold">₦0<span className="text-lg font-normal text-[var(--text-soft)]">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-[var(--text-strong)]"><Check className="w-5 h-5 text-indigo-600" /> 5 links</li>
                  <li className="flex items-center gap-3 text-[var(--text-strong)]"><Check className="w-5 h-5 text-indigo-600" /> 3 portfolio items</li>
                  <li className="flex items-center gap-3 text-[var(--text-strong)]"><Check className="w-5 h-5 text-indigo-600" /> Standard templates</li>
                </ul>
                <ButtonLink href="/signup" variant="secondary" className="w-full justify-center">Get Started Free</ButtonLink>
              </motion.div>

              {/* Pro Tier - Dominant */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="relative rounded-3xl border-2 border-indigo-600 p-8 md:p-12 bg-white shadow-xl shadow-indigo-500/10 scale-100 md:scale-105 z-10"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Most Popular
                </div>
                <h3 className="text-2xl font-semibold text-indigo-600">Pro</h3>
                <p className="mt-2 text-[var(--text-soft)]">For serious professionals.</p>
                <div className="my-8 text-4xl font-bold">₦500<span className="text-lg font-normal text-[var(--text-soft)]">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-[var(--text-strong)]"><Check className="w-5 h-5 text-indigo-600" /> Unlimited links</li>
                  <li className="flex items-center gap-3 text-[var(--text-strong)]"><Check className="w-5 h-5 text-indigo-600" /> Advanced analytics</li>
                  <li className="flex items-center gap-3 text-[var(--text-strong)]"><Check className="w-5 h-5 text-indigo-600" /> Premium templates</li>
                  <li className="flex items-center gap-3 text-[var(--text-strong)]"><Check className="w-5 h-5 text-indigo-600" /> Custom branding</li>
                </ul>
                <ButtonLink href="/signup" variant="primary" className="w-full justify-center shadow-md shadow-indigo-600/20">Upgrade to Pro</ButtonLink>
              </motion.div>
              
            </div>
          </div>
        </section>

      </main>

      {/* FINAL CTA & FOOTER */}
      <section className="bg-white border-t border-[var(--border-subtle)] py-24 text-center">
        <div className="mx-auto max-w-4xl px-5">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6"
          >
            Ready to level up your bio?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 mb-10"
          >
            Join thousands of professionals using Byroo to convert profile visits into paying clients.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ButtonLink href="/signup" className="w-full sm:w-auto px-8 h-12 text-base shadow-sm">
                Get started for free
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" className="w-full sm:w-auto px-8 h-12 text-base bg-slate-100 hover:bg-slate-200">
                Contact sales
              </ButtonLink>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#FAFAFA] border-t border-[var(--border-subtle)] py-16">
        <div className="mx-auto w-full max-w-7xl px-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-2">
            <BrandLogo className="mb-6 h-16 md:h-20" />
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Byroo is the professional infrastructure for your digital presence. Everything you need to showcase your work, capture leads, and close deals.
            </p>
          </div>
          <div className="col-span-1 lg:col-span-1" /> {/* Spacer */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 mb-4 tracking-tight">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
              <li><Link href="/features" className="hover:text-indigo-600 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
              <li><Link href="/templates" className="hover:text-indigo-600 transition-colors">Templates</Link></li>
              <li><Link href="/changelog" className="hover:text-indigo-600 transition-colors">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900 mb-4 tracking-tight">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/help" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
              <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
              <li><Link href="/community" className="hover:text-indigo-600 transition-colors">Community</Link></li>
              <li><Link href="/guides" className="hover:text-indigo-600 transition-colors">Guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900 mb-4 tracking-tight">Company</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mx-auto w-full max-w-7xl px-5 mt-16 pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Byroo Inc by OLAMZYWEB. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Minimal Social Icons */}
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
