import LandingPageTitle from "@/components/LandingPageTitle";
import Silk from "@/components/Silk";
import Link from "next/link";

export default function ReadyToStartSection() {
  return (
    <section className="px-16 pb-24 pt-16">
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(82,39,255,0.25),0_0_80px_rgba(0,0,0,0.4)]"
      >
        <div className="absolute inset-0 z-0 h-full min-h-[320px] w-full">
          <Silk
            speed={1}
            scale={1}
            color="#5227ff"
            noiseIntensity={5}
            rotation={5.54}
          />
        </div>
        <div
          className="relative z-10 px-10 py-16 text-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(49, 46, 129, 0.1) 0%, rgba(67, 56, 202, 0.06) 50%, rgba(55, 48, 163, 0.1) 100%), rgba(0, 0, 0, 0.7)",
          }}
        >
          <LandingPageTitle
            subtitle=""
            title={{ before: "Ready to start?", gradient: "" }}
            gradient={{ colors: ["#c4b5fd", "#ffffff"], animationSpeed: 16 }}
            description="Whether you're a professional, student, or entrepreneur, our innovative tools and features are designed to help you succeed. Sign up now and unlock a world of possibilities!"
            classNames={{
              description: "max-w-[70ch]"
            }}
          />


          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#integration"
              className="cursor-pointer rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Get started
            </Link>
            <Link
              href="#integration"
              className="cursor-pointer rounded-full border border-white/30 bg-zinc-900/80 px-6 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:border-white/50 hover:bg-zinc-800/80"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
