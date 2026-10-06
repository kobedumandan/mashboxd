import type { NextRequest } from "next/server";
import { route } from "@/lib/http";
import { createUserClient } from "@/lib/supabase";
import { usernameSchema } from "@/lib/validation";

/** GET /api/v1/auth/username?u=name  ->  { available, reason? } */
export const GET = route(async function GET(request: NextRequest) {
  const parsed = usernameSchema.safeParse(request.nextUrl.searchParams.get("u") ?? "");
  if (!parsed.success) {
    return Response.json({ available: false, reason: parsed.error.issues[0].message });
  }

  const supabase = await createUserClient();
  const { data } = await supabase.from("profiles").select("id").eq("username", parsed.data).maybeSingle();

  return Response.json(data ? { available: false, reason: "That username is taken." } : { available: true });
});
