import { appUrl, fail, readJson, route } from "@/lib/http";
import { createUserClient } from "@/lib/supabase";
import { TERMS_VERSION, fieldErrors, registerSchema } from "@/lib/validation";

export const POST = route(async function POST(request: Request) {
  const body = await readJson(request);
  if (body instanceof Response) return body;

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return fail(422, "validation_failed", "Check the highlighted fields.", fieldErrors(parsed.error));
  }
  const input = parsed.data;
  const supabase = await createUserClient();

  // Friendly early check. The unique constraint is still the source of truth.
  const { data: taken } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", input.username)
    .maybeSingle();
  if (taken) {
    return fail(409, "username_taken", "That username is taken.", { username: "That username is taken." });
  }

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: appUrl("/api/v1/auth/callback"),
      data: {
        username: input.username,
        display_name: input.displayName,
        favorite_platforms: input.platforms,
        favorite_genres: input.genres,
        terms_accepted_at: new Date().toISOString(),
        terms_version: TERMS_VERSION,
      },
    },
  });

  if (error) {
    if (error.code === "weak_password") {
      return fail(422, error.code, error.message, { password: error.message });
    }
    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return fail(409, error.code, "An account with that email already exists.", {
        email: "An account with that email already exists.",
      });
    }
    // The profile trigger raises on a username race; Supabase reports it generically.
    if (error.message.toLowerCase().includes("database error")) {
      return fail(409, "username_taken", "That username is taken.", { username: "That username is taken." });
    }
    if (error.status === 429) {
      return fail(429, "rate_limited", "Too many attempts. Try again in a minute.");
    }
    return fail(400, error.code ?? "signup_failed", error.message);
  }

  return Response.json(
    {
      user: { id: data.user?.id, username: input.username },
      // False when Supabase requires email confirmation before the first sign-in.
      sessionActive: Boolean(data.session),
    },
    { status: 201 },
  );
});
