import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { env } from "@/lib/config";

export const revalidate = 3600; // Cache the sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.appUrl || "https://byroo.app";
  const admin = createAdminClient();

  // Fetch all onboarded profiles
  const { data: profiles } = await admin
    .from("profiles")
    .select("username, created_at")
    .eq("onboarded", true)
    .not("username", "is", null);

  const profileEntries: MetadataRoute.Sitemap = (profiles ?? []).map((profile) => ({
    url: `${baseUrl}/${profile.username}`,
    lastModified: new Date(profile.created_at),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Add static routes
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // You can add other static marketing pages here like /pricing, /about, etc.
  ];

  return [...staticEntries, ...profileEntries];
}
