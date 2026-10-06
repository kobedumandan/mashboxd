import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Container, buttonStyles } from "@/components/ui";

export default function ProfileNotFound() {
  return (
    <>
      <SiteNav />
      <main className="flex-1 border-b border-line">
        <Container className="py-24 md:py-32">
          <p className="label text-accent">[ 404 ]</p>
          <h1 className="mt-5 text-[clamp(2.75rem,7vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.05em]">
            No player
            <br />
            <span className="text-accent">by that name.</span>
          </h1>
          <p className="mt-6 max-w-[44ch] text-muted">
            The username may have changed, or the account doesn&apos;t exist.
          </p>
          <Link href="/" className={`${buttonStyles.ghost} mt-8`}>
            Back to home
          </Link>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
