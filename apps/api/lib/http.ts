import { ConfigError, env } from "@/lib/env";

export interface ApiError {
  error: { code: string; message: string; fields?: Record<string, string> };
}

export function fail(status: number, code: string, message: string, fields?: Record<string, string>) {
  return Response.json({ error: { code, message, fields } } satisfies ApiError, { status });
}

/**
 * Guards state-changing requests. Requiring a JSON body forces a CORS preflight
 * for cross-site callers, and the Origin check rejects foreign pages outright.
 * Returns the parsed body, or a Response to send back.
 */
export async function readJson(request: Request): Promise<unknown | Response> {
  const origin = request.headers.get("origin");
  if (origin && origin !== env.appUrl) {
    return fail(403, "forbidden_origin", "Request origin is not allowed.");
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail(415, "unsupported_media_type", "Send a JSON body.");
  }
  try {
    return await request.json();
  } catch {
    return fail(400, "invalid_json", "Request body is not valid JSON.");
  }
}

export const appUrl = (path: string) => new URL(path, env.appUrl).toString();

/** Wraps a Route Handler so failures always come back as JSON errors. */
export function route<Args extends unknown[]>(handler: (...args: Args) => Promise<Response> | Response) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error(err);
      if (err instanceof ConfigError) {
        return fail(503, "not_configured", "Accounts aren't available yet. The server is missing its Supabase configuration.");
      }
      return fail(500, "internal_error", "Something went wrong on our side. Try again.");
    }
  };
}
