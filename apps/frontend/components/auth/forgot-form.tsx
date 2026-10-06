"use client";

import { useState } from "react";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/ssr";
import { Field, FormAlert, SubmitButton } from "@/components/auth/fields";
import { ApiError, api } from "@/lib/api";

export function ForgotForm({ initialError }: { initialError?: string }) {
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState(initialError);
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    setPending(true);
    setFormError(undefined);
    setFields({});
    try {
      await api("/auth/password/forgot", { method: "POST", body: { email } });
      setSentTo(email);
    } catch (err) {
      const e = err instanceof ApiError ? err : new ApiError(0, "unknown", "Something went wrong.");
      setFields(e.fields);
      if (!Object.keys(e.fields).length) setFormError(e.message);
    } finally {
      setPending(false);
    }
  }

  if (sentTo) {
    return (
      <div className="border border-line bg-surface p-6">
        <EnvelopeSimpleIcon size={28} className="text-accent" />
        <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.03em]">Check your inbox</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          If an account uses <span className="text-fg">{sentTo}</span>, a reset link is on its way. It works
          for 1 hour and only once.
        </p>
        <button onClick={() => setSentTo(null)} className="mt-5 text-sm text-accent hover:underline">
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {formError && <FormAlert>{formError}</FormAlert>}
      <Field label="Email" name="email" type="email" autoComplete="email" required autoFocus error={fields.email} />
      <div className="mt-2">
        <SubmitButton pending={pending}>{pending ? "Sending" : "Send reset link"}</SubmitButton>
      </div>
    </form>
  );
}
