"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { GameControllerIcon } from "@phosphor-icons/react/ssr";
import { Rating, StatusTag } from "@/components/ui";
import { coverUrl, formatHours, statusMeta, type LibraryEntry, type Status } from "@/lib/data";

type Filter = "all" | Status;
type Sort = "hours" | "rating" | "title";

const filters: Filter[] = ["all", "playing", "completed", "backlog", "dropped"];
const sorts: { value: Sort; label: string }[] = [
  { value: "hours", label: "Hours" },
  { value: "rating", label: "Rating" },
  { value: "title", label: "A-Z" },
];

export function LibraryGrid({ entries }: { entries: LibraryEntry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("hours");

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: entries.length, playing: 0, completed: 0, backlog: 0, dropped: 0 };
    for (const e of entries) c[e.status]++;
    return c;
  }, [entries]);

  const visible = useMemo(() => {
    const list = filter === "all" ? entries : entries.filter((e) => e.status === filter);
    return [...list].sort((a, b) => {
      if (sort === "title") return a.game.title.localeCompare(b.game.title);
      if (sort === "rating") return (b.rating ?? -1) - (a.rating ?? -1);
      return b.hours - a.hours;
    });
  }, [entries, filter, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-line md:flex-row md:items-end md:justify-between">
        <div role="tablist" aria-label="Filter by status" className="-mb-px flex overflow-x-auto">
          {filters.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                className={`label flex shrink-0 items-center gap-2 border-b px-3 py-3 transition-colors ${
                  active ? "border-accent text-fg" : "border-transparent text-dim hover:text-muted"
                }`}
              >
                {f === "all" ? "All" : statusMeta[f].label}
                <span className={active ? "text-accent" : ""}>{counts[f]}</span>
              </button>
            );
          })}
        </div>

        <label className="label flex items-center gap-2 pb-3 text-dim">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="label border border-line-strong bg-surface px-2 py-1.5 text-fg outline-none focus:border-accent"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="halftone mt-6 flex flex-col items-center border border-dashed border-line-strong px-6 py-16 text-center">
          <GameControllerIcon size={28} className="text-accent" />
          <p className="mt-4 font-semibold">Nothing here yet</p>
          <p className="mt-1 max-w-[36ch] text-sm text-muted">
            Change a game&apos;s status from its page, or sync Steam to pull in new titles.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 xl:grid-cols-4">
          {visible.map((e) => (
            <li key={e.game.appId} className="group bg-bg">
              <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                  src={coverUrl(e.game.appId)}
                  alt={`${e.game.title} cover`}
                  fill
                  sizes="(min-width: 1280px) 15vw, (min-width: 640px) 30vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 translate-y-full border-t border-line-strong bg-bg p-3 transition-transform duration-300 group-hover:translate-y-0">
                  <StatusTag status={e.status} />
                  <p className="label mt-2 text-dim">Last played {e.lastPlayed}</p>
                </div>
              </div>
              <div className="border-t border-line p-3">
                <p className="truncate text-sm font-medium">{e.game.title}</p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  {e.rating ? <Rating value={e.rating} size={11} /> : <span className="label text-dim">Unrated</span>}
                  <data value={e.hours} className="font-mono text-xs tabular-nums text-muted">
                    {formatHours(e.hours)}h
                  </data>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
