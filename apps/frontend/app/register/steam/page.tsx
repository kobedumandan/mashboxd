import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRightIcon, CheckCircleIcon, LockSimpleIcon } from "@phosphor-icons/react/ssr";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormAlert } from "@/components/auth/fields";
import { Stepper } from "@/components/auth/stepper";
import { SteamMark, buttonStyles } from "@/components/ui";
import { getCurrentProfile } from "@/lib/server-api";

export const metadata: Metadata = { title: "Connect Steam" };

const problems: Record<string, string> = {
  failed: "Steam didn't confirm the sign-in. Try again.",
  taken: "That Steam account is already linked to another Mashboxd profile.",
};

export default async function SteamStepPage(props: PageProps<"/register/steam">) {
  const { status } = await props.searchParams;
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/register/steam");

  const linked = Boolean(profile.steam_id);
  const profileHref = `/u/${profile.username}`;

  return (
    <AuthShell headline="Bring your" accent="library.">
      <h1 className="text-3xl font-black uppercase tracking-[-0.03em]">Connect Steam</h1>
      <p className="mt-2 text-sm text-muted">
        Import your games and playtime. You can skip this and do it later.
      </p>

      <div className="mt-8 grid gap-6">
        <Stepper current={linked ? 3 : 2} />

        {typeof status === "string" && problems[status] && <FormAlert>{problems[status]}</FormAlert>}

        {linked ? (
          <div className="border border-accent/40 bg-accent-soft p-6">
            <CheckCircleIcon size={28} weight="fill" className="text-accent" />
            <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.03em]">Steam linked</h2>
            <p className="mt-2 font-mono text-xs text-muted">SteamID {profile.steam_id}</p>
            <Link href={profileHref} className={`${buttonStyles.primary} mt-6 w-full`}>
              Go to your profile
              <ArrowRightIcon size={14} weight="bold" />
            </Link>
          </div>
        ) : (
          <>
            <ul className="grid gap-px border border-line bg-line">
              {[
                ["Library", "Every game you own on Steam"],
                ["Playtime", "Hours per game, kept in sync"],
                ["Activity", "What you played recently"],
              ].map(([term, desc]) => (
                <li key={term} className="flex items-baseline justify-between gap-4 bg-surface px-4 py-3">
                  <span className="label text-accent">{term}</span>
                  <span className="text-right text-sm text-muted">{desc}</span>
                </li>
              ))}
            </ul>

            {/* Full navigation, not fetch: the API redirects to Steam's sign-in page. */}
            <a href="/api/v1/auth/steam" className={`${buttonStyles.primary} h-11 w-full`}>
              <SteamMark />
              Connect Steam
            </a>
            <p className="flex items-start gap-2 text-[13px] text-dim">
              <LockSimpleIcon size={14} className="mt-px shrink-0 text-accent" />
              You sign in on steamcommunity.com. Mashboxd only receives your public SteamID.
            </p>
            <Link href={profileHref} className="label text-center text-muted transition-colors hover:text-fg">
              Skip for now
            </Link>
          </>
        )}
      </div>
    </AuthShell>
  );
}
