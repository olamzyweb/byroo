import type { Metadata } from "next";
import { env } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  title: "Byroo - Your business space online",
  description: "One link for your work, services, and contact.",
  openGraph: {
    title: "Byroo - Your business space online",
    description: "One link for your work, services, and contact.",
    url: env.appUrl,
    siteName: "Byroo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Byroo - Your business space online",
    description: "One link for your work, services, and contact.",
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
