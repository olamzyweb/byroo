import * as React from "react";
import {
  Button as RefButton,
  Container as RefContainer,
  Hr,
  Text,
  Link,
  Section as RefSection,
  Img,
  Row,
  Column,
} from "@react-email/components";

import { emailConfig } from "../../src/lib/email/config";

// Theme configuration shared across all templates
export const brandColors = {
  primary: "#6366f1", // Indigo 500
  primaryDark: "#4f46e5", // Indigo 600
  secondary: "#10b981", // Emerald 500
  background: "#f9fafb", // Gray 50
  cardBg: "#ffffff",
  textDark: "#1f2937", // Gray 800
  textMuted: "#6b7280", // Gray 500
  border: "#e5e7eb", // Gray 200
  warning: "#f59e0b", // Amber 500
  danger: "#ef4444", // Red 500
};

export const defaultBrandInfo = {
  name: emailConfig.brand.name || "Byroo",
  logoUrl: emailConfig.brand.logoUrl || "https://byroo.digital/byroo-logo.png",
  websiteUrl: emailConfig.baseUrl,
  supportEmail: emailConfig.supportEmail || "support@byroo.digital",
  companyAddress: "Byroo Inc., Lagos, Nigeria",
  socials: {
    twitter: emailConfig.brand.socials.twitter || "https://twitter.com/byroo",
    instagram: emailConfig.brand.socials.instagram || "https://instagram.com/byroo",
    facebook: emailConfig.brand.socials.facebook || "https://facebook.com/byroo",
  },
};

// 1. Typography Component Wrappers
export const EmailH1: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <Text className={`text-2xl font-bold tracking-tight text-gray-900 m-0 mb-4 ${className}`}>
    {children}
  </Text>
);

export const EmailH2: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <Text className={`text-xl font-semibold tracking-tight text-gray-900 m-0 mb-3 ${className}`}>
    {children}
  </Text>
);

export const EmailBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <Text className={`text-base leading-relaxed text-gray-800 m-0 mb-4 ${className}`}>
    {children}
  </Text>
);

export const EmailMuted: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <Text className={`text-sm leading-normal text-gray-500 m-0 ${className}`}>
    {children}
  </Text>
);

// 2. Button Primitive
export const EmailButton: React.FC<{
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}> = ({ href, children, variant = "primary", className = "" }) => {
  const bg = variant === "primary" ? "bg-indigo-600" : "bg-emerald-600";
  return (
    <RefButton
      href={href}
      className={`inline-block text-center text-sm font-semibold text-white no-underline px-6 py-3 rounded-lg shadow-sm hover:opacity-90 ${bg} ${className}`}
    >
      {children}
    </RefButton>
  );
};

// 3. Divider Primitive
export const EmailDivider: React.FC<{ className?: string }> = ({ className = "" }) => (
  <Hr className={`border-gray-200 my-6 ${className}`} />
);

// 4. Card Primitive
export const EmailCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <RefSection className={`bg-white border border-solid border-gray-200 rounded-xl p-6 mb-6 ${className}`}>
    {children}
  </RefSection>
);

// 5. Callout Primitive
export const EmailCallout: React.FC<{
  children: React.ReactNode;
  type?: "info" | "warning" | "success" | "danger";
  className?: string;
}> = ({ children, type = "info", className = "" }) => {
  let borderLeft = "border-l-indigo-500";
  let bg = "bg-indigo-50/50";
  if (type === "warning") {
    borderLeft = "border-l-amber-500";
    bg = "bg-amber-50/50";
  } else if (type === "success") {
    borderLeft = "border-l-emerald-500";
    bg = "bg-emerald-50/50";
  } else if (type === "danger") {
    borderLeft = "border-l-red-500";
    bg = "bg-red-50/50";
  }

  return (
    <RefSection className={`border-l-4 border-solid ${borderLeft} ${bg} rounded-r-lg p-4 mb-4 ${className}`}>
      <Text className="text-sm m-0 text-gray-700 leading-relaxed">{children}</Text>
    </RefSection>
  );
};

