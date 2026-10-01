export interface OnboardingItem {
  label: string;
  done: boolean;
  href: string;
}

export interface OnboardingProgress {
  completionItems: OnboardingItem[];
  completedCount: number;
  totalCount: number;
  completionPercent: number;
  nextItem: OnboardingItem | null;
}

export function getOnboardingProgress(params: {
  profile: {
    username?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    whatsapp_number?: string | null;
  } | null;
  linkCount: number;
  catalogCount: number;
  serviceCount: number;
  socialProofCount: number;
}): OnboardingProgress {
  const { profile, linkCount, catalogCount, serviceCount, socialProofCount } = params;

  const completionItems: OnboardingItem[] = [
    {
      label: "Claim your username",
      done: Boolean(profile?.username),
      href: "/dashboard/profile",
    },
    {
      label: "Add profile photo",
      done: Boolean(profile?.avatar_url),
      href: "/dashboard/profile",
    },
    {
      label: "Write a short bio",
      done: Boolean(profile?.bio),
      href: "/dashboard/profile",
    },
    {
      label: "Set WhatsApp number",
      done: Boolean(profile?.whatsapp_number),
      href: "/dashboard/whatsapp",
    },
    {
      label: "Add at least one link",
      done: linkCount > 0,
      href: "/dashboard/links",
    },
    {
      label: "Add one offer (catalog or service)",
      done: catalogCount > 0 || serviceCount > 0,
      href: catalogCount > 0 ? "/dashboard/services" : "/dashboard/catalog",
    },
    {
      label: "Connect social proof",
      done: socialProofCount > 0,
      href: "/dashboard/socials",
    },
  ];

  const completedCount = completionItems.filter((item) => item.done).length;
  const totalCount = completionItems.length;
  const completionPercent = Math.round((completedCount / totalCount) * 100);
  const nextItem = completionItems.find((item) => !item.done) ?? null;

  return {
    completionItems,
    completedCount,
    totalCount,
    completionPercent,
    nextItem,
  };
}
