// Thin client for the Mashboxd API. All calls go through the /api rewrite.

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  favorite_platforms: string[];
  favorite_genres: string[];
  steam_id: string | null;
  created_at: string;
}

export interface PublicProfile {
  username: string;
  display_name: string | null;
  favorite_platforms: string[];
  favorite_genres: string[];
  steam_linked: boolean;
  created_at: string;
  is_self: boolean;
}

export interface TasteOption {
  id: string;
  label: string;
}

export interface TasteOptions {
  platforms: TasteOption[];
  genres: TasteOption[];
  maxGenres: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/v1${path}`, {
      method: init?.method ?? "GET",
      headers: init?.body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "network", "Can't reach Mashboxd right now. Check your connection.");
  }

  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = data?.error;
    throw new ApiError(
      res.status,
      err?.code ?? "unknown",
      err?.message ?? "Something went wrong. Try again.",
      err?.fields,
    );
  }
  return data as T;
}
