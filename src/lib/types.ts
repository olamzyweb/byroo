export type Plan = "free" | "pro";

export type ThemeKey = "byroo-light" | "byroo-sunset" | "byroo-forest";

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
  whatsapp_number: string | null;
  whatsapp_prefill: string | null;
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
  cta_url: string | null;
  is_active: boolean;
  sort_order: number;
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
