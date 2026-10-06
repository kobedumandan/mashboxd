import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { appUrl, route } from "@/lib/http";
import { STEAM_STATE_COOKIE, STEAM_STATE_MAX_AGE, steamLoginUrl } from "@/lib/steam-openid";
import { createUserClient } from "@/lib/supabase";

/** Starts linking Steam to the signed-in account. Browser navigation, not fetch. */
export const GET = route(async function GET() {
  const supabase = await createUserClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return Response.redirect(appUrl("/login?next=/register/steam"), 303);

  const state = crypto.randomUUID();
  (await cookies()).set(STEAM_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.appUrl.startsWith("https://"),
    path: "/api/v1/auth/steam",
    maxAge: STEAM_STATE_MAX_AGE,
  });

  const returnTo = appUrl(`/api/v1/auth/steam/callback?state=${state}`);
  return Response.redirect(steamLoginUrl(returnTo, env.appUrl), 303);
});
