import { fail, readJson, route } from "@/lib/http";
import { PROFILE_COLUMNS, createAdminClient, createUserClient, type Profile } from "@/lib/supabase";
import { fieldErrors, loginSchema, usernameSchema } from "@/lib/validation";

const INVALID = "Email/username or password is incorrect.";

/** Resolves a username to its account email. Server-side only; the email never leaves the API. */
async function emailForUsername(username: string): Promise<string | null> {
  const parsed = usernameSchema.safeParse(username);
  if (!parsed.success) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("id").eq("username", parsed.data).maybeSingle();
  if (!profile) return null;

  const { data } = await admin.auth.admin.getUserById(profile.id);
  return data.user?.email ?? null;
}

export const POST = route(async function POST(request: Request) {
  const body = await readJson(request);
  if (body instanceof Response) return body;

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return fail(422, "validation_failed", "Check the highlighted fields.", fieldErrors(parsed.error));
  }
  const { identifier, password } = parsed.data;

  const email = identifier.includes("@") ? identifier : await emailForUsername(identifier);
  // Unknown username gets the same answer as a wrong password, so accounts can't be enumerated.
  if (!email) return fail(401, "invalid_credentials", INVALID);

  const supabase = await createUserClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return fail(403, error.code, "Confirm your email first. Check your inbox for the link.");
    }
    if (error.status === 429) {
      return fail(429, "rate_limited", "Too many attempts. Try again in a minute.");
    }
    return fail(401, "invalid_credentials", INVALID);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", data.user.id)
    .single<Profile>();

  return Response.json({ profile });
});
