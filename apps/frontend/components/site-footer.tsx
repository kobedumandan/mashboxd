import Link from "next/link";
import { Container, Wordmark } from "@/components/ui";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Games", href: "/#games" },
      { label: "Reviews", href: "/#reviews" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-line">
      <Container className="grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm text-muted">Everything you play, in one place.</p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="md:col-span-3">
            <p className="label text-dim">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <Container className="flex flex-col gap-2 border-t border-line py-5 sm:flex-row sm:justify-between">
        <p className="label text-dim">© 2026 Mashboxd</p>
        <p className="label text-dim">Steam is a trademark of Valve Corporation. Not affiliated.</p>
      </Container>

      <p
        aria-hidden
        className="pointer-events-none -mb-[0.2em] select-none text-center text-[17.5vw] font-black uppercase leading-[0.8] tracking-[-0.06em] text-surface-2"
      >
        Mashboxd
      </p>
    </footer>
  );
}
