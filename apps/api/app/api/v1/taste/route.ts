import { GENRES, PLATFORMS } from "@/lib/validation";

/** Options for the registration taste picker. */
export function GET() {
  return Response.json({ platforms: PLATFORMS, genres: GENRES, maxGenres: 5 });
}