// 6. Business Card Primitive
export const EmailBusinessCard: React.FC<{
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  whatsappNumber?: string;
  location?: string;
  profileUrl: string;
}> = ({ name, username, avatarUrl, bio, whatsappNumber, location, profileUrl }) => {
  return (
    <EmailCard className="border-indigo-100 bg-gradient-to-r from-white to-indigo-50/20">
      <Row className="mb-4">
        {avatarUrl && (
          <Column className="w-12 pr-4 align-top">
            <Img src={avatarUrl} alt={name} width="48" height="48" className="rounded-full object-cover border border-solid border-gray-200" />
          </Column>
        )}
        <Column className="align-top">
          <Text className="text-base font-bold text-gray-900 m-0">{name}</Text>
          <Text className="text-sm text-indigo-600 font-semibold m-0">@{username}</Text>
        </Column>
      </Row>
      {bio && <Text className="text-sm text-gray-600 m-0 mb-3 italic">"{bio}"</Text>}
      {location && (
        <Text className="text-xs text-gray-500 m-0 mb-1">
          📍 {location}
        </Text>
      )}
      {whatsappNumber && (
        <Text className="text-xs text-gray-500 m-0 mb-4">
          💬 WhatsApp: {whatsappNumber}
        </Text>
      )}
      <EmailButton href={profileUrl} variant="primary" className="py-2 px-4 text-xs">
        View Digital Space
      </EmailButton>
    </EmailCard>
  );
};

// 7. Logo Primitive
export const EmailLogo: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <RefSection className="mb-6">
    <Img
      src={defaultBrandInfo.logoUrl}
      alt={defaultBrandInfo.name}
      width={size * 3}
      height={size}
      className="object-contain"
    />
  </RefSection>
);

// 8. Social Links
export const EmailSocialLinks: React.FC = () => (
  <table align="center" className="my-4">
    <tr>
      <td className="px-2">
        <Link href={defaultBrandInfo.socials.twitter} className="text-indigo-600 text-xs no-underline font-semibold">
          Twitter
        </Link>
      </td>
      <td className="px-2 text-gray-300">|</td>
      <td className="px-2">
        <Link href={defaultBrandInfo.socials.instagram} className="text-indigo-600 text-xs no-underline font-semibold">
          Instagram
        </Link>
      </td>
      <td className="px-2 text-gray-300">|</td>
      <td className="px-2">
        <Link href={defaultBrandInfo.socials.facebook} className="text-indigo-600 text-xs no-underline font-semibold">
          Facebook
        </Link>
      </td>
    </tr>
  </table>
);

// 9. CTA Banner block
export const EmailCTA: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  href: string;
  variant?: "primary" | "secondary";
}> = ({ title, description, buttonText, href, variant = "primary" }) => (
  <EmailCard className="text-center bg-indigo-50 border-indigo-100">
    <Text className="text-lg font-bold text-indigo-900 m-0 mb-1">{title}</Text>
    <Text className="text-sm text-indigo-700 m-0 mb-4">{description}</Text>
    <EmailButton href={href} variant={variant}>
      {buttonText}
    </EmailButton>
  </EmailCard>
);

// 10. Default Header
export const EmailHeader: React.FC = () => (
  <RefSection className="pt-4 pb-2">
    <EmailLogo />
  </RefSection>
);

// 11. Default Footer (with unsubscribe link support)
export const EmailFooter: React.FC<{
  unsubscribeToken?: string;
  showUnsubscribe?: boolean;
}> = ({ unsubscribeToken, showUnsubscribe = true }) => {
  const unsubscribeUrl = unsubscribeToken
    ? `${defaultBrandInfo.websiteUrl}/unsubscribe?token=${unsubscribeToken}`
    : `${defaultBrandInfo.websiteUrl}/unsubscribe`;

  return (
    <RefSection className="mt-8 border-t border-solid border-gray-200 pt-6 pb-4">
      <Img
        src={defaultBrandInfo.logoUrl}
        alt={defaultBrandInfo.name}
        width="60"
        height="20"
        className="object-contain mb-3 opacity-60"
      />
      <EmailMuted className="text-xs">
        © {new Date().getFullYear()} {defaultBrandInfo.name} Inc. All rights reserved.
      </EmailMuted>
      <EmailMuted className="text-xs mt-1">
        {defaultBrandInfo.companyAddress}
      </EmailMuted>
      <EmailMuted className="text-xs mt-3">
        Need help? Contact{" "}
        <Link href={`mailto:${defaultBrandInfo.supportEmail}`} className="text-indigo-600 underline">
          {defaultBrandInfo.supportEmail}
        </Link>{" "}
        or visit our{" "}
        <Link href={defaultBrandInfo.websiteUrl} className="text-indigo-600 underline">
          website
        </Link>.
      </EmailMuted>
      {showUnsubscribe && (
        <EmailMuted className="text-xs mt-4">
          You are receiving this because you signed up for Byroo. If you no longer wish to receive these emails, you can{" "}
          <Link href={unsubscribeUrl} className="text-indigo-600 underline font-semibold">
            unsubscribe here
          </Link>.
        </EmailMuted>
      )}
      <EmailSocialLinks />
    </RefSection>
  );
};
