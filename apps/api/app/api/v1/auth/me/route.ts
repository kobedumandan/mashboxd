import { fail, route } from "@/lib/http";
import { PROFILE_COLUMNS, createUserClient, type Profile } from "@/lib/supabase";

export const GET = route(async function GET() {
  const supabase = await createUserClient();
  // getUser() revalidates the token with Supabase and refreshes cookies when needed.
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return fail(401, "unauthenticated", "Not signed in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", data.user.id)
    .single<Profile>();

  return Response.json({ profile }, { headers: { "Cache-Control": "no-store" } });
});
