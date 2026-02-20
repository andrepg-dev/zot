"use client";

import { AiIdeaIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import AnimatedContent from "./AnimatedContent";
import ReliabilityGlobe from "./ReliabilityGlobe";

export default function EnhanceReliabilitySection() {
  return (
    <AnimatedContent
      distance={120}
      direction="vertical"
      reverse={false}
      duration={0.8}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
      delay={0.2}
      className="mt-8 relative"
    >
      <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -left-3 -top-3 z-50 text-zinc-700" />
      <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -right-3 -bottom-3 z-50 text-zinc-700" />

      <div
        className="border border-white/10 rounded-xl rounded-br-none rounded-tl-none overflow-hidden relative"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 40%, rgba(82, 39, 255, 0.35) 0%, rgba(82, 39, 255, 0.12) 35%, transparent 70%), #000000",
        }}
      >
        <div className="p-12 py-14">
          <div className="grid grid-cols-2 gap-12 items-center relative z-10">
            {/* Lado izquierdo - Contenido de texto */}
            <div className="flex flex-col gap-4">
              <HugeiconsIcon icon={AiIdeaIcon} strokeWidth={2} />

              <h3 className="text-3xl">Enhance reliability</h3>
              <h4 className="text-muted-foreground max-w-[40ch]">
                Radiyal&apos;s innovative network architecture removes the central bottlenecks of traditional solutions, accelerating team performance and enhancing the reliability of your security stack by preventing outages and service disruptions. No matter where you are.
              </h4>
            </div>
          </div>
        </div>

        {/* Lado derecho - Globo */}
        <div className="absolute -bottom-32 -right-16 h-[500px] -mr-12 flex items-center justify-end overflow-visible pointer-events-none">
          <div className="w-full max-w-[700px] h-full">
            <ReliabilityGlobe />
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
}
