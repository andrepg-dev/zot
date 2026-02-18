import DarkVeil from "@/components/DarkVeil";
import ShinyText from "@/components/ShinyText";

export default function HomePage() {
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

      <div aria-label="Hero section" className="flex justify-center items-center w-full h-screen flex-col gap-6">
        <div className="bg-black px-6 pr-2 py-2 rounded-full border flex items-center gap-4">
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

        <h1 className="text-5xl">Build, measure, feedback</h1>
        <h3 className="text-muted-foreground italic text-xl text-center">
          For developers launching new products, analytics and tools should be the backbone. <br /> We provide it.
        </h3>
      </div>







    </div >
  )
}
