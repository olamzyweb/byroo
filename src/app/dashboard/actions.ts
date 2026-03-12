"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  canConnectSocialProofCard,
  canCreateCatalogItem,
  canCreateLink,
  canCreatePortfolioItem,
  canCreateService,
  canCreateTestimonial,
  canHideBranding,
  canUseTheme,
} from "@/lib/feature-gates";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncSocialProfile } from "@/lib/social-profiles/service";
import type { SocialPlatform } from "@/lib/social-profiles/types";
import { isValidSocialUsername, normalizeSocialUsername } from "@/lib/social-profiles/utils";
import { createClient } from "@/lib/supabase/server";
import { ensureHttps, normalizeUsername } from "@/lib/utils";
import type { Plan, ThemeKey } from "@/lib/types";

const MAX_IMAGE_UPLOAD_BYTES = 8 * 1024 * 1024;

function getStoragePathFromPublicUrl(publicUrl: string, bucket: string): string | null {
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex < 0) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

async function cleanupUserMediaVariants(
  admin: ReturnType<typeof createAdminClient>,
  bucket: string,
  userId: string,
  filenamePrefix: string,
  keepPath: string
) {
  const { data } = await admin.storage.from(bucket).list(userId, { limit: 100 });
  if (!data || data.length === 0) {
    return;
  }

  const pathsToDelete = data
    .filter((file) => file.name.startsWith(`${filenamePrefix}.`))
    .map((file) => `${userId}/${file.name}`)
    .filter((path) => path !== keepPath);

  if (pathsToDelete.length > 0) {
    await admin.storage.from(bucket).remove(pathsToDelete);
  }
}

async function requireAuthedContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? "",
      display_name: user.user_metadata?.full_name ?? "New Byroo User",
      plan: "free",
    });

    const { data: newProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return {
      supabase,
      user,
      profile: newProfile as { id: string; plan: Plan; username: string | null },
    };
  }

  return {
    supabase,
    user,
    profile: profile as { id: string; plan: Plan; username: string | null },
  };
}

async function refreshUserPages(username: string | null) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/catalog");
  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard/reviews");
  revalidatePath("/dashboard/business");
  revalidatePath("/dashboard/whatsapp");
  revalidatePath("/dashboard/socials");
  if (username) {
    revalidatePath(`/${username}`);
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function saveProfileAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();

  const schema = z.object({
    displayName: z.string().min(2).max(80),
    bio: z.string().max(280).optional(),
    username: z
      .string()
      .min(3)
      .max(24)
      .regex(/^[a-z0-9_]+$/),
    instagramUrl: z.string().max(200).optional(),
    tiktokUrl: z.string().max(200).optional(),
    facebookUrl: z.string().max(200).optional(),
    trustedBadgeText: z.string().max(120).optional(),
  });

  const parsed = schema.safeParse({
    displayName: String(formData.get("displayName") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    username: normalizeUsername(String(formData.get("username") ?? "")),
    instagramUrl: ensureHttps(String(formData.get("instagramUrl") ?? "").trim()),
    tiktokUrl: ensureHttps(String(formData.get("tiktokUrl") ?? "").trim()),
    facebookUrl: ensureHttps(String(formData.get("facebookUrl") ?? "").trim()),
    trustedBadgeText: String(formData.get("trustedBadgeText") ?? "").trim(),
  });

  if (!parsed.success) {
    redirect("/dashboard/profile?error=Invalid+profile+input");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      bio: parsed.data.bio || null,
      username: parsed.data.username,
      instagram_url: parsed.data.instagramUrl || null,
      tiktok_url: parsed.data.tiktokUrl || null,
      facebook_url: parsed.data.facebookUrl || null,
      trusted_badge_text: parsed.data.trustedBadgeText || null,
      onboarded: true,
    })
    .eq("id", user.id);

  if (error) {
    const code = (error as { code?: string }).code;
    const message = (error as { message?: string }).message ?? "";
    if (code === "23505" || message.includes("profiles_username_key")) {
      redirect("/dashboard/profile?error=This+username+has+already+been+taken");
    }
    redirect(`/dashboard/profile?error=${encodeURIComponent(error.message)}`);
  }

  await refreshUserPages(parsed.data.username || profile.username);
  redirect("/dashboard/profile?message=Profile+updated");
}

export async function saveWhatsAppSettingsAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();
  const whatsappPrefill = String(formData.get("whatsappPrefill") ?? "").trim();

  await supabase
    .from("profiles")
    .update({
      whatsapp_number: whatsappNumber || null,
      whatsapp_prefill: whatsappPrefill || null,
    })
    .eq("id", user.id);

  await refreshUserPages(profile.username);
  redirect("/dashboard/whatsapp?message=WhatsApp+settings+saved");
}

export async function saveBusinessInfoAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();

  await supabase
    .from("profiles")
    .update({
      business_location: String(formData.get("businessLocation") ?? "").trim() || null,
      google_maps_url: ensureHttps(String(formData.get("googleMapsUrl") ?? "").trim()) || null,
      delivery_info: String(formData.get("deliveryInfo") ?? "").trim() || null,
      opening_hours: String(formData.get("openingHours") ?? "").trim() || null,
      nationwide_delivery: String(formData.get("nationwideDelivery") ?? "") === "on",
      in_store_pickup: String(formData.get("inStorePickup") ?? "") === "on",
    })
    .eq("id", user.id);

  await refreshUserPages(profile.username);
  redirect("/dashboard/business?message=Business+info+updated");
}

export async function uploadAvatarAction(formData: FormData) {
  const { user, profile } = await requireAuthedContext();
  const file = formData.get("avatar");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/dashboard/profile?error=Choose+an+image+file");
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    redirect("/dashboard/profile?error=Image+is+too+large.+Max+size+is+8MB");
  }

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/avatar.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage.from("avatars").upload(path, bytes, {
    upsert: true,
    contentType: file.type || "image/jpeg",
  });

  if (uploadError) {
    redirect(`/dashboard/profile?error=${encodeURIComponent(uploadError.message)}`);
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("avatars").getPublicUrl(path);

  await admin.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
  await cleanupUserMediaVariants(admin, "avatars", user.id, "avatar", path);

  await refreshUserPages(profile.username);
  redirect("/dashboard/profile?message=Avatar+updated");
}

export async function uploadHeaderImageAction(formData: FormData) {
  const { user, profile } = await requireAuthedContext();
  const file = formData.get("headerImage");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/dashboard/profile?error=Choose+a+header+image");
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    redirect("/dashboard/profile?error=Header+image+is+too+large.+Max+size+is+8MB");
  }

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/header.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage.from("avatars").upload(path, bytes, {
    upsert: true,
    contentType: file.type || "image/jpeg",
  });

  if (uploadError) {
    redirect(`/dashboard/profile?error=${encodeURIComponent(uploadError.message)}`);
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("avatars").getPublicUrl(path);

  await admin.from("profiles").update({ header_image_url: publicUrl }).eq("id", user.id);
  await cleanupUserMediaVariants(admin, "avatars", user.id, "header", path);
  await refreshUserPages(profile.username);
  redirect("/dashboard/profile?message=Header+image+updated");
}

export async function addLinkAction(formData: FormData) {
  const { supabase, profile, user } = await requireAuthedContext();
  const title = String(formData.get("title") ?? "").trim();
  const url = ensureHttps(String(formData.get("url") ?? "").trim());
  const type = String(formData.get("type") ?? "website").trim();

  if (!title || !url) {
    redirect("/dashboard/links?error=Title+and+URL+are+required");
  }

  const count = await supabase.from("links").select("id", { count: "exact", head: true }).eq("user_id", user.id);

  if (!canCreateLink(profile.plan, count.count ?? 0)) {
    redirect("/dashboard/links?error=Free+plan+limit+reached%2C+upgrade+to+Pro");
  }

  const maxOrder = await supabase
    .from("links")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder = (maxOrder.data?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("links").insert({
    user_id: user.id,
    title,
    url,
    type,
    sort_order: sortOrder,
  });

  if (error) {
    redirect(`/dashboard/links?error=${encodeURIComponent(error.message)}`);
  }

  await refreshUserPages(profile.username);
  redirect("/dashboard/links?message=Link+added");
}

export async function deleteLinkAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const linkId = String(formData.get("linkId") ?? "");
  if (!linkId) {
    redirect("/dashboard/links?error=Missing+link");
  }

  await supabase.from("links").delete().eq("id", linkId).eq("user_id", user.id);
  await refreshUserPages(profile.username);
  redirect("/dashboard/links?message=Link+deleted");
}

export async function toggleLinkVisibilityAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const linkId = String(formData.get("linkId") ?? "");
  const nextValue = String(formData.get("nextValue") ?? "true") === "true";
  if (!linkId) {
    redirect("/dashboard/links?error=Missing+link");
  }

  await supabase.from("links").update({ is_active: nextValue }).eq("id", linkId).eq("user_id", user.id);
  await refreshUserPages(profile.username);
  redirect("/dashboard/links");
}

