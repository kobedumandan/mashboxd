import { CheckIcon } from "@phosphor-icons/react/ssr";

// Mirrors passwordSchema in the API. The API stays the authority; this is live feedback.
export const passwordRules = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "A letter", test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: "A number", test: (p: string) => /[0-9]/.test(p) },
];

export const meetsPasswordRules = (p: string) => passwordRules.every((r) => r.test(p));

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {passwordRules.map((r) => {
        const ok = r.test(password);
        return (
          <li key={r.label} className={`flex items-center gap-1 ${ok ? "text-accent" : ""}`}>
            <CheckIcon size={11} weight="bold" className={ok ? "" : "opacity-40"} />
            {r.label}
          </li>
        );
      })}
    </ul>
  );
}
