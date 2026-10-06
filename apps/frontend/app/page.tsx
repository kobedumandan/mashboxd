import { Cta } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Platforms } from "@/components/landing/platforms";
import { Reviews } from "@/components/landing/reviews";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Platforms />
        <Features />
        <Reviews />
        <Cta />
      </main>
      <SiteFooter />
    </>
  );
}
