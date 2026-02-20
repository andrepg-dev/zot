import DarkVeil from "@/components/DarkVeil";
import LandingPageTitle from "@/components/LandingPageTitle";
import ShinyText from "@/components/ShinyText";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const techLogos = [
    {
      src: "/icons/zot-icon-only.svg",
      alt: "Zot",
      title: "Zot",
      width: 64,
      height: 64
    },
  ];

  return (
    <div className="font-sans">
      <div className="w-full h-screen absolute -z-10">
        <DarkVeil
          speed={1.4}
          hueShift={0}
          noiseIntensity={0.1}
          scanlineIntensity={5}
          scanlineFrequency={1}
          warpAmount={0}
        />
      </div>

      <header className="px-16 py-9 text-muted-foreground absolute">
        <div className="flex gap-6 items-center">
          <Image
            src="/icons/zot-icon-only.svg"
            alt="Zot"
            width={28}
            height={28}
          />
          <Link href={"#integration"}>Integration</Link>
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

          <h1 className="text-6xl font-light">Build, measure, feedback</h1>
          <h3 className="text-muted-foreground italic text-xl text-center w-[50ch]">
            For developers launching new products, analytics and AI tools should be the backbone. We provide it.
          </h3>

          <div className="flex gap-6">
            <button className="bg-zinc-900 text-foreground px-6 py-1.5 border rounded-full cursor-pointer">Get started</button>
            <button className="backdrop-blur-md px-6 py-1.5 rounded-full cursor-pointer">Start free trial</button>
          </div>
        </div>

        {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-sm text-foreground/80 text-center">
            Join over 1,000 startups and start to maximize your productivity.
          </span>

          <div className="h-[100px] w-[80%] relative overflow-hidden">
            <LogoLoop
              logos={techLogos}
              speed={30}
              direction="left"
              logoHeight={60}
              gap={60}
              hoverSpeed={20}
              scaleOnHover
              fadeOut
              fadeOutColor="#000"
              ariaLabel="Technology partners"
            />
          </div>
        </div> */}
      </div>

      <div className="px-16 pb-32 bg-[#000000]">
        <LandingPageTitle
          subtitle="Productivity insights"
          title={{ before: "Advanced", gradient: "Analytics" }}
          gradient={{ colors: ["#5227FF", "#ffffff"], animationSpeed: 16 }}
          description="Gain valuable insights into your productivity with detailed reports that help you understand your habits."
        />

        <div className="flex gap-4">
          Hola
        </div>


      </div>
    </div >
  )
}
