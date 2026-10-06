"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormAlert, PasswordField, SubmitButton } from "@/components/auth/fields";
import { PasswordChecklist, meetsPasswordRules } from "@/components/auth/password-rules";
import { ApiError, api } from "@/lib/api";

export function ResetForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const local: Record<string, string> = {};
    if (!meetsPasswordRules(password)) local.password = "Meet all the password rules below.";
    if (confirm !== password) local.confirm = "Passwords don't match.";
    setFields(local);
    if (Object.keys(local).length) return;

    setPending(true);
    setFormError(undefined);
    try {
      const { username } = await api<{ username: string | null }>("/auth/password/reset", {
        method: "POST",
        body: { password },
      });
      router.replace(username ? `/u/${username}` : "/");
      router.refresh();
    } catch (err) {
      const e = err instanceof ApiError ? err : new ApiError(0, "unknown", "Something went wrong.");
      if (e.code === "recovery_required") {
        router.replace("/forgot-password?error=link_expired");
        return;
      }
      setFields(e.fields);
      if (!Object.keys(e.fields).length) setFormError(e.message);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {formError && <FormAlert>{formError}</FormAlert>}
      <PasswordField
        label="New password"
        autoComplete="new-password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fields.password}
        hint={<PasswordChecklist password={password} />}
      />
      <PasswordField
        label="Confirm new password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={fields.confirm}
      />
      <div className="mt-2">
        <SubmitButton pending={pending}>{pending ? "Saving" : "Save new password"}</SubmitButton>
      </div>
    </form>
  );
}
