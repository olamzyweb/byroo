import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileViewTracker } from "@/components/public/profile-view-tracker";
import { ShareProfileButton } from "@/components/public/share-profile-button";
import { Avatar, Badge } from "@/components/ui";
import { env } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildItemWhatsAppMessage, buildServiceWhatsAppMessage, toWhatsAppLink } from "@/lib/whatsapp";
import type { CatalogItem, LinkItem, PortfolioItem, Profile, ServiceItem, SocialProfile, Testimonial, Theme } from "@/lib/types";

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

  const [linksResult, catalogResult, servicesResult, portfolioResult, testimonialsResult, socialResult, themeResult] = await Promise.all([
    admin.from("links").select("*").eq("user_id", profile.id).eq("is_active", true).order("sort_order", { ascending: true }),
    admin.from("catalog_items").select("*").eq("user_id", profile.id).eq("is_active", true).order("sort_order", { ascending: true }),
    admin.from("services").select("*").eq("user_id", profile.id).eq("is_active", true).order("sort_order", { ascending: true }),
    admin.from("portfolio_items").select("*").eq("user_id", profile.id).eq("is_active", true).order("sort_order", { ascending: true }),
    admin.from("testimonials").select("*").eq("user_id", profile.id).eq("is_featured", true).order("sort_order", { ascending: true }),
    admin.from("social_profiles").select("*").eq("user_id", profile.id).eq("sync_status", "success").order("platform", { ascending: true }),
    admin.from("themes").select("*").eq("key", profile.theme_key).single(),
  ]);

  return {
    profile: profile as Profile,
    links: (linksResult.data ?? []) as LinkItem[],
    catalogItems: (catalogResult.data ?? []) as CatalogItem[],
    services: (servicesResult.data ?? []) as ServiceItem[],
    portfolio: (portfolioResult.data ?? []) as PortfolioItem[],
    testimonials: (testimonialsResult.data ?? []) as Testimonial[],
    socialProfiles: (socialResult.data ?? []) as SocialProfile[],
    theme: (themeResult.data ?? {
      key: "byroo-light",
      name: "Default",
      is_pro: false,
      tokens: { bg: "#f6f8fb", card: "#ffffff", text: "#0f172a", muted: "#5b6472", accent: "#3451d1" },
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

  const profileUrl = `${env.appUrl}/${username}`;
  const imageUrl = data.profile.header_image_url || data.profile.avatar_url || `${profileUrl}/opengraph-image`;

  return {
    title: `${data.profile.display_name} • Byroo`,
    description: data.profile.bio ?? "Visit this Byroo business page.",
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title: `${data.profile.display_name} • Byroo`,
      description: data.profile.bio ?? "Visit this Byroo business page.",
      url: profileUrl,
      type: "profile",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${data.profile.display_name} on Byroo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.profile.display_name} • Byroo`,
      description: data.profile.bio ?? "Visit this Byroo business page.",
      images: [imageUrl],
    },
  };
}

type QuickActionKind = "whatsapp" | "instagram" | "tiktok" | "facebook" | "maps";

function quickActions(profile: Profile) {
  const actions: Array<{ label: string; href: string; kind: QuickActionKind }> = [];
  if (profile.whatsapp_number) {
    actions.push({
      label: "WhatsApp",
      href: toWhatsAppLink(profile.whatsapp_number, profile.whatsapp_prefill),
      kind: "whatsapp",
    });
  }
  if (profile.instagram_url) {
    actions.push({ label: "Instagram", href: profile.instagram_url, kind: "instagram" });
  }
  if (profile.tiktok_url) {
    actions.push({ label: "TikTok", href: profile.tiktok_url, kind: "tiktok" });
  }
  if (profile.facebook_url) {
    actions.push({ label: "Facebook", href: profile.facebook_url, kind: "facebook" });
  }
  if (profile.google_maps_url) {
    actions.push({ label: "Open in Maps", href: profile.google_maps_url, kind: "maps" });
  }
  return actions;
}

function ActionIcon({ kind }: { kind: QuickActionKind }) {
  const iconClass = "h-4 w-4";
  if (kind === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <path d="M12 3a9 9 0 0 0-7.79 13.5L3 21l4.66-1.2A9 9 0 1 0 12 3Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 8.8c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .5.3l1 2.3c.1.2.1.4 0 .6l-.4.7c-.1.2-.2.3 0 .5.5.9 1.3 1.7 2.2 2.2.2.1.4.1.5 0l.7-.4c.2-.1.4-.1.6 0l2.2 1c.3.1.3.3.3.5v.6c0 .3 0 .5-.5.7-.5.2-1.4.4-2.8-.1-1.2-.4-2.3-1.3-3.3-2.3s-1.9-2.1-2.3-3.3c-.5-1.4-.3-2.3-.1-2.8Z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <path d="M14 4v7a3.2 3.2 0 1 1-2.4-3.1V6.2A5.4 5.4 0 1 0 16 11V8.8c1 .7 2.1 1.1 3.3 1.2V7.7c-1.7-.2-3-1.6-3.3-3.7H14Z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
        <path d="M13.3 20v-6h2.1l.4-2.6h-2.5V9.7c0-.8.2-1.4 1.3-1.4h1.3V6a15.7 15.7 0 0 0-1.9-.1c-1.9 0-3.2 1.2-3.2 3.4v2h-2.1V14h2.1v6h2.5Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function getMapEmbedSrc(location?: string | null, mapsUrl?: string | null): string | null {
  if (location && location.trim()) {
    return `https://www.google.com/maps?q=${encodeURIComponent(location.trim())}&output=embed`;
  }

  if (!mapsUrl) {
    return null;
  }

  try {
    const parsed = new URL(mapsUrl);
    const q =
      parsed.searchParams.get("q") ||
      parsed.searchParams.get("query") ||
      parsed.searchParams.get("destination") ||
      parsed.searchParams.get("daddr");

    if (q && q.trim()) {
      return `https://www.google.com/maps?q=${encodeURIComponent(q.trim())}&output=embed`;
    }

    // Fallback: search by the full URL string when no explicit query is available.
    return `https://www.google.com/maps?q=${encodeURIComponent(mapsUrl)}&output=embed`;
  } catch {
    return `https://www.google.com/maps?q=${encodeURIComponent(mapsUrl)}&output=embed`;
  }
}

function formatCompact(value: number | null) {
  if (value == null) {
    return "-";
  }
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getPublicData(username);

  if (!data) {
    notFound();
  }

  const t = data.theme.tokens;
  const showBranding = data.profile.plan === "free" || !data.profile.branding_hidden;
  const actions = quickActions(data.profile);
  const mapEmbedSrc = getMapEmbedSrc(data.profile.business_location, data.profile.google_maps_url);

  return (
    <main
      className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 md:py-10"
      style={{
        background: `radial-gradient(circle at top, ${t.accent}22, transparent 30rem), ${t.bg}`,
        color: t.text,
      }}
    >
      <ProfileViewTracker profileUserId={data.profile.id} />

      <section className="mx-auto max-w-2xl space-y-8 rounded-3xl border p-5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] md:p-7" style={{ backgroundColor: t.card, borderColor: `${t.accent}33` }}>
        <div className="text-center" style={{ animation: "fadeIn 450ms ease-out" }}>
          <div className="relative mb-4 -mx-5 -mt-5 md:-mx-7 md:-mt-7">
            <div
              className="relative overflow-hidden rounded-t-3xl border-b"
              style={{ borderColor: `${t.accent}22` }}
            >
              <div
                className="h-36 bg-cover bg-center md:h-44"
                style={{
                  backgroundImage: data.profile.header_image_url
                    ? `url(${data.profile.header_image_url})`
                    : `linear-gradient(135deg, ${t.accent}40, transparent), radial-gradient(circle at top right, ${t.accent}25, transparent 60%)`,
                  backgroundColor: data.profile.header_image_url ? undefined : t.card,
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(15,23,42,0.52), rgba(15,23,42,0.4) 45%, rgba(15,23,42,0.58))",
                }}
              />
            </div>

            <div className="absolute -bottom-12 left-1/2 z-10 -translate-x-1/2">
              <div className="rounded-full border-4 border-white/95 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.22)]">
                <Avatar name={data.profile.display_name} src={data.profile.avatar_url} size="lg" />
              </div>
            </div>
          </div>

          <h1 className="mt-14 text-3xl font-semibold">{data.profile.display_name}</h1>
          {data.profile.bio ? <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: t.muted }}>{data.profile.bio}</p> : null}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Badge tone="brand">/{data.profile.username}</Badge>
            {data.profile.trusted_badge_text ? <Badge tone="success">{data.profile.trusted_badge_text}</Badge> : null}
          </div>
          <div className="mt-3 flex justify-center">
            <ShareProfileButton
              title={`${data.profile.display_name} on Byroo`}
              text={`Check out ${data.profile.display_name}'s business page on Byroo.`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition hover:translate-y-[-1px]"
            />
          </div>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: t.muted }}>Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-center text-sm font-medium transition hover:translate-y-[-1px]"
                style={{ borderColor: `${t.accent}44` }}
              >
                <ActionIcon kind={action.kind} />
                {action.label}
              </a>
            ))}
            {data.links.map((link) => (
              <a
                key={link.id}
                href={`/api/analytics/click?linkId=${encodeURIComponent(link.id)}&target=${encodeURIComponent(link.url)}`}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border px-4 py-3 text-center text-sm font-medium transition hover:translate-y-[-1px]"
                style={{ borderColor: `${t.accent}44` }}
              >
                {link.title}
              </a>
            ))}
          </div>
        </section>

        {data.socialProfiles.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: t.muted }}>
              Social Proof
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {data.socialProfiles.map((social) => (
                <div key={social.id} className="rounded-xl border p-3" style={{ borderColor: `${t.accent}2f` }}>
                  <div className="flex items-center gap-3">
                    {social.profile_image_url ? (
                      <img
                        src={social.profile_image_url}
                        alt={social.display_name ?? social.username}
                        className="h-12 w-12 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-[var(--surface-muted)]" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        {social.display_name ?? social.username}
                        {social.verified ? <span className="ml-1 text-xs">✓</span> : null}
                      </p>
                      <p className="text-xs" style={{ color: t.muted }}>
                        @{social.username} · {social.platform}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                    <div className="text-center">
                      <p className="font-semibold">{formatCompact(social.followers_count)}</p>
                      <p style={{ color: t.muted }}>followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{formatCompact(social.following_count)}</p>
                      <p style={{ color: t.muted }}>following</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{formatCompact(social.content_count)}</p>
                      <p style={{ color: t.muted }}>{social.platform === "instagram" ? "posts" : "videos"}</p>
                    </div>
                  </div>
                  {social.bio ? (
                    <p className="mt-2 line-clamp-2 text-xs" style={{ color: t.muted }}>
                      {social.bio}
                    </p>
                  ) : null}
                  <div className="mt-2 flex items-center justify-end">
                    <a href={social.profile_url} target="_blank" rel="noreferrer" className="text-xs font-semibold" style={{ color: t.accent }}>
                      View Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {data.catalogItems.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: t.muted }}>Catalog</h2>
            <div className="grid grid-cols-2 gap-3">
              {data.catalogItems.map((item) => {
                const message = buildItemWhatsAppMessage(item.name, item.whatsapp_prefill || data.profile.whatsapp_prefill);
                const href = data.profile.whatsapp_number ? toWhatsAppLink(data.profile.whatsapp_number, message) : "#";
                return (
                  <div key={item.id} className="rounded-xl border p-3" style={{ borderColor: `${t.accent}2f` }}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="aspect-[4/3] w-full rounded-lg object-cover object-center"
                      />
                    ) : null}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      <Badge tone={item.availability_status === "available" ? "success" : "warning"}>{item.availability_status}</Badge>
                    </div>
                    {item.price ? <p className="mt-1 text-sm font-medium">{item.price}</p> : null}
                    {item.short_description ? <p className="mt-1 text-xs" style={{ color: t.muted }}>{item.short_description}</p> : null}
                    {data.profile.whatsapp_number ? (
                      <a href={href} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold" style={{ color: t.accent }}>
                        {item.cta_text || (item.cta_type === "order_whatsapp" ? "Order on WhatsApp" : "Inquire on WhatsApp")}
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {data.services.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: t.muted }}>Services / Price List</h2>
            <div className="grid gap-3">
              {data.services.map((service) => {
                const whatsappMessage = buildServiceWhatsAppMessage(service.name, service.whatsapp_prefill);
                const whatsappHref = data.profile.whatsapp_number ? toWhatsAppLink(data.profile.whatsapp_number, whatsappMessage) : "#";
                const ctaHref = service.cta_type === "external" ? service.cta_url : whatsappHref;
                return (
                  <div key={service.id} className="rounded-xl border p-3" style={{ borderColor: `${t.accent}2f` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold">{service.name}</h3>
                        {service.description ? <p className="mt-1 text-xs" style={{ color: t.muted }}>{service.description}</p> : null}
                      </div>
                      {service.starting_price ? <span className="text-xs font-medium">From {service.starting_price}</span> : null}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge tone={service.availability_status === "available" ? "success" : "warning"}>{service.availability_status}</Badge>
                    </div>
                    {ctaHref && ctaHref !== "#" ? (
                      <a href={ctaHref} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold" style={{ color: t.accent }}>
                        {service.cta_text}
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {data.portfolio.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: t.muted }}>Portfolio</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {data.portfolio.map((item) => (
                <div key={item.id} className="rounded-xl border p-3" style={{ borderColor: `${t.accent}2f` }}>
                  {item.image_url ? <img src={item.image_url} alt={item.title} className="h-28 w-full rounded-lg object-cover" /> : null}
                  <h3 className="mt-2 text-sm font-semibold">{item.title}</h3>
                  {item.description ? <p className="mt-1 text-xs" style={{ color: t.muted }}>{item.description}</p> : null}
                  {item.external_url ? (
                    <a href={item.external_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold" style={{ color: t.accent }}>
                      View project
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {data.testimonials.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: t.muted }}>Reviews</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {data.testimonials.map((review) => (
                <div key={review.id} className="rounded-xl border p-3" style={{ borderColor: `${t.accent}2f` }}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{review.customer_name}</p>
                    <span className="text-xs">{"★".repeat(review.rating)}</span>
                  </div>
                  <p className="mt-2 text-xs" style={{ color: t.muted }}>{review.review_text}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {(data.profile.business_location || data.profile.delivery_info || data.profile.opening_hours || data.profile.nationwide_delivery || data.profile.in_store_pickup) ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: t.muted }}>Business Info</h2>
            <div className="rounded-xl border p-3 text-sm" style={{ borderColor: `${t.accent}2f` }}>
              {mapEmbedSrc ? (
                <div className="mb-3 overflow-hidden rounded-lg border" style={{ borderColor: `${t.accent}2f` }}>
                  <iframe
                    title="Business location map"
                    src={mapEmbedSrc}
                    className="h-48 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : null}
              {data.profile.business_location ? <p><span className="font-semibold">Location:</span> {data.profile.business_location}</p> : null}
              {data.profile.opening_hours ? <p className="mt-1"><span className="font-semibold">Hours:</span> {data.profile.opening_hours}</p> : null}
              {data.profile.delivery_info ? <p className="mt-1"><span className="font-semibold">Delivery:</span> {data.profile.delivery_info}</p> : null}
              <div className="mt-2 flex flex-wrap gap-2">
                {data.profile.nationwide_delivery ? <Badge tone="success">Nationwide delivery</Badge> : null}
                {data.profile.in_store_pickup ? <Badge tone="brand">In-store pickup</Badge> : null}
                {data.profile.google_maps_url ? (
                  <a href={data.profile.google_maps_url} target="_blank" rel="noreferrer" className="text-xs font-semibold" style={{ color: t.accent }}>
                    Open in Google Maps
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {showBranding ? (
          <p className="text-center text-xs" style={{ color: t.muted }}>
            Powered by <Link href="/" className="font-semibold">Byroo</Link>
          </p>
        ) : null}
      </section>
    </main>
  );
}
