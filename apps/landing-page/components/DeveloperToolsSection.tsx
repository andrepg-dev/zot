import LandingPageTitle from "@/components/LandingPageTitle";
import {
  CodeSquareIcon,
  CommandLineIcon,
  MagicWand01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { codeToHtml } from "shiki";

const TOOLS = [
  {
    id: "cli",
    name: "@zot-core/cli",
    tagline: "Create waitlists from your terminal",
    description:
      "Spin up a new waitlist, write the ID to your env file, and keep moving. No dashboard context-switching required.",
    icon: CommandLineIcon,
    lang: "bash",
    code: `npx @zot-core/cli waitlist create \\
  --name "Early Access" \\
  --write-env .env.local \\
  --public`,
  },
  {
    id: "sdk",
    name: "@zot-core/sdk",
    tagline: "A hook. Three lines. Done.",
    description:
      "useAddUser handles loading, success, errors and the already-registered state for you. Works in any React app.",
    icon: CodeSquareIcon,
    lang: "tsx",
    code: `const { addUser, isPending, isUserRegistered } = useAddUser({
  apiKey: process.env.NEXT_PUBLIC_ZOT_API_KEY!,
  waitlistId: process.env.NEXT_PUBLIC_ZOT_WAITLIST_ID!,
});`,
  },
  {
    id: "agents",
    name: "@zot-core/agents",
    tagline: "Teach your AI agent Zot. Correctly.",
    description:
      "One command writes integration guides for Claude Code, Cursor, GitHub Copilot and AGENTS.md, so every agent in your repo ships the right code.",
    icon: MagicWand01Icon,
    lang: "bash",
    code: `npx skills add launch-waitlist-zot/zot-skills`,
  },
] as const;

export default async function DeveloperToolsSection() {
  const highlighted = await Promise.all(
    TOOLS.map((tool) =>
      codeToHtml(tool.code, {
        lang: tool.lang,
        theme: "github-dark-default",
      }),
    ),
  );

  return (
    <section className="content-visibility-auto px-4 sm:px-6 md:px-8 lg:px-16 pb-20 sm:pb-24 lg:pb-32 pt-4 sm:pt-6 bg-black">
      <LandingPageTitle
        subtitle="Built for developers"
        title={{ before: "From terminal to", gradient: "production" }}
        gradient={{ colors: ["#006FEE", "#ffffff"], animationSpeed: 16 }}
        description="Three packages that cover the full waitlist loop: create, embed, and wire up your coding agent. All open source, all official."
        classNames={{ description: "max-w-[52ch]" }}
      />

      <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 relative">
        <HugeiconsIcon
          icon={PlusSignIcon}
          size={26}
          strokeWidth={1}
          className="absolute -left-[12.5px] -top-[12.5px] z-50 text-zinc-700"
        />
        <HugeiconsIcon
          icon={PlusSignIcon}
          size={26}
          strokeWidth={1}
          className="absolute -right-[12.5px] -bottom-[12.5px] z-50 text-zinc-700"
        />

        {TOOLS.map((tool, index) => (
          <div
            key={tool.id}
            className="relative flex flex-col border border-white/10 overflow-hidden transition hover:border-white/20"
            style={{
              background:
                "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0, 111, 238, 0.15) 0%, rgba(0, 111, 238, 0.04) 40%, transparent 70%), #000000",
            }}
          >
            <div className="flex flex-col gap-3 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5">
                  <HugeiconsIcon
                    icon={tool.icon}
                    size={18}
                    strokeWidth={1.8}
                    className="text-white"
                  />
                </span>
                <code className="font-mono text-sm text-[#8AB6FF]">
                  {tool.name}
                </code>
              </div>

              <h3 className="text-lg sm:text-xl font-medium text-white mt-1">
                {tool.tagline}
              </h3>
              <p className="text-sm text-muted-foreground max-w-[42ch] leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="mt-auto border-t border-white/5 bg-black/40 pb-4">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-white/50">
                  <span className="inline-block size-1.5 rounded-full bg-[#006FEE] shadow-[0_0_6px_rgba(0,111,238,0.7)]" />
                  {tool.lang === "bash" ? "terminal" : "waitlist.tsx"}
                </span>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                  {tool.lang}
                </span>
              </div>
              <div
                className="dev-tools-code overflow-x-auto px-4 py-3 text-[11.5px] leading-[1.6]"
                dangerouslySetInnerHTML={{ __html: highlighted[index] }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
