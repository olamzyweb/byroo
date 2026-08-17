import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileViewTracker } from "@/components/public/profile-view-tracker";
import { ShareProfileButton } from "@/components/public/share-profile-button";
import { Avatar, Badge } from "@/components/ui";
import { BadgeCheck } from "lucide-react";
import { env } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildItemWhatsAppMessage, buildServiceWhatsAppMessage, toWhatsAppLink } from "@/lib/whatsapp";
import type { CatalogItem, LinkItem, PortfolioItem, Profile, ServiceItem, SocialProfile, Testimonial, Theme } from "@/lib/types";
import { LinkIcon } from "@/components/link-icon";
import { StorefrontCatalog } from "@/components/public/storefront-catalog";

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
              <div 
                className={`relative rounded-full p-1.5 shadow-[0_8px_22px_rgba(15,23,42,0.22)] ${
                  data.profile.plan === "pro" && !data.profile.badge_revoked ? "" : "bg-white border-4 border-white/95"
                }`}
              >
                {data.profile.plan === "pro" && !data.profile.badge_revoked && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 animate-spin-slow" />
                )}
                <div className={`relative z-10 rounded-full overflow-hidden ${data.profile.plan === "pro" && !data.profile.badge_revoked ? "border-4 border-white bg-white" : ""}`}>
                  <Avatar name={data.profile.display_name} src={data.profile.avatar_url} size="lg" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="mt-14 text-3xl font-semibold flex items-center justify-center gap-2">
            <span>{data.profile.display_name}</span>
            {data.profile.plan === "pro" && !data.profile.badge_revoked && (
              <div title="Verified Pro Vendor" className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full drop-shadow-[0_0_6px_rgba(217,119,6,0.3)] translate-y-[3px]">
                {/* Custom Metallic Gold Verified Badge */}
                <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FBBF24" /> {/* amber-400 */}
                      <stop offset="50%" stopColor="#D97706" /> {/* amber-600 */}
                      <stop offset="100%" stopColor="#92400E" /> {/* amber-800 */}
                    </linearGradient>
                  </defs>
                  {/* Outer Decagon/Circle shape */}
                  <path 
                    fill="url(#goldGradient)"
                    d="M10.158 1.455c.983-.794 2.701-.794 3.684 0l1.791 1.446c.356.287.79.467 1.25.517l2.285.247c1.256.136 2.106 1.34 1.954 2.595l-.278 2.284a2.754 2.754 0 0 0 .167 1.339l.942 2.102c.516 1.152.016 2.534-1.077 3.01l-2.095.91a2.75 2.75 0 0 0-1.196 1.197l-.91 2.094c-.476 1.093-1.858 1.593-3.01 1.077l-2.102-.942a2.75 2.75 0 0 0-1.34-.167l-2.284.278c-1.255.152-2.459-.698-2.595-1.954l-.247-2.285a2.75 2.75 0 0 0-.517-1.25L1.455 13.84C.66 12.858.66 11.14 1.455 10.16l1.446-1.792c.287-.356.467-.79.517-1.25l.247-2.284c.136-1.256 1.34-2.106 2.595-1.954l2.284.278c.46.056.931-.001 1.34-.167l2.102-.942c1.152-.516 2.534-.016 3.01 1.077l.91 2.095c.261.6.6 1.127 1.197 1.196l2.094.91c1.093.476 1.593 1.858 1.077 3.01l-.942 2.102a2.75 2.75 0 0 0-.167 1.34l.278 2.284c.152 1.255-.698 2.459-1.954 2.595l-2.285.247a2.75 2.75 0 0 0-1.25.517l-1.792 1.446Z"
                  />
                  {/* Inner White Checkmark */}
                  <path 
                    d="M8.5 12.5L11 15L15.5 9.5" 
                    stroke="white" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                {/* Shine animation layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine w-full h-full mix-blend-overlay" />
              </div>
            )}
          </h1>
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

        {data.links.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: t.muted }}>Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {data.links.map((link) => (
                <a
                  key={link.id}
                  href={`/api/analytics/click?linkId=${encodeURIComponent(link.id)}&target=${encodeURIComponent(link.url)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-center text-sm font-medium transition hover:translate-y-[-1px]"
                  style={{ borderColor: `${t.accent}44` }}
                >
                  <LinkIcon type={link.type} url={link.url} />
                  {link.title}
                </a>
              ))}
            </div>
          </section>
        ) : null}

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
          <StorefrontCatalog
            catalogItems={data.catalogItems}
            profile={data.profile}
            themeTokens={t}
          />
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
