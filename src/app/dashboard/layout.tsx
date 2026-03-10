import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";
import { logoutAction } from "@/app/dashboard/actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("id, username, display_name").eq("id", user.id).single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? "",
      display_name: user.user_metadata?.full_name ?? "New Byroo User",
      plan: "free",
    });
  }

  const publicPath = profile?.username ? `/${profile.username}` : "#";

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-6 py-6 md:grid-cols-[240px_1fr] md:px-8">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Link href="/" className="mb-4 block text-lg font-extrabold text-slate-900">
          Byroo
        </Link>
        <DashboardNav />
        <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
          <Link href={publicPath} className="block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
            View public page
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100">
              Logout
            </button>
          </form>
        </div>
      </aside>

      <section>{children}</section>
    </main>
  );
}
