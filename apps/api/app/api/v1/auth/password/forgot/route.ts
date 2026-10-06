import { appUrl, fail, readJson, route } from "@/lib/http";
import { createUserClient } from "@/lib/supabase";
import { fieldErrors, forgotPasswordSchema } from "@/lib/validation";

/** Sends a password reset email. Always answers the same way, so emails can't be probed. */
export const POST = route(async function POST(request: Request) {
  const body = await readJson(request);
  if (body instanceof Response) return body;

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return fail(422, "validation_failed", "Check the highlighted fields.", fieldErrors(parsed.error));
  }

  const supabase = await createUserClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: appUrl("/reset-password"),
  });

  if (error?.status === 429) {
    return fail(429, "rate_limited", "Too many requests. Wait a minute and try again.");
  }
  if (error) console.error("resetPasswordForEmail failed", error.code, error.message);

  return Response.json({ sent: true });
});
