export type Plan = "free" | "pro";

export type ThemeKey =
  | "byroo-light"
  | "byroo-sunset"
  | "byroo-forest"
  | "byroo-ocean"
  | "byroo-sand"
  | "byroo-charcoal";

export type LinkType =
  | "website"
  | "whatsapp"
  | "instagram"
  | "email"
  | "linkedin"
  | "github"
  | "booking"
  | "other";

export interface Profile {
  id: string;
  email: string;
  username: string | null;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  header_image_url: string | null;
  whatsapp_number: string | null;
  whatsapp_prefill: string | null;
  business_location: string | null;
  google_maps_url: string | null;
  delivery_info: string | null;
  opening_hours: string | null;
  nationwide_delivery: boolean;
  in_store_pickup: boolean;
  instagram_url: string | null;
  tiktok_url: string | null;
  facebook_url: string | null;
  trusted_badge_text: string | null;
  theme_key: ThemeKey;
  branding_hidden: boolean;
  plan: Plan;
  onboarded: boolean;
}

export interface LinkItem {
  id: string;
  user_id: string;
  title: string;
  url: string;
  type: LinkType;
  is_active: boolean;
  sort_order: number;
}

export interface PortfolioItem {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  external_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ServiceItem {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  starting_price: string | null;
  cta_text: string;
  cta_type: "whatsapp" | "external";
  cta_url: string | null;
  whatsapp_prefill: string | null;
  availability_status: "available" | "limited" | "unavailable";
  is_active: boolean;
  sort_order: number;
}

export interface CatalogItem {
  id: string;
  user_id: string;
  name: string;
  image_url: string | null;
  price: string | null;
  short_description: string | null;
  category: string | null;
  availability_status: "available" | "limited" | "unavailable";
  cta_type: "order_whatsapp" | "inquire_whatsapp";
  cta_text: string;
  whatsapp_prefill: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  user_id: string;
  customer_name: string;
  review_text: string;
  rating: number;
  is_featured: boolean;
  sort_order: number;
}

export interface SocialProfile {
  id: string;
  user_id: string;
  platform: "instagram" | "tiktok";
  username: string;
  display_name: string | null;
  profile_image_url: string | null;
  bio: string | null;
  followers_count: number | null;
  following_count: number | null;
  content_count: number | null;
  verified: boolean;
  profile_url: string;
  sync_status: "idle" | "syncing" | "success" | "error";
  sync_error: string | null;
  last_synced_at: string | null;
}

export interface Theme {
  key: ThemeKey;
  name: string;
  is_pro: boolean;
  tokens: {
    bg: string;
    card: string;
    text: string;
    muted: string;
    accent: string;
  };
}
