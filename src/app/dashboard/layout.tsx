import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { DashboardNav } from "@/components/dashboard/nav";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, Badge, Card, Divider } from "@/components/ui";
import { logoutAction } from "@/app/dashboard/actions";
import { createClient } from "@/lib/supabase/server";
import { MobileSidebarWrapper } from "@/components/dashboard/mobile-sidebar";
import { StorefrontPreviewFAB } from "@/components/dashboard/StorefrontPreviewFAB";
import { getOnboardingProgress } from "@/lib/onboarding";
import { OnboardingWizardBanner } from "@/components/dashboard/onboarding-wizard";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    profileRes,
    linkRes,
    catalogRes,
    serviceRes,
    socialRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, display_name, plan, avatar_url, bio, whatsapp_number")
      .eq("id", user.id)
      .single(),
    supabase.from("links").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("catalog_items").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("social_profiles").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("sync_status", "success"),
  ]);

  let profile = profileRes.data;
  const linkCount = linkRes.count ?? 0;
  const catalogCount = catalogRes.count ?? 0;
  const serviceCount = serviceRes.count ?? 0;
  const socialProofCount = socialRes.count ?? 0;

  if (!profile) {
    const defaultDisplayName = user.user_metadata?.full_name ?? "New Byroo User";
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email ?? "",
        display_name: defaultDisplayName,
        plan: "free",
      })
      .select("id, username, display_name, plan, avatar_url, bio, whatsapp_number")
      .single();

    profile = newProfile;

    try {
      const { inngest } = await import("@/lib/email/queue");
      await inngest.send({
        name: "user/signup",
        data: {
          userId: user.id,
          email: user.email ?? "",
          name: defaultDisplayName,
        },
      });
    } catch (e) {
      console.warn("Failed to trigger onboarding workflow:", e);
    }
  }

  const {
    completionItems,
    completionPercent,
    completedCount,
    totalCount,
    nextItem,
  } = getOnboardingProgress({
    profile,
    linkCount,
    catalogCount,
    serviceCount,
    socialProofCount,
  });

  const publicPath = profile?.username ? `/${profile.username}` : "#";

  const sidebarContent = (
    <>
      <Link href="/" className="inline-flex">
        <BrandLogo />
      </Link>
      <p className="mt-1 text-xs text-[var(--text-soft)]">Creator dashboard</p>

      <div className="mt-4">
        <Card className="flex items-center gap-3 p-3">
          <Avatar name={profile?.display_name ?? "User"} src={profile?.avatar_url} size="sm" />
          <div>
            <p className="text-sm font-medium">{profile?.display_name ?? "User"}</p>
            <Badge tone={profile?.plan === "pro" ? "brand" : "neutral"}>{profile?.plan ?? "free"}</Badge>
          </div>
        </Card>
      </div>

      {completionPercent < 100 && (
        <div className="mt-4">
          <Card className="p-3 bg-[var(--surface-muted)]/50 border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--text-strong)]">Setup Checklist</span>
              <span className="text-[var(--brand)]">{completionPercent}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--surface-muted)] overflow-hidden">
              <div
                className="h-full bg-[var(--brand)] transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-[var(--text-soft)]">
              {completedCount} of {totalCount} completed
            </p>
          </Card>
        </div>
      )}

      <div className="mt-4">
        <DashboardNav />
      </div>

      <Divider />
      <div className="mt-4 space-y-2">
        <Link href={publicPath} className="block rounded-xl px-3 py-2 text-sm text-[var(--text-soft)] hover:bg-[var(--surface-muted)]">
          View public page
        </Link>
        <form action={logoutAction}>
          <SubmitButton variant="ghost" className="w-full justify-start" pendingText="Logging out...">
            Logout
          </SubmitButton>
        </form>
      </div>
    </>
  );

  return (
    <MobileSidebarWrapper sidebar={sidebarContent} completionPercent={completionPercent}>
      {completionPercent < 100 && (
        <OnboardingWizardBanner
          completionItems={completionItems}
          completionPercent={completionPercent}
          completedCount={completedCount}
          totalCount={totalCount}
          nextItem={nextItem}
        />
      )}
      {children}
      {profile?.username && (
        <StorefrontPreviewFAB username={profile.username} />
      )}
    </MobileSidebarWrapper>
  );
}
