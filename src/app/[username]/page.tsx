import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileViewTracker } from "@/components/public/profile-view-tracker";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { LinkItem, PortfolioItem, Profile, ServiceItem, Theme } from "@/lib/types";

async function getPublicData(username: string) {
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("onboarded", true)
    .single();

  if (!profile) {
    return null;
  }

  const [linksResult, portfolioResult, servicesResult, themeResult] = await Promise.all([
    admin.from("links").select("*").eq("user_id", profile.id).eq("is_active", true).order("sort_order", { ascending: true }),
    admin
      .from("portfolio_items")
      .select("*")
      .eq("user_id", profile.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    admin.from("services").select("*").eq("user_id", profile.id).eq("is_active", true).order("sort_order", { ascending: true }),
    admin.from("themes").select("*").eq("key", profile.theme_key).single(),
  ]);

  return {
    profile: profile as Profile,
    links: (linksResult.data ?? []) as LinkItem[],
    portfolio: (portfolioResult.data ?? []) as PortfolioItem[],
    services: (servicesResult.data ?? []) as ServiceItem[],
    theme: (themeResult.data ?? {
      key: "byroo-light",
      name: "Byroo Light",
      is_pro: false,
      tokens: { bg: "#f8fafc", card: "#ffffff", text: "#0f172a", muted: "#64748b", accent: "#0ea5e9" },
    }) as Theme,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const data = await getPublicData(username);

  if (!data) {
    return {
      title: "Byroo profile not found",
      description: "This Byroo page does not exist.",
    };
  }

  return {
    title: `${data.profile.display_name} on Byroo`,
    description: data.profile.bio ?? "Visit this Byroo business page.",
    openGraph: {
      title: `${data.profile.display_name} on Byroo`,
      description: data.profile.bio ?? "Visit this Byroo business page.",
    },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getPublicData(username);

  if (!data) {
    notFound();
  }

  const t = data.theme.tokens;
  const showBranding = data.profile.plan === "free" || !data.profile.branding_hidden;

  return (
    <main
      className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10"
      style={{ backgroundColor: t.bg, color: t.text }}
    >
      <ProfileViewTracker profileUserId={data.profile.id} />

      <section className="mx-auto max-w-2xl rounded-3xl border p-6 shadow-sm" style={{ backgroundColor: t.card }}>
        <div className="text-center">
          {data.profile.avatar_url ? (
            <img src={data.profile.avatar_url} alt={data.profile.display_name} className="mx-auto h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-600">
              {data.profile.display_name.slice(0, 1)}
            </div>
          )}
          <h1 className="mt-4 text-3xl font-bold">{data.profile.display_name}</h1>
          {data.profile.bio ? <p className="mt-2 text-sm" style={{ color: t.muted }}>{data.profile.bio}</p> : null}
        </div>

        <div className="mt-6 space-y-3">
          {data.profile.whatsapp_number ? (
            <a
              href={buildWhatsAppUrl(data.profile.whatsapp_number, data.profile.whatsapp_prefill)}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl px-4 py-3 text-center text-sm font-semibold text-white"
              style={{ backgroundColor: t.accent }}
            >
              WhatsApp me
            </a>
          ) : null}

          {data.links.map((link) => (
            <a
              key={link.id}
              href={`/api/analytics/click?linkId=${encodeURIComponent(link.id)}&target=${encodeURIComponent(link.url)}`}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border px-4 py-3 text-center text-sm font-medium"
            >
              {link.title}
            </a>
          ))}
        </div>

        {data.services.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Services</h2>
            <div className="mt-3 space-y-3">
              {data.services.map((service) => (
                <div key={service.id} className="rounded-xl border p-3">
                  <h3 className="font-medium">{service.name}</h3>
                  {service.description ? <p className="mt-1 text-sm" style={{ color: t.muted }}>{service.description}</p> : null}
                  {service.starting_price ? <p className="mt-2 text-sm font-medium">From {service.starting_price}</p> : null}
                  {service.cta_url ? (
                    <a href={service.cta_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold" style={{ color: t.accent }}>
                      {service.cta_text}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {data.portfolio.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Portfolio</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {data.portfolio.map((item) => (
                <div key={item.id} className="rounded-xl border p-3">
                  {item.image_url ? <img src={item.image_url} alt={item.title} className="h-32 w-full rounded-lg object-cover" /> : null}
                  <h3 className="mt-2 font-medium">{item.title}</h3>
                  {item.description ? <p className="mt-1 text-sm" style={{ color: t.muted }}>{item.description}</p> : null}
                  {item.external_url ? (
                    <a href={item.external_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold" style={{ color: t.accent }}>
                      Open project
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {showBranding ? (
          <p className="mt-8 text-center text-xs" style={{ color: t.muted }}>
            Powered by <Link href="/" className="font-semibold">Byroo</Link>
          </p>
        ) : null}
      </section>
    </main>
  );
}
