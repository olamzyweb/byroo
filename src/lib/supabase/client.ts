"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env, requireEnvValue } from "@/lib/config";

export function createClient() {
  return createBrowserClient(
    requireEnvValue(env.supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnvValue(env.supabaseAnonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}
