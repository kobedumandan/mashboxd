import Link from "next/link";
import { CheckIcon, HourglassIcon, PlayIcon, StarIcon, StarHalfIcon, SteamLogoIcon, XIcon } from "@phosphor-icons/react/ssr";
import type { Status } from "@/lib/data";
import { statusMeta } from "@/lib/data";

/** Three mashed buttons. The middle one is pressed. */
export function LogoMark({ size = 7 }: { size?: number }) {
  return (
    <span aria-hidden className="inline-flex items-center gap-[3px]">
      <span className="bg-fg" style={{ width: size, height: size }} />
      <span className="bg-accent" style={{ width: size, height: size }} />
      <span className="bg-fg" style={{ width: size, height: size }} />
    </span>
  );
}

export function Wordmark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Mashboxd home">
      <LogoMark />
      <span className="text-[15px] font-black uppercase tracking-[-0.03em]">Mashboxd</span>
    </Link>
  );
}

const btnBase =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap px-4 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 active:translate-y-px";

export const buttonStyles = {
  primary: `${btnBase} bg-fg text-bg hover:bg-accent`,
  ghost: `${btnBase} border border-line-strong text-fg hover:border-accent hover:text-accent`,
};

/** Steam mark. Inherits the surrounding text colour. */
export function SteamMark({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <SteamLogoIcon size={size} weight="fill" className={className} aria-hidden />;
}

export function Rating({ value, size = 12 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-px text-accent" aria-label={`${value} out of 5`}>
      {Array.from({ length: full }, (_, i) => (
        <StarIcon key={i} size={size} weight="fill" />
      ))}
      {half && <StarHalfIcon size={size} weight="fill" />}
    </span>
  );
}

const statusIcon = { playing: PlayIcon, completed: CheckIcon, backlog: HourglassIcon, dropped: XIcon };
const statusTone: Record<Status, string> = {
  playing: "text-accent border-accent/40 bg-accent-soft",
  completed: "text-fg border-line-strong",
  backlog: "text-muted border-line-strong",
  dropped: "text-dim border-line border-dashed",
};

export function StatusTag({ status }: { status: Status }) {
  const Icon = statusIcon[status];
  return (
    <span className={`label inline-flex items-center gap-1.5 border px-1.5 py-1 ${statusTone[status]}`}>
      <Icon size={10} weight="bold" />
      {statusMeta[status].label}
    </span>
  );
}

export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-[1400px] px-4 md:px-8 ${className}`}>{children}</div>;
}
