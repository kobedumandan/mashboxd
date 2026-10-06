import { z } from "zod";

export const PLATFORMS = [
  { id: "steam", label: "Steam" },
  { id: "playstation", label: "PlayStation" },
  { id: "xbox", label: "Xbox" },
  { id: "nintendo", label: "Nintendo" },
  { id: "epic", label: "Epic Games" },
  { id: "gog", label: "GOG" },
  { id: "mobile", label: "Mobile" },
] as const;

export const GENRES = [
  { id: "action", label: "Action" },
  { id: "rpg", label: "RPG" },
  { id: "soulslike", label: "Soulslike" },
  { id: "roguelike", label: "Roguelike" },
  { id: "metroidvania", label: "Metroidvania" },
  { id: "platformer", label: "Platformer" },
  { id: "shooter", label: "Shooter" },
  { id: "strategy", label: "Strategy" },
  { id: "simulation", label: "Simulation" },
  { id: "survival", label: "Survival" },
  { id: "horror", label: "Horror" },
  { id: "puzzle", label: "Puzzle" },
  { id: "narrative", label: "Narrative" },
  { id: "fighting", label: "Fighting" },
  { id: "racing", label: "Racing" },
  { id: "sports", label: "Sports" },
] as const;

const platformIds = PLATFORMS.map((p) => p.id) as [string, ...string[]];
const genreIds = GENRES.map((g) => g.id) as [string, ...string[]];

/** Bump when the Terms change; users who accepted an older version get asked again. */
export const TERMS_VERSION = "2026-10-06";
export const MIN_AGE = 16;

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,20}$/, "3 to 20 characters: letters, numbers and underscores.");

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Use at most 72 characters.")
  .regex(/[a-zA-Z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address."));

export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  displayName: z.string().trim().max(40, "Keep it under 40 characters.").optional().default(""),
  password: passwordSchema,
  ageConfirmed: z.literal(true, { error: `You must be ${MIN_AGE} or older and accept the Terms.` }),
  platforms: z.array(z.enum(platformIds)).max(platformIds.length).default([]),
  genres: z.array(z.enum(genreIds)).max(5, "Pick up to 5 genres.").default([]),
});

export const loginSchema = z.object({
  identifier: z.string().trim().toLowerCase().min(1, "Enter your email or username."),
  password: z.string().min(1, "Enter your password."),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });
export const resetPasswordSchema = z.object({ password: passwordSchema });

export type RegisterInput = z.infer<typeof registerSchema>;

/** Flattens zod issues into `{ field: firstMessage }` for inline form errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
