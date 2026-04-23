"use client";

import { CheckmarkCircle02Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useState } from "react";

interface HeroInstallCommandProps {
  command: string;
  className?: string;
}

export default function HeroInstallCommand({
  command,
  className,
}: HeroInstallCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; fall through silently
    }
  }, [command]);

  return (
    <div
      className={`group relative inline-flex w-full max-w-md items-center gap-3 border border-white/10 bg-black/60 px-3.5 py-2.5 font-mono text-[13px] backdrop-blur-md transition hover:border-[#006FEE]/40 hover:bg-black/70 ${
        className ?? ""
      }`}
    >
      <span
        aria-hidden
        className="text-[#006FEE] select-none shrink-0 drop-shadow-[0_0_6px_rgba(0,111,238,0.55)]"
      >
        $
      </span>
      <code className="flex-1 min-w-0 truncate text-white/90">{command}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied to clipboard" : "Copy command"}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006FEE]/60 cursor-pointer"
      >
        {copied ? (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={14}
            strokeWidth={2}
            className="text-[#22C55E]"
          />
        ) : (
          <HugeiconsIcon icon={Copy01Icon} size={14} strokeWidth={2} />
        )}
      </button>
      <span
        aria-live="polite"
        className={`pointer-events-none absolute -top-8 right-0 border border-white/10 bg-black/80 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur transition-opacity ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        Copied
      </span>
    </div>
  );
}
