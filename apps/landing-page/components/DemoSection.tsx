import LandingPageTitle from "@/components/LandingPageTitle";
import AnimatedCounter from "@/components/AnimatedCounter";
import DemoPlayer from "@/components/DemoPlayer";

const METRICS = [
  { value: 14728, suffix: "+", label: "Signups tracked" },
  { value: 42.8, suffix: "%", label: "Avg conversion", decimals: 1 },
  { value: 5, suffix: " min", label: "From npx to live" },
  { value: 99.99, suffix: "%", label: "API uptime", decimals: 2 },
];

export default function DemoSection() {
  return (
    <section
      id="demo"
      className="relative flex flex-col items-center py-14 sm:py-20 lg:py-28 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 gap-10 sm:gap-14 bg-black"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0, 111, 238, 0.18) 0%, rgba(0, 111, 238, 0.06) 40%, transparent 75%)",
        }}
      />

      <div className="relative w-full max-w-6xl flex flex-col items-center gap-10 sm:gap-14">
        <LandingPageTitle
          subtitle="SEE IT IN ACTION"
          title={{
            before: "From terminal",
            gradient: "to live waitlist",
          }}
          gradient={{ colors: ["#60A5FA", "#ffffff"] }}
          description="Watch a real Zot waitlist go live: type the command, hit enter, and you are collecting signups with analytics in under a minute."
        />

        <div className="w-full max-w-5xl">
          <DemoPlayer />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="border border-white/10 bg-white/2 backdrop-blur-sm px-5 sm:px-6 py-5 sm:py-6 flex flex-col gap-2 transition hover:border-white/20 hover:bg-white/4"
            >
              <AnimatedCounter
                value={metric.value}
                decimals={metric.decimals}
                suffix={metric.suffix}
                className="text-2xl sm:text-3xl lg:text-4xl font-mono font-light text-white"
              />
              <span className="text-xs sm:text-sm text-muted-foreground">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
