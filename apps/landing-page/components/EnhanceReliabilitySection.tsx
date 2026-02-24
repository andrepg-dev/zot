"use client";

import { AiIdeaIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import AnimatedContent from "./AnimatedContent";
import ReliabilityGlobe from "./ReliabilityGlobe";

export default function EnhanceReliabilitySection() {
  return (
    <AnimatedContent
      distance={0}
      direction="vertical"
      reverse={false}
      duration={0.8}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
      delay={0.2}
      className="mt-8 relative"
    >
      <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -left-[12.5px] -top-[12.5px] z-50 text-zinc-700" />
      <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -right-[12.5px] -bottom-[12.5px] z-50 text-zinc-700" />

      <div
        className="border border-white/10 rounded-br-none rounded-tl-none overflow-hidden relative min-h-[280px] sm:min-h-[320px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 40%, rgba(82, 39, 255, 0.35) 0%, rgba(82, 39, 255, 0.12) 35%, transparent 70%), #000000",
        }}
      >
        <div className="p-6 sm:p-8 lg:p-12 py-8 sm:py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center relative z-10">
            {/* Lado izquierdo - Contenido de texto */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <HugeiconsIcon icon={AiIdeaIcon} strokeWidth={2} className="size-7" />

              <h3 className="text-2xl sm:text-3xl">Enhance reliability</h3>
              <h4 className="text-muted-foreground max-w-[40ch] text-sm sm:text-base">
                Zot&apos;s innovative network architecture removes the central bottlenecks of traditional solutions, accelerating team performance and enhancing the reliability of your security stack by preventing outages and service disruptions. No matter where you are.
              </h4>
            </div>
          </div>
        </div>

        {/* Lado derecho - Globo: visible en desktop, más pequeño/oculto en móvil */}
        <div className="absolute -bottom-20 sm:-bottom-28 lg:-bottom-[12.5px]2 -right-8 sm:-right-12 lg:-right-16 h-[280px] sm:h-[360px] lg:h-[500px] -mr-4 sm:-mr-8 lg:-mr-12 flex items-center justify-end overflow-visible pointer-events-none">
          <div className="w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[700px] h-full opacity-80 lg:opacity-100">
            <ReliabilityGlobe />
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
}