export async function reorderLinkAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const linkId = String(formData.get("linkId") ?? "");
  const direction = String(formData.get("direction") ?? "up");

  const { data: links } = await supabase
    .from("links")
    .select("id, sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  const list = links ?? [];
  const index = list.findIndex((item) => item.id === linkId);
  if (index < 0) {
    redirect("/dashboard/links?error=Link+not+found");
  }

  const swapWith = direction === "down" ? index + 1 : index - 1;
  if (swapWith < 0 || swapWith >= list.length) {
    redirect("/dashboard/links");
  }

  const current = list[index];
  const target = list[swapWith];

  await supabase.from("links").update({ sort_order: target.sort_order }).eq("id", current.id).eq("user_id", user.id);
  await supabase.from("links").update({ sort_order: current.sort_order }).eq("id", target.id).eq("user_id", user.id);

  await refreshUserPages(profile.username);
  redirect("/dashboard/links");
}

export async function addPortfolioAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const externalUrl = ensureHttps(String(formData.get("externalUrl") ?? "").trim());
  const image = formData.get("image");

  if (!title) {
    redirect("/dashboard/portfolio?error=Title+is+required");
  }

  const count = await supabase
    .from("portfolio_items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (!canCreatePortfolioItem(profile.plan, count.count ?? 0)) {
    redirect("/dashboard/portfolio?error=Free+plan+limit+reached%2C+upgrade+to+Pro");
  }

  let imageUrl: string | null = null;
  if (image instanceof File && image.size > 0) {
    const admin = createAdminClient();
    const ext = image.name.split(".").pop() || "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const bytes = Buffer.from(await image.arrayBuffer());

    const { error: uploadError } = await admin.storage.from("portfolio").upload(path, bytes, {
      upsert: false,
      contentType: image.type || "image/jpeg",
    });

    if (!uploadError) {
      imageUrl = admin.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
    }
  }

  const maxOrder = await supabase
    .from("portfolio_items")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("portfolio_items").insert({
    user_id: user.id,
    title,
    description: description || null,
    external_url: externalUrl || null,
    image_url: imageUrl,
    sort_order: (maxOrder.data?.sort_order ?? -1) + 1,
  });

  await refreshUserPages(profile.username);
  redirect("/dashboard/portfolio?message=Portfolio+item+added");
}

export async function deletePortfolioAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const itemId = String(formData.get("itemId") ?? "");
  if (!itemId) {
    redirect("/dashboard/portfolio?error=Missing+portfolio+item");
  }

  const { data: item } = await supabase
    .from("portfolio_items")
    .select("id, image_url")
    .eq("id", itemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!item) {
    redirect("/dashboard/portfolio?error=Portfolio+item+not+found");
  }

  await supabase.from("portfolio_items").delete().eq("id", itemId).eq("user_id", user.id);

  if (item.image_url) {
    const storagePath = getStoragePathFromPublicUrl(item.image_url, "portfolio");
    if (storagePath) {
      const admin = createAdminClient();
      await admin.storage.from("portfolio").remove([storagePath]);
    }
  }

  await refreshUserPages(profile.username);
  redirect("/dashboard/portfolio?message=Portfolio+item+deleted");
}

export async function addCatalogItemAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const name = String(formData.get("name") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const availabilityStatus = String(formData.get("availabilityStatus") ?? "available").trim();
  const ctaType = String(formData.get("ctaType") ?? "order_whatsapp").trim();
  const ctaText = String(formData.get("ctaText") ?? "Order on WhatsApp").trim();
  const whatsappPrefill = String(formData.get("whatsappPrefill") ?? "").trim();
  const image = formData.get("image");

  if (!name) {
    redirect("/dashboard/catalog?error=Item+name+is+required");
  }

  const count = await supabase.from("catalog_items").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  if (!canCreateCatalogItem(profile.plan, count.count ?? 0)) {
    redirect("/dashboard/catalog?error=Free+plan+catalog+limit+reached");
  }

  let imageUrl: string | null = null;
  if (image instanceof File && image.size > 0) {
    const admin = createAdminClient();
    const ext = image.name.split(".").pop() || "jpg";
    const path = `${user.id}/catalog-${Date.now()}.${ext}`;
    const bytes = Buffer.from(await image.arrayBuffer());

    const { error: uploadError } = await admin.storage.from("catalog").upload(path, bytes, {
      upsert: false,
      contentType: image.type || "image/jpeg",
    });

    if (!uploadError) {
      imageUrl = admin.storage.from("catalog").getPublicUrl(path).data.publicUrl;
    }
  }

  const maxOrder = await supabase
    .from("catalog_items")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("catalog_items").insert({
    user_id: user.id,
    name,
    image_url: imageUrl,
    price: price || null,
    short_description: shortDescription || null,
    category: category || null,
    availability_status: availabilityStatus,
    cta_type: ctaType,
    cta_text: ctaText || "Order on WhatsApp",
    whatsapp_prefill: whatsappPrefill || null,
    sort_order: (maxOrder.data?.sort_order ?? -1) + 1,
  });

  await refreshUserPages(profile.username);
  redirect("/dashboard/catalog?message=Catalog+item+added");
}

