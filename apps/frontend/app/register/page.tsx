import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterFlow } from "@/components/auth/register-flow";
import { getCurrentProfile, getTasteOptions } from "@/lib/server-api";

export const metadata: Metadata = { title: "Register" };

export default async function RegisterPage() {
  const [profile, options] = await Promise.all([getCurrentProfile(), getTasteOptions()]);
  if (profile) redirect(`/u/${profile.username}`);

  return (
    <AuthShell headline="Start your" accent="log.">
      <h1 className="text-3xl font-black uppercase tracking-[-0.03em]">Register</h1>
      <p className="mt-2 text-sm text-muted">Three quick steps. Only the first one is required.</p>

      <div className="mt-8">
        <RegisterFlow options={options} />
      </div>

      <p className="mt-8 border-t border-line pt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent underline-offset-4 hover:underline">
          Log in.
        </Link>
      </p>
    </AuthShell>
  );
}
