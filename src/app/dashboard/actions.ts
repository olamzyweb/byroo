"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { canCreateLink, canCreatePortfolioItem, canHideBranding, canUseTheme } from "@/lib/feature-gates";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ensureHttps, normalizeUsername } from "@/lib/utils";
import type { Plan, ThemeKey } from "@/lib/types";

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
    return { supabase, user, profile: newProfile as { id: string; plan: Plan } };
  }

  return { supabase, user, profile: profile as { id: string; plan: Plan } };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function saveProfileAction(formData: FormData) {
  const { supabase, user } = await requireAuthedContext();

  const schema = z.object({
    displayName: z.string().min(2).max(80),
    bio: z.string().max(280).optional(),
    username: z
      .string()
      .min(3)
      .max(24)
      .regex(/^[a-z0-9_]+$/),
    whatsappNumber: z.string().max(20).optional(),
    whatsappPrefill: z.string().max(200).optional(),
  });

  const parsed = schema.safeParse({
    displayName: String(formData.get("displayName") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    username: normalizeUsername(String(formData.get("username") ?? "")),
    whatsappNumber: String(formData.get("whatsappNumber") ?? "").trim(),
    whatsappPrefill: String(formData.get("whatsappPrefill") ?? "").trim(),
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
      whatsapp_number: parsed.data.whatsappNumber || null,
      whatsapp_prefill: parsed.data.whatsappPrefill || null,
      onboarded: true,
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/dashboard/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/profile`);
  revalidatePath(`/${parsed.data.username}`);
  redirect("/dashboard/profile?message=Profile+updated");
}

export async function uploadAvatarAction(formData: FormData) {
  const { user } = await requireAuthedContext();
  const file = formData.get("avatar");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/dashboard/profile?error=Choose+an+image+file");
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

  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile?message=Avatar+updated");
}

export async function addLinkAction(formData: FormData) {
  const { supabase, profile, user } = await requireAuthedContext();
  const title = String(formData.get("title") ?? "").trim();
  const url = ensureHttps(String(formData.get("url") ?? "").trim());
  const type = String(formData.get("type") ?? "website").trim();

  if (!title || !url) {
    redirect("/dashboard/links?error=Title+and+URL+are+required");
  }

  const count = await supabase
    .from("links")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

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

  revalidatePath("/dashboard/links");
  redirect("/dashboard/links?message=Link+added");
}

export async function deleteLinkAction(formData: FormData) {
  const { supabase, user } = await requireAuthedContext();
  const linkId = String(formData.get("linkId") ?? "");
  if (!linkId) {
    redirect("/dashboard/links?error=Missing+link");
  }

  await supabase.from("links").delete().eq("id", linkId).eq("user_id", user.id);
  revalidatePath("/dashboard/links");
  redirect("/dashboard/links?message=Link+deleted");
}

export async function reorderLinkAction(formData: FormData) {
  const { supabase, user } = await requireAuthedContext();
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

  revalidatePath("/dashboard/links");
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

  revalidatePath("/dashboard/portfolio");
  redirect("/dashboard/portfolio?message=Portfolio+item+added");
}

export async function deletePortfolioAction(formData: FormData) {
  const { supabase, user } = await requireAuthedContext();
  const itemId = String(formData.get("itemId") ?? "");
  await supabase.from("portfolio_items").delete().eq("id", itemId).eq("user_id", user.id);
  revalidatePath("/dashboard/portfolio");
  redirect("/dashboard/portfolio?message=Portfolio+item+deleted");
}

export async function addServiceAction(formData: FormData) {
  const { supabase, user } = await requireAuthedContext();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startingPrice = String(formData.get("startingPrice") ?? "").trim();
  const ctaText = String(formData.get("ctaText") ?? "Contact me").trim();
  const ctaUrl = ensureHttps(String(formData.get("ctaUrl") ?? "").trim());

  if (!name) {
    redirect("/dashboard/services?error=Service+name+is+required");
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
    cta_text: ctaText || "Contact me",
    cta_url: ctaUrl || null,
    sort_order: (maxOrder.data?.sort_order ?? -1) + 1,
  });

  revalidatePath("/dashboard/services");
  redirect("/dashboard/services?message=Service+added");
}

export async function deleteServiceAction(formData: FormData) {
  const { supabase, user } = await requireAuthedContext();
  const serviceId = String(formData.get("serviceId") ?? "");
  await supabase.from("services").delete().eq("id", serviceId).eq("user_id", user.id);
  revalidatePath("/dashboard/services");
  redirect("/dashboard/services?message=Service+deleted");
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

  revalidatePath("/dashboard/appearance");
  redirect("/dashboard/appearance?message=Appearance+updated");
}
