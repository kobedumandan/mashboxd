import { ArrowsClockwiseIcon } from "@phosphor-icons/react/ssr";
import { Container, SteamMark } from "@/components/ui";

const planned = ["Xbox", "PlayStation", "Epic Games", "GOG"];

export function Platforms() {
  return (
    <section id="games" className="border-b border-line">
      <Container className="grid gap-10 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label text-accent">[ Platforms ]</p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.04em] md:text-5xl">
            One profile across every launcher.
          </h2>
          <p className="mt-5 max-w-[42ch] text-muted">
            Steam syncs today. Xbox, PlayStation, Epic and GOG are next, and they land in the same
            profile.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px self-end border border-line bg-line sm:grid-cols-4 lg:col-span-8">
          <article className="col-span-2 flex min-h-56 flex-col justify-between bg-surface p-6 sm:col-span-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <SteamMark size={30} className="text-accent" />
                <h3 className="text-2xl font-bold tracking-tight">Steam</h3>
              </div>
              <span className="label inline-flex items-center gap-1.5 border border-accent/40 bg-accent-soft px-2 py-1 text-accent">
                <ArrowsClockwiseIcon size={11} weight="bold" />
                Live
              </span>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6">
              {[
                ["Library", "Owned games"],
                ["Playtime", "Hours per title"],
                ["Activity", "Recent sessions"],
              ].map(([term, desc]) => (
                <div key={term}>
                  <dt className="label text-dim">{term}</dt>
                  <dd className="mt-1.5 text-sm text-fg">{desc}</dd>
                </div>
              ))}
            </dl>
          </article>

          {planned.map((name) => (
            <article key={name} className="halftone flex min-h-32 flex-col justify-between bg-bg p-5">
              <h3 className="font-mono text-sm uppercase tracking-wider text-muted">{name}</h3>
              <span className="label text-dim">Planned</span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
