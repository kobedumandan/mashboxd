import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/reset-form";
import { getCurrentProfile } from "@/lib/server-api";

export const metadata: Metadata = { title: "Choose a new password" };

/** Reached from the reset email via /api/v1/auth/confirm, which signs the user in for recovery. */
export default async function ResetPasswordPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/forgot-password?error=link_expired");

  return (
    <AuthShell headline="New" accent="password.">
      <h1 className="text-3xl font-black uppercase tracking-[-0.03em]">Choose a new password</h1>
      <p className="mt-2 text-sm text-muted">
        For <span className="text-fg">@{profile.username}</span>. You&apos;ll stay signed in afterwards.
      </p>
      <div className="mt-8">
        <ResetForm />
      </div>
    </AuthShell>
  );
}
