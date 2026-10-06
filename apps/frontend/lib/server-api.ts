import { cookies } from "next/headers";
import type { Profile, PublicProfile, TasteOptions } from "@/lib/api";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

/** Server-side call to the API, forwarding the visitor's cookies. */
async function serverApi<T>(path: string): Promise<T | null> {
  const cookieHeader = (await cookies()).toString();
  try {
    const res = await fetch(`${API_URL}/api/v1${path}`, {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function getCurrentProfile() {
  return (await serverApi<{ profile: Profile | null }>("/auth/me"))?.profile ?? null;
}

export function getTasteOptions() {
  return serverApi<TasteOptions>("/taste");
}

export async function getPublicProfile(username: string) {
  return (await serverApi<{ profile: PublicProfile }>(`/users/${encodeURIComponent(username)}`))?.profile ?? null;
}
