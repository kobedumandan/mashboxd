import Link from "next/link";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import { NavAuth } from "@/components/nav-auth";
import { Container, Wordmark } from "@/components/ui";

const links = [
  { href: "/#games", label: "Games" },
  { href: "/#reviews", label: "Reviews" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <Container className="flex h-14 items-center gap-8">
        <Wordmark />
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="label text-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <label className="hidden h-9 w-56 items-center gap-2 border border-line bg-surface px-3 text-muted focus-within:border-line-strong lg:flex">
            <MagnifyingGlassIcon size={14} className="text-accent" />
            <span className="sr-only">Search games</span>
            <input
              type="search"
              placeholder="Search games"
              className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-dim"
            />
            <kbd className="label border border-line-strong px-1 text-[10px] text-dim">/</kbd>
          </label>
          <NavAuth />
        </div>
      </Container>
    </header>
  );
}
