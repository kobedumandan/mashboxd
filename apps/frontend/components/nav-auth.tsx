"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutIcon } from "@phosphor-icons/react/ssr";
import { SteamMark, buttonStyles } from "@/components/ui";
import { api, type Profile } from "@/lib/api";

type State = { status: "loading" } | { status: "guest" } | { status: "user"; profile: Profile };

export function NavAuth() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    api<{ profile: Profile | null }>("/auth/me")
      .then(({ profile }) => !cancelled && setState(profile ? { status: "user", profile } : { status: "guest" }))
      .catch(() => !cancelled && setState({ status: "guest" }));
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    await api("/auth/logout", { method: "POST", body: {} }).catch(() => undefined);
    setState({ status: "guest" });
    router.push("/");
    router.refresh();
  }

  if (state.status === "loading") {
    return <div aria-hidden className="h-9 w-40 animate-pulse bg-surface-2 motion-reduce:animate-none" />;
  }

  if (state.status === "user") {
    const { username, display_name } = state.profile;
    return (
      <div className="flex items-center gap-2">
        <Link
          href={`/u/${username}`}
          className="inline-flex h-9 items-center gap-2 border border-line-strong px-3 text-sm transition-colors hover:border-accent"
        >
          <span className="grid size-5 place-items-center bg-accent text-[11px] font-black uppercase text-bg">
            {(display_name || username)[0]}
          </span>
          <span className="hidden sm:inline">@{username}</span>
        </Link>
        <button
          onClick={logout}
          aria-label="Log out"
          className="grid size-9 place-items-center border border-line-strong text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <SignOutIcon size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="hidden h-9 items-center px-3 text-sm text-muted hover:text-fg sm:inline-flex">
        Log in
      </Link>
      <Link href="/register" className={`${buttonStyles.primary} h-9`}>
        <SteamMark size={14} />
        Connect Steam
      </Link>
    </div>
  );
}
