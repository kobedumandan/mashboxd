"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CheckIcon,
  CircleNotchIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react/ssr";
import { Field, FormAlert, PasswordField, SubmitButton } from "@/components/auth/fields";
import { PasswordChecklist, meetsPasswordRules } from "@/components/auth/password-rules";
import { Stepper } from "@/components/auth/stepper";
import { ApiError, api, type TasteOptions } from "@/lib/api";

const USERNAME = /^[a-z0-9_]{3,20}$/;
const ACCOUNT_FIELDS = ["email", "username", "displayName", "password", "ageConfirmed"];

type Availability = { state: "idle" | "checking" | "available" | "taken"; reason?: string };

export function RegisterFlow({ options }: { options: TasteOptions | null }) {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1>(0);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [account, setAccount] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    ageConfirmed: false,
  });
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>({ state: "idle" });

  const set = (key: keyof typeof account) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setAccount((a) => ({ ...a, [key]: key === "username" ? String(value).toLowerCase() : value }));
    setErrors(({ [key]: _, ...rest }) => rest);
  };

  // Live username check against the API, debounced.
  useEffect(() => {
    const name = account.username;
    if (!USERNAME.test(name)) {
      setAvailability({ state: "idle" });
      return;
    }
    setAvailability({ state: "checking" });
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/auth/username?u=${encodeURIComponent(name)}`, {
          signal: controller.signal,
        });
        const data: { available: boolean; reason?: string } = await res.json();
        setAvailability(data.available ? { state: "available" } : { state: "taken", reason: data.reason });
      } catch {
        if (!controller.signal.aborted) setAvailability({ state: "idle" });
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [account.username]);

  function validateAccount() {
    const next: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(account.email)) next.email = "Enter a valid email address.";
    if (!USERNAME.test(account.username)) next.username = "3 to 20 characters: letters, numbers and underscores.";
    else if (availability.state === "taken") next.username = availability.reason ?? "That username is taken.";
    if (!meetsPasswordRules(account.password)) next.password = "Meet all the password rules below.";
    if (!account.ageConfirmed) next.ageConfirmed = "You must be 16 or older and accept the Terms.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(withTaste: boolean) {
    setPending(true);
    setFormError(undefined);
    try {
      const res = await api<{ sessionActive: boolean }>("/auth/register", {
        method: "POST",
        body: {
          ...account,
          platforms: withTaste ? platforms : [],
          genres: withTaste ? genres : [],
        },
      });
      if (res.sessionActive) {
        router.push("/register/steam");
        router.refresh();
      } else {
        setSentTo(account.email);
        setPending(false);
      }
    } catch (err) {
      const e = err instanceof ApiError ? err : new ApiError(0, "unknown", "Something went wrong.");
      setErrors(e.fields);
      if (Object.keys(e.fields).some((f) => ACCOUNT_FIELDS.includes(f))) setStep(0);
      if (!Object.keys(e.fields).length) setFormError(e.message);
      setPending(false);
    }
  }

  if (sentTo) {
    return (
      <div className="grid gap-6">
        <Stepper current={2} />
        <div className="border border-line bg-surface p-6">
          <EnvelopeSimpleIcon size={28} className="text-accent" />
          <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.03em]">Check your inbox</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We sent a confirmation link to <span className="text-fg">{sentTo}</span>. Open it to activate your
            account. You&apos;ll land right on the Steam step.
          </p>
        </div>
        <p className="text-sm text-dim">
          Wrong address?{" "}
          <button onClick={() => { setSentTo(null); setStep(0); }} className="text-accent hover:underline">
            Go back and fix it.
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <Stepper current={step} />
      {formError && <FormAlert>{formError}</FormAlert>}

      {step === 0 ? (
        <form
          noValidate
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (validateAccount()) setStep(1);
          }}
        >
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
            value={account.email}
            onChange={set("email")}
            error={errors.email}
          />
          <Field
            label="Username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={20}
            value={account.username}
            onChange={set("username")}
            error={errors.username ?? (availability.state === "taken" ? availability.reason : undefined)}
            trailing={
              availability.state === "checking" ? (
                <CircleNotchIcon size={15} className="mr-3 animate-spin text-dim motion-reduce:animate-none" />
              ) : availability.state === "available" ? (
                <CheckCircleIcon size={16} weight="fill" className="mr-3 text-accent" aria-label="Available" />
              ) : null
            }
            hint={
              <>
                Your profile lives at <span className="font-mono text-muted">/u/{account.username || "username"}</span>
              </>
            }
          />
          <Field
            label="Display name (optional)"
            autoComplete="nickname"
            maxLength={40}
            value={account.displayName}
            onChange={set("displayName")}
            error={errors.displayName}
            hint="Shown on your profile. You can change it later."
          />
          <PasswordField
            label="Password"
            autoComplete="new-password"
            value={account.password}
            onChange={set("password")}
            error={errors.password}
            hint={
              <PasswordChecklist password={account.password} />
            }
          />

          <div className="grid gap-2">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={account.ageConfirmed}
                onChange={set("ageConfirmed")}
                aria-invalid={errors.ageConfirmed ? true : undefined}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="mt-0.5 grid size-4 shrink-0 place-items-center border border-line-strong bg-surface text-bg peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
              >
                <CheckIcon size={11} weight="bold" />
              </span>
              <span>
                I am 16 or older and agree to the{" "}
                <Link href="/terms" target="_blank" className="text-fg underline underline-offset-4 hover:text-accent">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="text-fg underline underline-offset-4 hover:text-accent">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.ageConfirmed && <p role="alert" className="pl-7 text-[13px] text-danger">{errors.ageConfirmed}</p>}
          </div>

          <div className="mt-2">
            <SubmitButton pending={false}>Continue</SubmitButton>
          </div>
        </form>
      ) : (
        <TasteStep
          options={options}
          platforms={platforms}
          genres={genres}
          onPlatforms={setPlatforms}
          onGenres={setGenres}
          errors={errors}
          pending={pending}
          onBack={() => setStep(0)}
          onSubmit={submit}
        />
      )}
    </div>
  );
}

function toggle(list: string[], id: string, max = Infinity) {
  if (list.includes(id)) return list.filter((x) => x !== id);
  return list.length >= max ? list : [...list, id];
}

function Chip({ selected, disabled, onClick, children }: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`label inline-flex h-9 items-center gap-1.5 border px-3 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? "border-accent bg-accent-soft text-accent"
          : "border-line-strong text-muted hover:border-muted hover:text-fg"
      }`}
    >
      {selected && <CheckIcon size={11} weight="bold" />}
      {children}
    </button>
  );
}

function TasteStep(props: {
  options: TasteOptions | null;
  platforms: string[];
  genres: string[];
  onPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
  onGenres: React.Dispatch<React.SetStateAction<string[]>>;
  errors: Record<string, string>;
  pending: boolean;
  onBack: () => void;
  onSubmit: (withTaste: boolean) => void;
}) {
  const { options, platforms, genres, errors, pending } = props;
  const max = options?.maxGenres ?? 5;

  return (
    <form
      noValidate
      className="grid gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(true);
      }}
    >
      {options ? (
        <>
          <fieldset>
            <legend className="label text-muted">Where do you play?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {options.platforms.map((p) => (
                <Chip
                  key={p.id}
                  selected={platforms.includes(p.id)}
                  onClick={() => props.onPlatforms((prev) => toggle(prev, p.id))}
                >
                  {p.label}
                </Chip>
              ))}
            </div>
            {errors.platforms && <p role="alert" className="mt-2 text-[13px] text-danger">{errors.platforms}</p>}
          </fieldset>

          <fieldset>
            <legend className="label flex w-full justify-between text-muted">
              <span>Favorite genres</span>
              <span className={genres.length === max ? "text-accent" : "text-dim"}>
                {genres.length}/{max}
              </span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {options.genres.map((g) => {
                const selected = genres.includes(g.id);
                return (
                  <Chip
                    key={g.id}
                    selected={selected}
                    disabled={!selected && genres.length >= max}
                    onClick={() => props.onGenres((prev) => toggle(prev, g.id, max))}
                  >
                    {g.label}
                  </Chip>
                );
              })}
            </div>
            {errors.genres && <p role="alert" className="mt-2 text-[13px] text-danger">{errors.genres}</p>}
          </fieldset>
          <p className="text-sm text-dim">This tunes discovery. You can change it anytime from settings.</p>
        </>
      ) : (
        <div className="halftone border border-dashed border-line-strong p-6 text-sm text-muted">
          We couldn&apos;t load the options right now. Create your account and set your taste later from
          settings.
        </div>
      )}

      <div className="grid gap-3">
        <SubmitButton pending={pending}>{pending ? "Creating account" : "Create account"}</SubmitButton>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={props.onBack}
            disabled={pending}
            className="label inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
          >
            <ArrowLeftIcon size={12} weight="bold" />
            Back
          </button>
          {options && (
            <button
              type="button"
              onClick={() => props.onSubmit(false)}
              disabled={pending}
              className="label text-muted transition-colors hover:text-fg"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
