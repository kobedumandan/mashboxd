import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { Wordmark } from "@/components/ui";
import { coverUrl, games } from "@/lib/data";

const wall = [
  games.outerWilds,
  games.eldenRing,
  games.hollowKnight,
  games.discoElysium,
  games.balatro,
  games.celeste,
  games.hades,
  games.rdr2,
  games.slayTheSpire,
];

/**
 * Shared frame for login and register. The left panel is decorative and
 * hidden below lg; the form column carries everything functional.
 */
export function AuthShell({
  headline,
  accent,
  children,
}: {
  headline: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[100dvh] items-start lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-[100dvh] flex-col overflow-hidden border-r border-line bg-surface lg:flex">
        <ul aria-hidden className="grid min-h-0 flex-1 grid-cols-3 content-start gap-px overflow-hidden bg-line">
          {wall.map((g, i) => (
            <li key={g.appId} className="rise relative aspect-[2/3] bg-bg" style={{ "--i": i } as React.CSSProperties}>
              <Image
                src={coverUrl(g.appId)}
                alt=""
                fill
                sizes="17vw"
                className="object-cover opacity-60 grayscale-[70%]"
              />
            </li>
          ))}
        </ul>
        <div className="border-t border-line bg-bg p-10">
          <p className="text-[clamp(2.5rem,4.6vw,4.5rem)] font-black uppercase leading-[0.86] tracking-[-0.05em]">
            {headline}
            <br />
            <span className="text-accent">{accent}</span>
          </p>
        </div>
      </aside>

      <div className="flex min-h-[100dvh] min-w-0 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-line px-4 md:px-8">
          <Wordmark />
          <Link href="/" className="label inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg">
            <ArrowLeftIcon size={12} weight="bold" />
            Home
          </Link>
        </header>
        <main className="flex flex-1 items-start justify-center px-4 py-12 md:px-8 md:py-20">
          <div className="w-full max-w-[440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
