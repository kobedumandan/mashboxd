export class ConfigError extends Error {}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new ConfigError(`Missing environment variable ${name}. See apps/api/.env.example.`);
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("SUPABASE_URL");
  },
  get supabasePublishableKey() {
    return required("SUPABASE_PUBLISHABLE_KEY");
  },
  get supabaseSecretKey() {
    return required("SUPABASE_SECRET_KEY");
  },
  get appUrl() {
    return process.env.APP_URL ?? "http://localhost:3000";
  },
};
