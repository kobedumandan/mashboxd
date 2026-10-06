import { WarningCircleIcon } from "@phosphor-icons/react/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Container } from "@/components/ui";

export interface LegalSection {
  heading: string;
  body: React.ReactNode;
}

/** Shared layout for Terms and Privacy. Sections render as a numbered, anchor-linked document. */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="border-b border-line">
          <Container className="py-14 md:py-20">
            <h1 className="text-[clamp(2.75rem,7vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.05em]">
              {title}
            </h1>
            <p className="label mt-5 text-dim">Last updated {updated}</p>
          </Container>
        </section>

        <Container className="grid grid-cols-[minmax(0,1fr)] gap-12 py-12 lg:grid-cols-12">
          <nav aria-label="Sections" className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-20 space-y-2 border-l border-line pl-4">
              {sections.map((s) => (
                <li key={s.heading}>
                  <a href={`#${slug(s.heading)}`} className="text-sm text-muted transition-colors hover:text-accent">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 lg:col-span-8 lg:col-start-5">
            {/* TODO: remove once a lawyer has reviewed the text. */}
            <div role="note" className="flex items-start gap-2 border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent">
              <WarningCircleIcon size={16} className="mt-0.5 shrink-0" />
              Draft. This text has not had legal review yet.
            </div>
            <div className="mt-8 text-[15px] leading-relaxed text-muted">{intro}</div>
            <ol className="mt-10 space-y-10">
              {sections.map((s, i) => (
                <li key={s.heading} id={slug(s.heading)} className="scroll-mt-20 border-t border-line pt-8">
                  <h2 className="flex items-baseline gap-3 text-xl font-bold tracking-tight text-fg">
                    <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {s.heading}
                  </h2>
                  <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-fg">
                    {s.body}
                  </div>
                </li>
              ))}
            </ol>
          </article>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
