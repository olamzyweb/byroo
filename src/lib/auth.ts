import { redirect } from "next/navigation";
import type { Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function getCurrentProfile(userId?: string): Promise<Profile | null> {
  const supabase = await createClient();
  const targetUserId = userId ?? (await requireUser()).id;
  const { data } = await supabase.from("profiles").select("*").eq("id", targetUserId).single();
  return (data as Profile | null) ?? null;
}
