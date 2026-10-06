import type { NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { appUrl, route } from "@/lib/http";
import { createUserClient } from "@/lib/supabase";

const DESTINATIONS: Partial<Record<EmailOtpType, string>> = {
  email: "/register/steam",
  signup: "/register/steam",
  recovery: "/reset-password",
};

/**
 * Landing point for email links (signup confirmation, password recovery).
 * Verifies the token carried in the link itself, so it works on any device,
 * unlike the PKCE code flow, which needs the browser that started it.
 */
export const GET = route(async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const destination = type ? DESTINATIONS[type] : undefined;

  if (!tokenHash || !type || !destination) {
    return Response.redirect(appUrl("/login?error=missing_code"), 303);
  }

  const supabase = await createUserClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error) {
    const failed = type === "recovery" ? "/forgot-password?error=link_expired" : "/login?error=link_expired";
    return Response.redirect(appUrl(failed), 303);
  }

  return Response.redirect(appUrl(destination), 303);
});
