import LandingPageTitle from "@/components/LandingPageTitle";
import Silk from "@/components/Silk";
import { getDashboardUrl } from "@/lib/dashboard-url";
import Link from "next/link";

export default function ReadyToStartSection() {
  const dashboardUrl = getDashboardUrl();
  return (
    <section id="testimonial" className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 pb-16 sm:pb-20 lg:pb-24 pt-12 sm:pt-14 lg:pt-16">
      <div
        className="relative w-full overflow-hidden shadow-[0_0_20px_rgba(82,39,255,0.25),0_0_0px_rgba(0,0,0,0.4)]"
      >
        <div className="absolute inset-0 z-0 h-full min-h-[280px] sm:min-h-[320px] w-full">
          <Silk
            speed={2.5}
            scale={1}
            color="#5227ff"
            noiseIntensity={5}
            rotation={5.54}
          />
        </div>
        <div
          className="relative z-10 px-5 sm:px-8 lg:px-10 py-10 sm:py-12 lg:py-16 text-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(49, 46, 129, 0.1) 0%, rgba(67, 56, 202, 0.06) 50%, rgba(55, 48, 163, 0.1) 100%), rgba(0, 0, 0, 0.7)",
          }}
        >
          <LandingPageTitle
            subtitle=""
            title={{ before: "Ready to validate?", gradient: "" }}
            gradient={{ colors: ["#c4b5fd", "#ffffff"], animationSpeed: 16 }}
            description="Stop guessing, start measuring. Launch your waitlist today and find out if the world actually needs what you're building."
            classNames={{
              description: "max-w-[70ch] !text-xl"
            }}
          />

          <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={dashboardUrl}
              className="cursor-pointer rounded-full bg-white hover:px-8 transition-all px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-black hover:bg-white/90"
            >
              Get started
            </Link>
            <Link
              href={dashboardUrl}
              className="cursor-pointer rounded-full border border-white/30 bg-zinc-900/80 px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-white backdrop-blur transition hover:border-white/50 hover:bg-zinc-800/80"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
