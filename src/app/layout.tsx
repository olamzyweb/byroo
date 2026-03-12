import type { Metadata } from "next";
import { env } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  title: "Byroo - Your business space online",
  description: "One link for your work, services, and contact.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
  openGraph: {
    title: "Byroo - Your business space online",
    description: "One link for your work, services, and contact.",
    url: env.appUrl,
    siteName: "Byroo",
    type: "website",
    images: [
      {
        url: "/byroo-logo.png",
        width: 1200,
        height: 630,
        alt: "Byroo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Byroo - Your business space online",
    description: "One link for your work, services, and contact.",
    images: ["/byroo-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
