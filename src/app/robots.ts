import { MetadataRoute } from "next";
import { env } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.appUrl || "https://byroo.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/dashboard/", "/admin/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
