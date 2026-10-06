import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { appUrl, route } from "@/lib/http";
import { STEAM_STATE_COOKIE, verifySteamAssertion } from "@/lib/steam-openid";
import { createAdminClient, createUserClient } from "@/lib/supabase";

const done = (status: string) => Response.redirect(appUrl(`/register/steam?status=${status}`), 303);

export const GET = route(async function GET(request: NextRequest) {
  const supabase = await createUserClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return Response.redirect(appUrl("/login?next=/register/steam"), 303);

  // The attempt must have started in this browser (blocks forced linking).
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STEAM_STATE_COOKIE)?.value;
  cookieStore.delete({ name: STEAM_STATE_COOKIE, path: "/api/v1/auth/steam" });
  const state = request.nextUrl.searchParams.get("state");
  if (!expectedState || state !== expectedState) return done("failed");

  const assertion = await verifySteamAssertion(
    request.nextUrl.searchParams,
    appUrl(`/api/v1/auth/steam/callback?state=${state}`),
  );
  if (!assertion) return done("failed");

  const admin = createAdminClient();

  // Each Steam response is single-use (blocks replay).
  const { error: nonceError } = await admin.from("steam_openid_nonces").insert({ nonce: assertion.nonce });
  if (nonceError) return done("failed");
  await admin
    .from("steam_openid_nonces")
    .delete()
    .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  // steam_id is not user-writable under RLS, so the verified write goes through the admin client.
  const { error } = await admin.from("profiles").update({ steam_id: assertion.steamId }).eq("id", data.user.id);

  if (error) return done(error.code === "23505" ? "taken" : "failed");
  return done("linked");
});
