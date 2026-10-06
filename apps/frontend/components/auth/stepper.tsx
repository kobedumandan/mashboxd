const steps = ["Account", "Taste", "Steam"];

/** Registration progress. `current` is zero-based. */
export function Stepper({ current }: { current: number }) {
  return (
    <ol className="grid grid-cols-3 gap-px border border-line bg-line" aria-label="Registration progress">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        return (
          <li
            key={label}
            aria-current={state === "current" ? "step" : undefined}
            className={`label flex items-center gap-2 bg-bg px-3 py-2.5 ${
              state === "current" ? "text-fg" : state === "done" ? "text-accent" : "text-dim"
            }`}
          >
            <span
              className={`grid size-4 place-items-center border text-[9px] ${
                state === "todo" ? "border-line-strong" : "border-accent bg-accent text-bg"
              }`}
            >
              {i + 1}
            </span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}