export async function deleteCatalogItemAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const itemId = String(formData.get("itemId") ?? "");
  if (!itemId) {
    redirect("/dashboard/catalog?error=Missing+catalog+item");
  }

  const { data: item } = await supabase
    .from("catalog_items")
    .select("id, image_url")
    .eq("id", itemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!item) {
    redirect("/dashboard/catalog?error=Catalog+item+not+found");
  }

  await supabase.from("catalog_items").delete().eq("id", itemId).eq("user_id", user.id);

  if (item.image_url) {
    // Prefer new dedicated catalog bucket, but support legacy catalog images uploaded to portfolio bucket.
    const catalogPath = getStoragePathFromPublicUrl(item.image_url, "catalog");
    const legacyPortfolioPath = getStoragePathFromPublicUrl(item.image_url, "portfolio");
    if (catalogPath || legacyPortfolioPath) {
      const admin = createAdminClient();
      if (catalogPath) {
        await admin.storage.from("catalog").remove([catalogPath]);
      } else if (legacyPortfolioPath) {
        await admin.storage.from("portfolio").remove([legacyPortfolioPath]);
      }
    }
  }

  await refreshUserPages(profile.username);
  redirect("/dashboard/catalog?message=Catalog+item+deleted");
}

export async function addServiceAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startingPrice = String(formData.get("startingPrice") ?? "").trim();
  const ctaText = String(formData.get("ctaText") ?? "Inquire on WhatsApp").trim();
  const ctaType = String(formData.get("ctaType") ?? "whatsapp").trim();
  const ctaUrl = ensureHttps(String(formData.get("ctaUrl") ?? "").trim());
  const whatsappPrefill = String(formData.get("whatsappPrefill") ?? "").trim();
  const availabilityStatus = String(formData.get("availabilityStatus") ?? "available").trim();

  if (!name) {
    redirect("/dashboard/services?error=Service+name+is+required");
  }

  const count = await supabase.from("services").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  if (!canCreateService(profile.plan, count.count ?? 0)) {
    redirect("/dashboard/services?error=Free+plan+service+limit+reached");
  }

  const maxOrder = await supabase
    .from("services")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("services").insert({
    user_id: user.id,
    name,
    description: description || null,
    starting_price: startingPrice || null,
    cta_text: ctaText || "Inquire on WhatsApp",
    cta_type: ctaType,
    cta_url: ctaType === "external" ? ctaUrl || null : null,
    whatsapp_prefill: whatsappPrefill || null,
    availability_status: availabilityStatus,
    sort_order: (maxOrder.data?.sort_order ?? -1) + 1,
  });

  await refreshUserPages(profile.username);
  redirect("/dashboard/services?message=Service+added");
}

export async function deleteServiceAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const serviceId = String(formData.get("serviceId") ?? "");
  await supabase.from("services").delete().eq("id", serviceId).eq("user_id", user.id);
  await refreshUserPages(profile.username);
  redirect("/dashboard/services?message=Service+deleted");
}

export async function addTestimonialAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const customerName = String(formData.get("customerName") ?? "").trim();
  const reviewText = String(formData.get("reviewText") ?? "").trim();
  const rating = Number(String(formData.get("rating") ?? "5"));

  if (!customerName || !reviewText) {
    redirect("/dashboard/reviews?error=Customer+name+and+review+are+required");
  }

  const count = await supabase
    .from("testimonials")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_featured", true);

  if (!canCreateTestimonial(profile.plan, count.count ?? 0)) {
    redirect("/dashboard/reviews?error=Free+plan+review+limit+reached");
  }

  const maxOrder = await supabase
    .from("testimonials")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("testimonials").insert({
    user_id: user.id,
    customer_name: customerName,
    review_text: reviewText,
    rating: Number.isFinite(rating) ? Math.max(1, Math.min(5, rating)) : 5,
    is_featured: true,
    sort_order: (maxOrder.data?.sort_order ?? -1) + 1,
  });

  await refreshUserPages(profile.username);
  redirect("/dashboard/reviews?message=Review+added");
}

