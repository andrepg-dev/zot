"use client";

import { PlusSignIcon, SecurityCheckIcon } from "@hugeicons/core-free-icons";
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
        className="border border-white/10 overflow-hidden relative min-h-[280px] sm:min-h-[320px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 40%, rgba(0, 111, 238, 0.4) 0%, rgba(0, 111, 238, 0.14) 35%, transparent 70%), #000000",
        }}
      >
        <div className="p-6 sm:p-8 lg:p-12 py-8 sm:py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center relative z-10">
            {/* Lado izquierdo - Contenido de texto */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <HugeiconsIcon icon={SecurityCheckIcon} strokeWidth={2} className="size-7" />

              <h3 className="text-2xl sm:text-3xl">Clean leads, by default</h3>
              <h4 className="text-muted-foreground max-w-[40ch] text-sm sm:text-base">
                Zot blocks disposable and fraudulent emails before they hit your list. No cron jobs, no third-party services, no spreadsheet cleanup. Every signup you see is a real person genuinely interested in your product.
              </h4>
            </div>
          </div>
        </div>

        {/* Lado derecho - Globo: visible en desktop, más pequeño/oculto en móvil */}
        <div className="hidden md:flex absolute -bottom-28 lg:-bottom-12 -right-12 lg:-right-16 h-[360px] lg:h-[500px] -mr-8 lg:-mr-12 items-center justify-end overflow-visible pointer-events-none">
          <div className="w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[700px] h-full opacity-80 lg:opacity-100">
            <ReliabilityGlobe />
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
}
