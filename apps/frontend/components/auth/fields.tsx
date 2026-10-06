"use client";

import { useId, useState } from "react";
import { CircleNotchIcon, EyeIcon, EyeSlashIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr";

const inputBase =
  "h-11 w-full border bg-surface px-3 text-[15px] text-fg outline-none transition-colors placeholder:text-dim focus:border-accent";

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  trailing?: React.ReactNode;
}

/** Label above, input, then hint or error below. */
export function Field({ label, hint, error, trailing, className = "", ...input }: FieldProps) {
  const id = useId();
  const describedBy = `${id}-desc`;
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="label text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={hint || error ? describedBy : undefined}
          className={`${inputBase} ${error ? "border-danger" : "border-line-strong"} ${trailing ? "pr-11" : ""} ${className}`}
          {...input}
        />
        {trailing && <div className="absolute inset-y-0 right-0 flex items-center pr-1">{trailing}</div>}
      </div>
      {error ? (
        <p id={describedBy} role="alert" className="flex items-start gap-1.5 text-[13px] text-danger">
          <WarningCircleIcon size={14} className="mt-px shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <div id={describedBy} className="text-[13px] text-dim">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

export function PasswordField(props: Omit<FieldProps, "type" | "trailing">) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="grid size-9 place-items-center text-dim transition-colors hover:text-accent"
        >
          {visible ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />}
        </button>
      }
    />
  );
}

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-2 border border-danger/40 bg-danger/10 px-3 py-2.5 text-sm text-danger">
      <WarningCircleIcon size={16} className="mt-px shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 bg-fg text-sm font-medium text-bg transition-[background-color,transform] duration-200 hover:bg-accent active:translate-y-px disabled:cursor-wait disabled:opacity-70"
    >
      {pending && <CircleNotchIcon size={15} className="animate-spin motion-reduce:animate-none" />}
      {children}
    </button>
  );
}
