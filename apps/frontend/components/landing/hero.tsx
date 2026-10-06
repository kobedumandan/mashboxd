import Image from "next/image";
import Link from "next/link";
import { Container, SteamMark, buttonStyles } from "@/components/ui";
import { coverUrl, formatHours, library } from "@/lib/data";

const strip = [...library].sort((a, b) => b.hours - a.hours).slice(0, 6);

export function Hero() {
  return (
    <section className="border-b border-line">
      <Container className="pt-14 pb-12 md:pt-20 md:pb-16">
        <h1 className="rise text-[clamp(2.75rem,7vw,6.5rem)] font-black uppercase leading-[0.88] tracking-[-0.05em]">
          Everything you play,
          <br />
          <span className="text-accent">in one place.</span>
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-8">
          <div className="rise md:col-span-4 lg:col-span-3" style={{ "--i": 2 } as React.CSSProperties}>
            <p className="max-w-[34ch] text-base leading-relaxed text-muted">
              Import your Steam library, log every hour, rate what you finish and keep the backlog
              honest.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register" className={buttonStyles.primary}>
                <SteamMark />
                Connect Steam
              </Link>
            </div>
          </div>

          <figure className="md:col-span-8 md:col-start-5 lg:col-span-9 lg:col-start-4">
            <ul className="grid grid-cols-3 gap-px border border-line bg-line sm:grid-cols-6">
              {strip.map((entry, i) => (
                <li
                  key={entry.game.appId}
                  className={`rise group bg-bg ${i > 2 ? "hidden sm:block" : ""}`}
                  style={{ "--i": i + 3 } as React.CSSProperties}
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={coverUrl(entry.game.appId)}
                      alt={`${entry.game.title} cover`}
                      fill
                      priority={i < 3}
                      sizes="(min-width: 768px) 14vw, 33vw"
                      className="object-cover grayscale-[35%] transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  </div>
                  <figcaption className="flex items-baseline justify-between gap-2 border-t border-line px-2 py-2">
                    <span className="label truncate text-muted">{entry.game.title}</span>
                    <data value={entry.hours} className="label shrink-0 text-accent">
                      {formatHours(entry.hours)}h
                    </data>
                  </figcaption>
                </li>
              ))}
            </ul>
          </figure>
        </div>
      </Container>
    </section>
  );
}
