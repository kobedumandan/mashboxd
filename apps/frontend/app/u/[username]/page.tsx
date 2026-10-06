import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarBlankIcon, GameControllerIcon, NotePencilIcon } from "@phosphor-icons/react/ssr";
import { CopyLinkButton } from "@/components/profile/copy-link-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Container, SteamMark, buttonStyles } from "@/components/ui";
import { getPublicProfile, getTasteOptions } from "@/lib/server-api";

export async function generateMetadata(props: PageProps<"/u/[username]">): Promise<Metadata> {
  const { username } = await props.params;
  return { title: `@${username}` };
}

// Library, ratings and reviews arrive in later phases; until then these read zero.
const stats = ["Games", "Hours logged", "Completed", "Reviews", "Avg rating"] as const;

export default async function ProfilePage(props: PageProps<"/u/[username]">) {
  const { username } = await props.params;
  const [profile, taste] = await Promise.all([getPublicProfile(username), getTasteOptions()]);
  if (!profile) notFound();

  const name = profile.display_name || profile.username;
  const joined = new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const labelFor = (id: string) =>
    [...(taste?.platforms ?? []), ...(taste?.genres ?? [])].find((o) => o.id === id)?.label ?? id;
  const tasteTags = [...profile.favorite_platforms, ...profile.favorite_genres];

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* Identity */}
        <section className="border-b border-line">
          <Container className="grid grid-cols-[minmax(0,1fr)] gap-8 py-10 md:grid-cols-[auto_1fr_auto] md:items-end md:py-14">
            <div
              aria-hidden
              className="grid size-24 place-items-center border border-line-strong bg-surface text-5xl font-black uppercase text-accent md:size-[120px] md:text-6xl"
            >
              {name[0]}
            </div>
            <div className="min-w-0">
              <p className="label text-accent">@{profile.username}</p>
              <h1 className="mt-2 truncate text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em]">
                {name}
              </h1>
              <div className="label mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-dim">
                {profile.steam_linked && (
                  <span className="flex items-center gap-1.5">
                    <SteamMark size={13} className="text-accent" />
                    Steam linked
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <CalendarBlankIcon size={13} className="text-accent" />
                  Member since {joined}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.is_self && !profile.steam_linked && (
                <Link href="/register/steam" className={buttonStyles.primary}>
                  <SteamMark />
                  Connect Steam
                </Link>
              )}
              <CopyLinkButton />
            </div>
          </Container>

          <Container className="px-0 md:px-8">
            <dl className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-5 md:border-x">
              {stats.map((label, i) => (
                <div key={label} className={`bg-bg px-4 py-5 md:px-6 ${i === 0 ? "col-span-2 sm:col-span-1" : ""}`}>
                  <dt className="label text-dim">{label}</dt>
                  <dd className="mt-2 font-mono text-2xl tabular-nums text-muted md:text-3xl">
                    {label === "Avg rating" ? "-" : "0"}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        <Container className="grid grid-cols-[minmax(0,1fr)] gap-12 py-12 lg:grid-cols-12 lg:gap-10">
          <section className="min-w-0 lg:col-span-8">
            <h2 className="text-xl font-bold uppercase tracking-tight">Library</h2>
            <div className="halftone mt-5 flex flex-col items-start border border-dashed border-line-strong px-6 py-14 md:px-10">
              <GameControllerIcon size={28} className="text-accent" />
              {profile.is_self ? (
                profile.steam_linked ? (
                  <>
                    <p className="mt-4 text-lg font-semibold">Your Steam library is linked.</p>
                    <p className="mt-1 max-w-[46ch] text-sm text-muted">
                      Importing games and playtime is coming in an upcoming update. Your profile fills in
                      automatically once it lands.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-lg font-semibold">Your library is empty.</p>
                    <p className="mt-1 max-w-[46ch] text-sm text-muted">
                      Link Steam so your games and playtime can be imported.
                    </p>
                    <Link href="/register/steam" className={`${buttonStyles.primary} mt-6`}>
                      <SteamMark />
                      Connect Steam
                    </Link>
                  </>
                )
              ) : (
                <>
                  <p className="mt-4 text-lg font-semibold">No games logged yet.</p>
                  <p className="mt-1 text-sm text-muted">When @{profile.username} logs games, they show up here.</p>
                </>
              )}
            </div>
          </section>

          <aside className="min-w-0 space-y-12 lg:col-span-4">
            <section>
              <h2 className="text-xl font-bold uppercase tracking-tight">Taste</h2>
              {tasteTags.length ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {tasteTags.map((id) => (
                    <li key={id} className="label border border-accent/40 bg-accent-soft px-2.5 py-1.5 text-accent">
                      {labelFor(id)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-dim">No favorite platforms or genres picked yet.</p>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-tight">Reviews</h2>
              <div className="mt-5 flex items-start gap-3 border-t border-line pt-5 text-sm text-dim">
                <NotePencilIcon size={16} className="mt-0.5 shrink-0 text-accent" />
                {profile.is_self ? "Reviews you write will appear here." : "No reviews yet."}
              </div>
            </section>
          </aside>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
