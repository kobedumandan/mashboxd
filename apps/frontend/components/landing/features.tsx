import Image from "next/image";
import { CheckIcon, HourglassIcon, PlayIcon, UsersIcon, XIcon } from "@phosphor-icons/react/ssr";
import { Container, Rating } from "@/components/ui";
import {
  avatarUrl,
  coverUrl,
  formatHours,
  friendActivity,
  headerUrl,
  library,
  userReviews,
} from "@/lib/data";

const topByHours = [...library]
  .sort((a, b) => b.hours - a.hours)
  .slice(0, 5);
const maxHours = topByHours[0].hours;

const ledger = [
  { label: "Playing", icon: PlayIcon, tone: "text-accent", count: library.filter((e) => e.status === "playing").length },
  { label: "Completed", icon: CheckIcon, tone: "text-fg", count: library.filter((e) => e.status === "completed").length },
  { label: "Backlog", icon: HourglassIcon, tone: "text-muted", count: library.filter((e) => e.status === "backlog").length },
  { label: "Dropped", icon: XIcon, tone: "text-dim", count: library.filter((e) => e.status === "dropped").length },
];

const featured = userReviews[1];

export function Features() {
  return (
    <section className="border-b border-line">
      <Container className="py-20 md:py-28">
        <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.04em] md:text-6xl">
          Built for the way you <span className="text-accent">actually</span> play.
        </h2>

        <div className="mt-14 grid gap-px border border-line bg-line lg:grid-cols-6">
          {/* Playtime */}
          <article className="bg-surface p-6 md:p-8 lg:col-span-4 lg:row-span-2">
            <h3 className="text-2xl font-bold tracking-tight">Playtime, straight from Steam.</h3>
            <p className="mt-2 max-w-[48ch] text-sm text-muted">
              Every session counts toward your profile. No manual logging.
            </p>
            <table className="mt-8 w-full border-collapse text-left">
              <thead>
                <tr className="label text-dim">
                  <th className="pb-3 font-normal">Game</th>
                  <th className="hidden pb-3 font-normal sm:table-cell">Share</th>
                  <th className="pb-3 text-right font-normal">Hours</th>
                </tr>
              </thead>
              <tbody>
                {topByHours.map((e) => (
                  <tr key={e.game.appId} className="border-t border-line">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={headerUrl(e.game.appId)}
                          alt=""
                          width={92}
                          height={43}
                          className="h-[30px] w-16 border border-line object-cover"
                        />
                        <span className="truncate text-sm">{e.game.title}</span>
                      </div>
                    </td>
                    <td className="hidden w-[40%] py-3 pr-6 sm:table-cell">
                      <span
                        className="block h-1.5 bg-accent"
                        style={{ width: `${(e.hours / maxHours) * 100}%` }}
                      />
                    </td>
                    <td className="py-3 text-right font-mono text-sm tabular-nums">
                      {formatHours(e.hours)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          {/* Backlog */}
          <article className="halftone bg-bg p-6 md:p-8 lg:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight">A backlog that moves.</h3>
            <dl className="mt-6 grid grid-cols-2 gap-px border border-line bg-line">
              {ledger.map(({ label, icon: Icon, tone, count }) => (
                <div key={label} className="bg-bg p-4">
                  <dt className={`label flex items-center gap-1.5 ${tone}`}>
                    <Icon size={11} weight="bold" />
                    {label}
                  </dt>
                  <dd className="mt-3 font-mono text-3xl tabular-nums">{count}</dd>
                </div>
              ))}
            </dl>
          </article>

          {/* Reviews */}
          <article className="grid grid-cols-[96px_1fr] gap-5 bg-surface p-6 md:p-8 lg:col-span-2">
            <div className="relative aspect-[2/3] border border-line">
              <Image
                src={coverUrl(featured.game.appId)}
                alt={`${featured.game.title} cover`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Rate it. Review it.</h3>
              <div className="mt-3">
                <Rating value={featured.rating} />
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{featured.body}</p>
            </div>
          </article>

          {/* Social */}
          <article className="grid gap-8 bg-bg p-6 md:p-8 lg:col-span-6 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <UsersIcon size={22} className="text-accent" />
              <h3 className="mt-4 text-2xl font-bold tracking-tight">Follow people with taste.</h3>
              <p className="mt-2 text-sm text-muted">See what friends finish, quit and fall for.</p>
            </div>
            <ul className="grid gap-px border border-line bg-line sm:grid-cols-3 lg:col-span-4">
              {friendActivity.map((a) => (
                <li key={a.user} className="flex items-center gap-3 bg-surface p-4">
                  <Image
                    src={avatarUrl(a.user, 80)}
                    alt=""
                    width={36}
                    height={36}
                    className="size-9 border border-line-strong"
                  />
                  <p className="min-w-0 text-sm leading-snug">
                    <span className="font-medium">{a.user}</span>{" "}
                    <span className="text-muted">{a.verb}</span>{" "}
                    <span className="text-accent">{a.game.title}</span>
                    <span className="label ml-2 text-dim">{a.when}</span>
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Container>
    </section>
  );
}
