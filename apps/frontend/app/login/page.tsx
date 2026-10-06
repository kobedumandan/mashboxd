import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentProfile } from "@/lib/server-api";

export const metadata: Metadata = { title: "Log in" };

const errors: Record<string, string> = {
  link_expired: "That confirmation link expired or was already used. Log in, or register again.",
  missing_code: "That link was incomplete. Open the latest email from Mashboxd.",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const { next, error } = await props.searchParams;
  const profile = await getCurrentProfile();
  if (profile) redirect(`/u/${profile.username}`);

  return (
    <AuthShell headline="Welcome" accent="back.">
      <h1 className="text-3xl font-black uppercase tracking-[-0.03em]">Log in</h1>
      <p className="mt-2 text-sm text-muted">Pick up your log where you left it.</p>

      <div className="mt-8">
        <LoginForm
          next={typeof next === "string" ? next : undefined}
          initialError={typeof error === "string" ? errors[error] : undefined}
        />
      </div>

      <p className="mt-8 border-t border-line pt-6 text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-accent underline-offset-4 hover:underline">
          Register.
        </Link>
      </p>
    </AuthShell>
  );
}
