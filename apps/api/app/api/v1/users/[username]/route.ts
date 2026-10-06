import type { NextRequest } from "next/server";
import { fail, route } from "@/lib/http";
import { createUserClient } from "@/lib/supabase";
import { usernameSchema } from "@/lib/validation";

export interface PublicProfile {
  username: string;
  display_name: string | null;
  favorite_platforms: string[];
  favorite_genres: string[];
  steam_linked: boolean;
  created_at: string;
  is_self: boolean;
}

/** Public profile. Readable by anyone; `is_self` tells the page whether to show owner controls. */
export const GET = route(async function GET(_request: NextRequest, ctx: RouteContext<"/api/v1/users/[username]">) {
  const parsed = usernameSchema.safeParse((await ctx.params).username);
  if (!parsed.success) return fail(404, "not_found", "No user with that name.");

  const supabase = await createUserClient();
  const [{ data: profile }, { data: auth }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, display_name, favorite_platforms, favorite_genres, steam_id, created_at")
      .eq("username", parsed.data)
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);
  if (!profile) return fail(404, "not_found", "No user with that name.");

  const body: PublicProfile = {
    username: profile.username,
    display_name: profile.display_name,
    favorite_platforms: profile.favorite_platforms,
    favorite_genres: profile.favorite_genres,
    steam_linked: Boolean(profile.steam_id),
    created_at: profile.created_at,
    is_self: auth.user?.id === profile.id,
  };
  return Response.json({ profile: body }, { headers: { "Cache-Control": "no-store" } });
});
