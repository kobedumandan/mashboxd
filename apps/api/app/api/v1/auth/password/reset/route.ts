import { fail, readJson, route } from "@/lib/http";
import { createUserClient } from "@/lib/supabase";
import { fieldErrors, resetPasswordSchema } from "@/lib/validation";

const RECOVERY_WINDOW_S = 15 * 60;

/**
 * Sets a new password. Only allowed for a session created from an emailed
 * link in the last 15 minutes, so a stolen ordinary session can't change it.
 * Supabase records recovery-link sessions with the AMR method "otp"; this app
 * has no other OTP sign-in, so "otp" here means "proved access to the email".
 */
export const POST = route(async function POST(request: Request) {
  const body = await readJson(request);
  if (body instanceof Response) return body;

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return fail(422, "validation_failed", "Check the highlighted fields.", fieldErrors(parsed.error));
  }

  const supabase = await createUserClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const amr = (claimsData?.claims.amr ?? []) as ({ method: string; timestamp: number } | string)[];
  const now = Math.floor(Date.now() / 1000);
  // Entries without a timestamp (string form) can't prove recency, so they don't count.
  const recovered = amr.some(
    (m) =>
      typeof m === "object" &&
      (m.method === "otp" || m.method === "recovery") &&
      now - m.timestamp < RECOVERY_WINDOW_S,
  );
  if (!recovered) {
    return fail(403, "recovery_required", "This reset link has expired. Request a new one.");
  }

  const { data, error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === "same_password") {
      return fail(422, error.code, "Choose a password you haven't used here before.", {
        password: "Choose a password you haven't used here before.",
      });
    }
    if (error.code === "weak_password") {
      return fail(422, error.code, error.message, { password: error.message });
    }
    return fail(400, error.code ?? "update_failed", error.message);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", data.user.id)
    .single<{ username: string }>();

  return Response.json({ username: profile?.username ?? null });
});