export async function deleteTestimonialAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const testimonialId = String(formData.get("testimonialId") ?? "");
  await supabase.from("testimonials").delete().eq("id", testimonialId).eq("user_id", user.id);
  await refreshUserPages(profile.username);
  redirect("/dashboard/reviews?message=Review+deleted");
}

export async function saveAppearanceAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const themeKey = String(formData.get("themeKey") ?? "byroo-light") as ThemeKey;
  const hideBranding = String(formData.get("hideBranding") ?? "") === "on";

  if (!canUseTheme(profile.plan, themeKey)) {
    redirect("/dashboard/appearance?error=Theme+is+Pro-only");
  }

  const nextBrandingHidden = canHideBranding(profile.plan) ? hideBranding : false;

  await supabase
    .from("profiles")
    .update({ theme_key: themeKey, branding_hidden: nextBrandingHidden })
    .eq("id", user.id);

  await refreshUserPages(profile.username);
  redirect("/dashboard/appearance?message=Appearance+updated");
}

export async function saveSocialProfileAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const platform = String(formData.get("platform") ?? "").trim() as SocialPlatform;
  const usernameInput = String(formData.get("username") ?? "");

  if (platform !== "instagram" && platform !== "tiktok") {
    redirect("/dashboard/socials?error=Invalid+social+platform");
  }

  const username = normalizeSocialUsername(platform, usernameInput);
  if (!username || !isValidSocialUsername(platform, username)) {
    redirect("/dashboard/socials?error=Invalid+username+format");
  }

  const { data: existingForPlatform } = await supabase
    .from("social_profiles")
    .select("id")
    .eq("user_id", user.id)
    .eq("platform", platform)
    .maybeSingle();

  const { count: connectedCount } = await supabase
    .from("social_profiles")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const isNewConnection = !existingForPlatform;
  if (isNewConnection && !canConnectSocialProofCard(profile.plan, connectedCount ?? 0)) {
    redirect("/dashboard/socials?error=Plan+limit+reached+for+social+proof+cards");
  }

  await supabase.from("social_profiles").upsert(
    {
      user_id: user.id,
      platform,
      username,
      profile_url: platform === "instagram" ? `https://www.instagram.com/${username}/` : `https://www.tiktok.com/@${username}`,
      sync_status: "syncing",
      sync_error: null,
    },
    { onConflict: "user_id,platform" }
  );

  const syncResult = await syncSocialProfile(user.id, platform, username);
  await refreshUserPages(profile.username);

  if (!syncResult.ok) {
    redirect(`/dashboard/socials?error=${encodeURIComponent(syncResult.error)}`);
  }

  redirect("/dashboard/socials?message=Social+profile+synced");
}

export async function refreshSocialProfileAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const platform = String(formData.get("platform") ?? "").trim() as SocialPlatform;
  if (platform !== "instagram" && platform !== "tiktok") {
    redirect("/dashboard/socials?error=Invalid+social+platform");
  }

  const { data: existing } = await supabase
    .from("social_profiles")
    .select("username")
    .eq("user_id", user.id)
    .eq("platform", platform)
    .maybeSingle();

  if (!existing?.username) {
    redirect("/dashboard/socials?error=No+connected+profile+to+refresh");
  }

  const syncResult = await syncSocialProfile(user.id, platform, existing.username);
  await refreshUserPages(profile.username);

  if (!syncResult.ok) {
    redirect(`/dashboard/socials?error=${encodeURIComponent(syncResult.error)}`);
  }

  redirect("/dashboard/socials?message=Social+profile+refreshed");
}

export async function disconnectSocialProfileAction(formData: FormData) {
  const { supabase, user, profile } = await requireAuthedContext();
  const platform = String(formData.get("platform") ?? "").trim() as SocialPlatform;
  if (platform !== "instagram" && platform !== "tiktok") {
    redirect("/dashboard/socials?error=Invalid+social+platform");
  }

  await supabase
    .from("social_profiles")
    .delete()
    .eq("user_id", user.id)
    .eq("platform", platform);

  await refreshUserPages(profile.username);
  redirect("/dashboard/socials?message=Social+profile+disconnected");
}
