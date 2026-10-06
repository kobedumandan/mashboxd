import Link from "next/link";
import { LockSimpleIcon } from "@phosphor-icons/react/ssr";
import { Container, SteamMark, buttonStyles } from "@/components/ui";

export function Cta() {
  return (
    <section id="connect" className="border-b border-line">
      <Container className="py-24 md:py-36">
        <h2 className="text-[clamp(3rem,11vw,11rem)] font-black uppercase leading-[0.82] tracking-[-0.06em]">
          Start your
          <br />
          <span className="text-accent">log.</span>
        </h2>
        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-muted">
            <LockSimpleIcon size={14} className="text-accent" />
            Signs in through Steam. Mashboxd never sees your password.
          </p>
          <Link href="/register" className={`${buttonStyles.primary} h-12 px-6 text-base`}>
            <SteamMark size={18} />
            Connect Steam
          </Link>
        </div>
      </Container>
    </section>
  );
}
