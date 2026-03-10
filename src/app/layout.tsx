import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Byroo - Your business space online",
  description: "One link for your work, services, and contact.",
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
