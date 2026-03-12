"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getBillingProvider } from "@/lib/billing";
import { requireAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

async function writeAuditLog(actorUserId: string, action: string, targetUserId: string, metadata: Record<string, unknown>) {
  const admin = createAdminClient();
  await admin.from("admin_audit_logs").insert({
    actor_user_id: actorUserId,
    action,
    target_user_id: targetUserId,
    metadata,
  });
}

function parseReturnTo(formData: FormData, fallback: string) {
  const value = String(formData.get("returnTo") ?? "").trim();
  if (!value.startsWith("/admin")) {
    return fallback;
  }
  return value;
}

export async function setUserPlanAction(formData: FormData) {
  const adminUser = await requireAdminUser();
  const targetUserId = String(formData.get("targetUserId") ?? "").trim();
  const plan = String(formData.get("plan") ?? "").trim();
  const returnTo = parseReturnTo(formData, "/admin/users");

  if (!targetUserId || (plan !== "free" && plan !== "pro")) {
    redirect(`${returnTo}?error=Invalid+plan+update+request`);
  }

  const admin = createAdminClient();
  await admin.from("profiles").update({ plan }).eq("id", targetUserId);
  await writeAuditLog(adminUser.id, "set_plan", targetUserId, { plan });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/subscriptions");
  redirect(`${returnTo}?message=Plan+updated`);
}

export async function setAdminAccessAction(formData: FormData) {
  const adminUser = await requireAdminUser();
  const targetUserId = String(formData.get("targetUserId") ?? "").trim();
  const mode = String(formData.get("mode") ?? "").trim();
  const returnTo = parseReturnTo(formData, "/admin/users");

  if (!targetUserId || (mode !== "grant" && mode !== "revoke")) {
    redirect(`${returnTo}?error=Invalid+admin+access+request`);
  }

  const admin = createAdminClient();
  if (mode === "grant") {
    await admin.from("admin_users").upsert({ user_id: targetUserId }, { onConflict: "user_id" });
  } else {
    await admin.from("admin_users").delete().eq("user_id", targetUserId);
  }

  await writeAuditLog(adminUser.id, mode === "grant" ? "grant_admin_access" : "revoke_admin_access", targetUserId, {});

  revalidatePath("/admin/users");
  redirect(`${returnTo}?message=Admin+access+updated`);
}

export async function syncPaystackSubscriptionAction(formData: FormData) {
  const adminUser = await requireAdminUser();
  const targetUserId = String(formData.get("targetUserId") ?? "").trim();
  const customerCode = String(formData.get("customerCode") ?? "").trim() || null;
  const returnTo = parseReturnTo(formData, "/admin/subscriptions");

  if (!targetUserId) {
    redirect(`${returnTo}?error=Missing+target+user`);
  }

  const provider = getBillingProvider();
  if (!provider.syncSubscriptionForUser) {
    redirect(`${returnTo}?error=Provider+sync+is+not+supported`);
  }

  await provider.syncSubscriptionForUser({ userId: targetUserId, customerCode });
  await writeAuditLog(adminUser.id, "sync_subscription", targetUserId, { customerCode });

  revalidatePath("/admin/subscriptions");
  redirect(`${returnTo}?message=Subscription+sync+requested`);
}
