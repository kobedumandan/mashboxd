import { readJson, route } from "@/lib/http";
import { createUserClient } from "@/lib/supabase";

export const POST = route(async function POST(request: Request) {
  const body = await readJson(request);
  if (body instanceof Response) return body;

  const supabase = await createUserClient();
  await supabase.auth.signOut();
  return new Response(null, { status: 204 });
});
