import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * User-scoped client. Reads and refreshes the session from the request cookies
 * and writes updated auth cookies onto the Route Handler response.
 */
export async function createUserClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, { ...options, httpOnly: true, sameSite: "lax" });
        }
      },
    },
  });
}

/** Privileged client. Bypasses RLS, so only use it after the caller is verified. */
export function createAdminClient() {
  return createClient(env.supabaseUrl, env.supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  favorite_platforms: string[];
  favorite_genres: string[];
  steam_id: string | null;
  created_at: string;
}

export const PROFILE_COLUMNS =
  "id, username, display_name, favorite_platforms, favorite_genres, steam_id, created_at";
