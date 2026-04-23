import { codeToHtml } from "shiki";

const HERO_WAITLIST_SNIPPET = `"use client";

import { useAddUser } from "@zot-core/sdk/react";

export function WaitlistForm() {
  const { addUser, isPending, isUserRegistered } = useAddUser({
    apiKey: process.env.NEXT_PUBLIC_ZOT_API_KEY!,
    waitlistId: process.env.NEXT_PUBLIC_ZOT_WAITLIST_ID!,
  });

  if (isUserRegistered) return <p>You're on the list ✓</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const email = (e.currentTarget.email as HTMLInputElement).value;
        addUser({ email });
      }}
    >
      <input name="email" type="email" required />
      <button disabled={isPending}>
        {isPending ? "Joining..." : "Join waitlist"}
      </button>
    </form>
  );
}
`;

interface HeroCodePreviewProps {
  className?: string;
}

export default async function HeroCodePreview({
  className,
}: HeroCodePreviewProps) {
  const html = await codeToHtml(HERO_WAITLIST_SNIPPET, {
    lang: "tsx",
    theme: "github-dark-default",
  });

  return (
    <div
      data-hero-code
      style={{ opacity: 0 }}
      className={`relative w-full max-w-[560px] mx-auto lg:mx-0 ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="absolute -inset-10 sm:-inset-12 blur-3xl opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0, 111, 238, 0.35) 0%, rgba(0, 111, 238, 0.08) 45%, transparent 75%)",
        }}
      />

      <div className="relative overflow-hidden border border-white/10 bg-[#0d1117] shadow-[0_10px_40px_-10px_rgba(0,111,238,0.35),0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#FF5F56]" aria-hidden />
            <span className="size-2.5 rounded-full bg-[#FFBD2E]" aria-hidden />
            <span className="size-2.5 rounded-full bg-[#27C93F]" aria-hidden />
          </div>

          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1.5 border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-white/90">
              <span className="inline-block size-1.5 rounded-full bg-[#006FEE] shadow-[0_0_8px_rgba(0,111,238,0.8)]" aria-hidden />
              app/waitlist.tsx
            </span>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 text-[11px] font-mono text-white/40">
              .env.local
            </span>
          </div>

          <span className="hidden sm:inline text-[10px] font-mono text-white/30">
            tsx
          </span>
        </div>

        <div
          className="hero-code-preview overflow-x-auto px-4 py-4 text-[12px] sm:text-[12.5px] leading-[1.65]"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="flex items-center justify-between border-t border-white/5 bg-black/30 px-3 py-2">
          <span className="inline-flex items-center gap-2 text-[11px] font-mono text-white/60">
            <span className="brand-pulse inline-block size-1.5 rounded-full bg-[#22C55E]" aria-hidden />
            2,418 signups · live
          </span>
          <span className="text-[11px] font-mono text-white/40">
            3 lines. Done.
          </span>
        </div>
      </div>

      <div
        className="absolute -right-3 -top-3 hidden lg:flex items-center gap-1.5 border border-white/10 bg-black/70 px-2.5 py-1 backdrop-blur text-[10px] font-mono text-white/80 shadow-[0_0_20px_rgba(0,111,238,0.25)]"
        aria-hidden
      >
        <span className="inline-block size-1.5 rounded-full bg-[#006FEE] shadow-[0_0_8px_rgba(0,111,238,0.8)]" />
        @zot-core/sdk
      </div>
    </div>
  );
}
