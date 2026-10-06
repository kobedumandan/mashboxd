"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, FormAlert, PasswordField, SubmitButton } from "@/components/auth/fields";
import { ApiError, api, type Profile } from "@/lib/api";

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState(initialError);
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setFormError(undefined);
    setFields({});

    try {
      const { profile } = await api<{ profile: Profile | null }>("/auth/login", {
        method: "POST",
        body: { identifier: form.get("identifier"), password: form.get("password") },
      });
      const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : undefined;
      router.replace(safeNext ?? (profile ? `/u/${profile.username}` : "/"));
      router.refresh();
    } catch (err) {
      const e = err instanceof ApiError ? err : new ApiError(0, "unknown", "Something went wrong.");
      setFields(e.fields);
      if (!Object.keys(e.fields).length) setFormError(e.message);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {formError && <FormAlert>{formError}</FormAlert>}
      <Field
        label="Email or username"
        name="identifier"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        required
        autoFocus
        error={fields.identifier}
      />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="current-password"
        required
        error={fields.password}
        hint={
          <Link href="/forgot-password" className="transition-colors hover:text-accent">
            Forgot your password?
          </Link>
        }
      />
      <div className="mt-2">
        <SubmitButton pending={pending}>{pending ? "Logging in" : "Log in"}</SubmitButton>
      </div>
    </form>
  );
}
