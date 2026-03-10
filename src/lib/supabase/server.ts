import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, requireEnvValue } from "@/lib/config";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnvValue(env.supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnvValue(env.supabaseAnonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Cookie writes may fail from server components; auth still works.
          }
        });
      },
    },
  });
}
