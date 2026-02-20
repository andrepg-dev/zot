import AnimatedContent from "@/components/AnimatedContent";
import DarkVeil from "@/components/DarkVeil";
import LandingPageTitle from "@/components/LandingPageTitle";
import LogoLoop from "@/components/LogoLoop";
import ProductivityInsightsCard from "@/components/ProductivityInsightsCard";
import ProjectsChartSVG from "@/components/ProjectsChartSVG";
import ShinyText from "@/components/ShinyText";
import { ChartColumnIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

const logoipsumLogos = [
  { src: "/logos/logo-1.svg", alt: "Logoipsum", title: "Logoipsum", width: 120, height: 32 },
  { src: "/logos/logo-2.svg", alt: "Logoipsum", title: "Logoipsum", width: 120, height: 32 },
  { src: "/logos/logo-3.svg", alt: "Logoipsum", title: "Logoipsum", width: 120, height: 32 },
  { src: "/logos/logo-6.svg", alt: "Logoipsum", title: "Logoipsum", width: 120, height: 32 },
  { src: "/logos/logo-5.svg", alt: "Logoipsum", title: "Logoipsum", width: 120, height: 32 },
  { src: "/logos/logo-6.svg", alt: "Logoipsum", title: "Logoipsum", width: 120, height: 32 },
];

export default function HomePage() {

  return (
    <div className="font-sans">
      <div className="w-full h-screen absolute -z-10">
        <DarkVeil
          speed={2.4}
          hueShift={0}
          noiseIntensity={0.1}
          scanlineIntensity={5}
          scanlineFrequency={1}
          warpAmount={0}
        />
      </div>

      <header className="px-32 py-9 text-muted-foreground absolute">
        <div className="flex gap-6 items-center">
          <Image
            src="/icons/zot-icon-only.svg"
            alt="Zot"
            width={28}
            height={28}
            className="[filter:drop-shadow(0_0_4px_rgba(255,255,255,0.75))_drop-shadow(0_0_10px_rgba(255,255,255,0.4))_drop-shadow(0_0_18px_rgba(59,130,246,0.5))_drop-shadow(0_0_26px_rgba(30,58,138,0.45))]"
          />
          <Link href={"#integration"} className="ml-4">Integration</Link>
          <Link href={"#integration"}>Pricing</Link>
          <Link href={"#integration"}>Testimonial</Link>
          <Link href={"#integration"}>Contact</Link>
        </div>
      </header>

      <div aria-label="Hero section" className="flex justify-center items-center w-full h-screen flex-col">
        <div className="mb-26 flex justify-center items-center w-full gap-6 flex-col">
          <div className="bg-black/30 hover:bg-zinc-600/10 transition backdrop-blur-md px-5 pr-2 py-1.5 rounded-full border flex items-center gap-4 cursor-pointer">
            <ShinyText
              text="Start measuring your clients"
              speed={2}
              delay={0}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />

            <button className="bg-zinc-900 rounded-full text-white px-4 py-1 text-sm">
              Join now
            </button>
          </div>

          <h1 className="text-6xl text-center">Build, measure, feedback</h1>
          <h3 className="text-muted-foreground text-xl text-center w-[50ch]">
            For developers validating their products, analytics and AI tools should be the backbone. We provide it.
          </h3>

          <div className="flex gap-6">
            <button className="bg-zinc-300 text-black px-6 py-1.5 border rounded-full cursor-pointer">Get started</button>
            <button className="backdrop-blur-md border px-6 py-1.5 rounded-full cursor-pointer">Start free trial</button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-4xl">
          <span className="text-sm text-foreground/80 text-center">
            Join over 1,000 startups and start to maximize your productivity.
          </span>

          <div className="h-[48px] w-[95%] relative overflow-hidden">
            <LogoLoop
              logos={logoipsumLogos}
              speed={30}
              direction="left"
              logoHeight={32}
              gap={48}
              hoverSpeed={20}
              scaleOnHover
              fadeOut
              fadeOutColor="#000"
              ariaLabel="Technology partners"
            />
          </div>
        </div>
      </div>

      <div className="px-16 pb-32 bg-[#000000]">
        <LandingPageTitle
          subtitle="Productivity insights"
          title={{ before: "Advanced", gradient: "Analytics" }}
          gradient={{ colors: ["#5227FF", "#ffffff"], animationSpeed: 16 }}
          description="Gain valuable insights into your productivity with detailed reports that help you understand your habits."
        />

        {/* Card container */}
        <div className="grid grid-cols-2 gap-4 mt-16">
          <AnimatedContent
            distance={120}
            direction="horizontal"
            reverse={true}
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            delay={0}
            className="relative"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -left-3 -top-3 z-50 text-zinc-700" />

            <ProductivityInsightsCard
              previewImage={{ src: "/analytics-4.png", alt: "Screenshot de analytics" }}
              previewUrl="zot.so"
            />
          </AnimatedContent>

          <AnimatedContent
            distance={140}
            direction="vertical"
            reverse={false}
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            delay={0}
            className="relative"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -right-3 -top-3 z-50 text-zinc-700" />
            <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -left-3 -bottom-3 z-50 text-zinc-700" />


            <div
              className="border border-white/10 rounded-xl rounded-bl-none rounded-tr-none aspect-square relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse 80% 80% at 50% 40%, rgba(82, 39, 255, 0.35) 0%, rgba(82, 39, 255, 0.12) 35%, transparent 70%), #000000",
              }}>
              <div className="p-12">
                <div className="flex flex-col gap-4">
                  <HugeiconsIcon icon={ChartColumnIcon} />
                  <h3 className="text-3xl">Goal tracking</h3>
                  <h4 className="text-muted-foreground max-w-[40ch]">
                    Set personal or team goals and track your progress.
                    See how close you are to achieving your objectives and stay motivated.
                  </h4>
                </div>
              </div>

              <div className="border-t border-l ml-auto w-5/6 h-full rounded-lg rounded-tr-none bg-black backdrop-blur-3xl relative">
                <div className="m-2 bg-zinc-900 border rounded-lg w-full h-[200px] p-4 relative">
                  <h4 className="text-lg font-medium">Projects completed</h4>
                  <h6 className="text-muted-foreground">
                    Hey! You&apos;re doing a great job, it <br /> looks like you&apos;re <span className="text-white font-medium">on track!</span>
                  </h6>

                  <div className="absolute bottom-6 left-6 flex items-center">
                    <h2 className="text-4xl font-semibold">3.2k</h2>
                    <div className="flex ml-6 gap-2">
                      <div className="border border-green-700 bg-green-500/20 rounded-full text-emerald-700 px-2 flex items-center text-xs">
                        26%
                      </div>
                      <span className="text-muted-foreground text-sm">Compared to last month</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full">
                  <ProjectsChartSVG />
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div >
  )
}
