"use client";

import { useState } from "react";
import { CheckIcon, LinkSimpleIcon } from "@phosphor-icons/react/ssr";
import { buttonStyles } from "@/components/ui";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); nothing useful to show.
    }
  }

  return (
    <button onClick={copy} className={`${buttonStyles.ghost} min-w-32`} aria-live="polite">
      {copied ? <CheckIcon size={15} weight="bold" className="text-accent" /> : <LinkSimpleIcon size={15} />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
