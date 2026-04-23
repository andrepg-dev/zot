import LandingPageTitle from "@/components/LandingPageTitle";
import Silk from "@/components/Silk";
import { getDashboardUrl } from "@/lib/dashboard-url";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export default function ReadyToStartSection() {
  const dashboardUrl = getDashboardUrl();

  return (
    <section
      id="get-started"
      className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 pb-16 sm:pb-20 lg:pb-24 pt-12 sm:pt-14 lg:pt-16"
    >
      <div className="relative w-full overflow-hidden shadow-[0_0_20px_rgba(0,111,238,0.3),0_0_0px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-0 z-0 h-full min-h-[280px] sm:min-h-[320px] w-full">
          <Silk
            speed={2.5}
            scale={1}
            color="#006FEE"
            noiseIntensity={5}
            rotation={5.54}
          />
        </div>
        <div
          className="relative z-10 px-5 sm:px-8 lg:px-10 py-10 sm:py-12 lg:py-16 text-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(10, 24, 66, 0.35) 0%, rgba(0, 111, 238, 0.08) 50%, rgba(10, 24, 66, 0.35) 100%), rgba(0, 0, 0, 0.72)",
          }}
        >
          <LandingPageTitle
            subtitle=""
            title={{ before: "Ship your waitlist", gradient: "today" }}
            gradient={{ colors: ["#8AB6FF", "#ffffff"], animationSpeed: 16 }}
            description="One command, three packages, zero setup. Create your first waitlist, drop it into your app, and start collecting real leads in minutes."
            classNames={{
              description: "max-w-[50ch] !text-xl text-balance",
            }}
          />

          <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={dashboardUrl}
              className="bg-white text-black hover:bg-white/90 px-5 sm:px-6 py-2.5 sm:py-3 inline-flex items-center justify-center gap-2 text-sm font-medium transition-all hover:px-7 shadow-[0_0_24px_rgba(255,255,255,0.25)]"
            >
              Start launching
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} />
            </Link>
            <Link
              href="#pricing"
              className="backdrop-blur-md border border-white/30 bg-white/5 text-white hover:bg-white/10 px-5 sm:px-6 py-2.5 sm:py-3 inline-flex items-center justify-center text-sm font-medium transition-all hover:px-7"
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
