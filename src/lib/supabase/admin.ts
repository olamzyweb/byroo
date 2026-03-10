import { createClient } from "@supabase/supabase-js";
import { env, requireEnvValue } from "@/lib/config";

export function createAdminClient() {
  return createClient(
    requireEnvValue(env.supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnvValue(env.supabaseServiceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"),
    {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
