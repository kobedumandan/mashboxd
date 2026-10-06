import type { NextRequest } from "next/server";
import { appUrl, route } from "@/lib/http";
import { createUserClient } from "@/lib/supabase";

/** Landing point for the email confirmation link. Exchanges the PKCE code for a session. */
export const GET = route(async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return Response.redirect(appUrl("/login?error=missing_code"), 303);

  const supabase = await createUserClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return Response.redirect(appUrl("/login?error=link_expired"), 303);

  return Response.redirect(appUrl("/register/steam"), 303);
});
