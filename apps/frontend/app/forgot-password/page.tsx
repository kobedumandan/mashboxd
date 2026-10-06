import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forgot-form";

export const metadata: Metadata = { title: "Reset password" };

const errors: Record<string, string> = {
  link_expired: "That reset link expired or was already used. Request a new one below.",
};

export default async function ForgotPasswordPage(props: PageProps<"/forgot-password">) {
  const { error } = await props.searchParams;

  return (
    <AuthShell headline="Lost your" accent="save?">
      <h1 className="text-3xl font-black uppercase tracking-[-0.03em]">Reset password</h1>
      <p className="mt-2 text-sm text-muted">Enter your account email and we&apos;ll send you a reset link.</p>

      <div className="mt-8">
        <ForgotForm initialError={typeof error === "string" ? errors[error] : undefined} />
      </div>

      <p className="mt-8 border-t border-line pt-6 text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-accent underline-offset-4 hover:underline">
          Log in.
        </Link>
      </p>
    </AuthShell>
  );
}
