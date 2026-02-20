import DarkVeil from "@/components/DarkVeil";
import LandingPageTitle from "@/components/LandingPageTitle";
import LogoLoop from "@/components/LogoLoop";
import ShinyText from "@/components/ShinyText";
import Image from "next/image";
import Link from "next/link";

const logoipsumLogos = [
  { src: "/logos/logo-1.svg", alt: "Logoipsum", title: "Logoipsum", width: 120, height: 32 },
  { src: "/logos/logo-2.svg", alt: "Logoipsum", title: "Logoipsum", width: 120, height: 32 },
  { src: "/logos/logo-4.svg", alt: "Logoipsum", title: "Logoipsum", width: 120, height: 32 },
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
          <div className="bg-black/30 hover:bg-zinc-600/10 transition backdrop-blur-md px-6 pr-2 py-2 rounded-full border flex items-center gap-4 cursor-pointer">
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
            For developers launching new products, analytics and AI tools should be the backbone. We provide it.
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
          <div className="border p-6 rounded-xl">
            hola
          </div>
        </div>


      </div>
    </div >
  )
}
