export const emailConfig = {
  sender: {
    email: process.env.RESEND_SENDER_EMAIL || "noreply@byroo.digital",
    name: process.env.RESEND_SENDER_NAME || "Byroo",
  },
  replyTo: process.env.RESEND_REPLY_TO || "support@byroo.digital",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  supportEmail: "support@byroo.digital",
  brand: {
    name: "Byroo",
    // logoUrl: "https://tjsuogrundsuuvqxydfe.supabase.co/storage/v1/object/public/public-assets/byroo-logo.png",
    logoUrl: "https://byroo.digital/byroo-logo.png",
    colors: {
      primary: "#6366f1",
      secondary: "#10b981",
    },
    socials: {
      twitter: "https://twitter.com/byroo",
      instagram: "https://instagram.com/byroo",
      facebook: "https://facebook.com/byroo",
    },
  },
  // Security token secret for unsubscribe link generation and verification
  tokenSecret: process.env.EMAIL_TOKEN_SECRET || "byroo-email-secret-key-12345-secured",
};

export type EmailConfig = typeof emailConfig;
