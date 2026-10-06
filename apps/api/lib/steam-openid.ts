// Steam sign-in uses OpenID 2.0. No API key is needed to verify identity.
// https://partner.steamgames.com/doc/features/auth#website

const STEAM_OPENID = "https://steamcommunity.com/openid/login";
const NS = "http://specs.openid.net/auth/2.0";
const CLAIMED_ID = /^https:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/;
const NONCE_TIME = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/;
const MAX_NONCE_AGE_MS = 5 * 60 * 1000;
const MAX_CLOCK_SKEW_MS = 60 * 1000;

/** Cookie that binds a Steam link attempt to the browser that started it. */
export const STEAM_STATE_COOKIE = "mb_steam_state";
export const STEAM_STATE_MAX_AGE = 10 * 60;

export function steamLoginUrl(returnTo: string, realm: string) {
  const params = new URLSearchParams({
    "openid.ns": NS,
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": realm,
    "openid.identity": `${NS}/identifier_select`,
    "openid.claimed_id": `${NS}/identifier_select`,
  });
  return `${STEAM_OPENID}?${params}`;
}

export interface SteamAssertion {
  steamId: string;
  nonce: string;
}

/**
 * Verifies the assertion Steam sent back by replaying it to Steam with
 * mode=check_authentication. Steam signs return_to, so an exact match also
 * proves the `state` we embedded in it is untampered.
 */
export async function verifySteamAssertion(
  query: URLSearchParams,
  expectedReturnTo: string,
): Promise<SteamAssertion | null> {
  if (query.get("openid.mode") !== "id_res") return null;
  if (query.get("openid.op_endpoint") !== STEAM_OPENID) return null;
  if (query.get("openid.return_to") !== expectedReturnTo) return null;

  const match = CLAIMED_ID.exec(query.get("openid.claimed_id") ?? "");
  if (!match) return null;

  // Reject stale or future-dated responses before asking Steam.
  const nonce = query.get("openid.response_nonce") ?? "";
  const issued = NONCE_TIME.exec(nonce);
  if (!issued) return null;
  const age = Date.now() - Date.parse(issued[1]);
  if (age > MAX_NONCE_AGE_MS || age < -MAX_CLOCK_SKEW_MS) return null;

  const body = new URLSearchParams();
  for (const [key, value] of query) {
    if (key.startsWith("openid.")) body.set(key, value);
  }
  body.set("openid.mode", "check_authentication");

  const res = await fetch(STEAM_OPENID, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!res.ok) return null;

  const text = await res.text();
  return /^is_valid\s*:\s*true$/m.test(text) ? { steamId: match[1], nonce } : null;
}
