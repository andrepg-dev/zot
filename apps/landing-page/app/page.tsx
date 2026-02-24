import AnimatedContent from "@/components/AnimatedContent";
import DarkVeil from "@/components/DarkVeil";
import EnhanceReliabilitySection from "@/components/EnhanceReliabilitySection";
import FaqSection from "@/components/FaqSection";
import LandingPageTitle from "@/components/LandingPageTitle";
import LogoLoop from "@/components/LogoLoop";
import PricingSection from "@/components/PricingSection";
import ProductivityInsightsCard from "@/components/ProductivityInsightsCard";
import ProjectsChartSVG from "@/components/ProjectsChartSVG";
import ReadyToStartSection from "@/components/ReadyToStartSection";
import ShinyText from "@/components/ShinyText";
import TeamCollaborationSection from "@/components/TeamCollaborationSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getDashboardUrl } from "@/lib/dashboard-url";
import {
  ChartColumnIcon,
  Clock01Icon,
  Facebook01Icon,
  InstagramIcon,
  Layers01Icon,
  NewTwitterIcon,
  PlusSignIcon,
  RepeatIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
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
  const dashboardUrl = getDashboardUrl();

  return (
    <div className="font-sans overflow-x-hidden">
      <div
        className="absolute top-5 left-0 w-3/6 right-0 z-30 h-10 flex items-center justify-center px-4 bg-[#5227FF]/10 ml-auto border-l-8"
      >
        <div className="w-full max-w-6xl flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-center">
          <p className="text-xs sm:text-sm text-white/90">
            We&apos;re taking early adopters - get exclusive discounts on Zot.
          </p>
          <Link
            href="#pricing"
            className="inline-flex items-center text-xs sm:text-sm font-medium text-white hover:text-white/90 transition-colors shrink-0 underline decoration-2"
          >
            Try now →
          </Link>
        </div>
      </div>

      <div className="w-full h-screen absolute -z-10 bg-[#4338ca]/5">
        <DarkVeil
          speed={1}
          hueShift={0}
          noiseIntensity={0.1}
          scanlineIntensity={5}
          scanlineFrequency={1}
          warpAmount={0}
        />
      </div>

      <header className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 text-muted-foreground absolute top-8 left-0 right-0 z-20">
        <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 items-center">
          <Image
            src="/icons/zot-icon-only.svg"
            alt="Zot"
            width={28}
            height={28}
            className="shrink-0 filter-[drop-shadow(0_0_4px_rgba(255,255,255,0.75))_drop-shadow(0_0_10px_rgba(255,255,255,0.4))_drop-shadow(0_0_18px_rgba(59,130,246,0.5))_drop-shadow(0_0_26px_rgba(30,58,138,0.45))]"
          />
          <nav className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 items-center">
            <Link href="#integration" className="ml-0 md:ml-4 text-sm hover:text-foreground">Integration</Link>
            <Link href="#pricing" className="text-sm hover:text-foreground">Pricing</Link>
            <Link href="#testimonial" className="text-sm hover:text-foreground">Testimonial</Link>
            <Link href="#contact" className="text-sm hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </header>

      <div aria-label="Hero section" className="flex justify-center items-center w-full min-h-screen flex-col pt-28 sm:pt-32 pb-32 sm:pb-24">
        <div className="mb-16 sm:mb-20 lg:mb-36 flex justify-center items-center w-full gap-4 sm:gap-4 flex-col px-4 sm:px-6">
          <div className="bg-black/30 hover:bg-zinc-600/10 transition backdrop-blur-md px-3 sm:px-5 pr-2 py-1.5 rounded-full border flex items-center gap-2 sm:gap-4 cursor-pointer flex-wrap justify-center">
            <ShinyText
              text="Start measuring your idea"
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
            <button className="bg-zinc-900 rounded-full text-white px-3 sm:px-4 py-1 text-xs sm:text-sm shrink-0">
              Join now
            </button>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl text-center leading-tight px-2 relative">
            Build, measure, feedback
          </h1>
          <h3 className="text-muted-foreground text-base sm:text-lg md:text-xl text-center max-w-[50ch] px-4">
            For developers validating their products, analytics and AI tools are the backbone, turn your data into actions with Zot
          </h3>

          <div className="flex flex-wrap gap-3 sm:gap-6 justify-center mt-2">
            <Link href={dashboardUrl} className="bg-zinc-200 hover:px-8 transition-all hover:bg-zinc-300 ring-2 ring-zinc-700 text-black px-5 sm:px-6 py-1.5 border rounded-full cursor-pointer inline-flex items-center justify-center text-sm sm:text-base">Get started</Link>
            <Link href={dashboardUrl} className="backdrop-blur-md border px-5 sm:px-6 py-1.5 rounded-full cursor-pointer inline-flex items-center justify-center text-sm sm:text-base">Start free trial</Link>
          </div>
        </div>

        <div className="absolute bottom-8 sm:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-4xl px-4">
          <span className="text-xs sm:text-sm text-foreground/80 text-center">
            Join over 1,000 startups and start to maximize your productivity.
          </span>

          <div className="h-[40px] sm:h-[48px] w-full max-w-[95%] relative overflow-hidden">
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

      <section className="px-4 sm:px-6 md:px-8 lg:px-16 pb-20 sm:pb-24 lg:pb-32 bg-[#000000]">
        <LandingPageTitle
          subtitle="Productivity insights"
          title={{ before: "Advanced", gradient: "Analytics" }}
          gradient={{ colors: ["#5227FF", "#ffffff"], animationSpeed: 16 }}
          description="Gain valuable insights into your productivity with detailed reports that help you understand your habits."
        />

        {/* Card container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 sm:mt-12 lg:mt-16">
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
            <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -left-[12.5px] -top-[12.5px] z-50 text-zinc-700" />

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
            <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -right-[12.5px] -top-[12.5px] z-50 text-zinc-700" />
            <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -left-[12.5px] -bottom-[12.5px] z-50 text-zinc-700" />

            <div
              className="border border-white/10 rounded-none rounded-bl-none rounded-tr-none aspect-square min-h-[280px] sm:min-h-[320px] relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse 80% 80% at 50% 40%, rgba(82, 39, 255, 0.35) 0%, rgba(82, 39, 255, 0.12) 35%, transparent 70%), #000000",
              }}>
              <div className="p-6 sm:p-8 lg:p-12">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <HugeiconsIcon icon={ChartColumnIcon} className="size-7" />
                  <h3 className="text-2xl sm:text-3xl">Goal tracking</h3>
                  <h4 className="text-muted-foreground max-w-[40ch] text-sm sm:text-base">
                    Set personal or team goals and track your progress.
                    See how close you are to achieving your objectives and stay motivated.
                  </h4>
                </div>
              </div>

              <div className="border-t border-l ml-auto w-5/6 h-full rounded rounded-tr-none bg-black backdrop-blur-3xl relative">
                <div className="m-2 bg-zinc-900 border rounded w-full min-h-[160px] sm:h-[200px] p-3 sm:p-4 relative">
                  <h4 className="text-base sm:text-lg font-medium">Projects completed</h4>
                  <h6 className="text-muted-foreground text-sm">
                    Hey! You&apos;re doing a great job, it <br className="hidden sm:block" /> looks like you&apos;re <span className="text-white font-medium">on track!</span>
                  </h6>

                  <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 flex flex-wrap items-center gap-2 sm:gap-0">
                    <h2 className="text-2xl sm:text-4xl font-semibold">3.2k</h2>
                    <div className="flex ml-2 sm:ml-6 gap-2 flex-wrap items-center">
                      <div className="border border-green-700 bg-green-500/20 rounded-full text-emerald-700 px-2 flex items-center text-xs">
                        26%
                      </div>
                      <span className="text-muted-foreground text-xs sm:text-sm">Compared to last month</span>
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

        {/* Enhance Reliability Section */}
        <EnhanceReliabilitySection />
      </section>

      <TeamCollaborationSection />


      <section className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 pb-20 sm:pb-24 lg:pb-32 bg-[#000000]">
        <LandingPageTitle
          subtitle="Automated scheduling"
          title={{ before: "Comprehensive", gradient: "task management" }}
          gradient={{ colors: ["#22C55E", "#00FF88"], animationSpeed: 16 }}
          description="Effortlessly manage and prioritize your tasks using Ra diyal's intuitive interface, keeping your workload organized."
        />

        {/* Card principal: imagen (con difuminado) a la izquierda, texto a la derecha */}
        <div className="mt-10 sm:mt-12 lg:mt-16 relative">
          <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -left-[12.5px] -top-[12.5px] z-50 text-zinc-700" />
          <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -right-[12.5px] -bottom-[12.5px] z-50 text-zinc-700" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden border border-white/10 rounded-br-none rounded-tl-none min-h-[280px] sm:min-h-[320px]"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(82, 39, 255, 0.2) 0%, rgba(82, 39, 255, 0.06) 40%, transparent 70%), #000000",
            }}
          >
            {/* Lado izquierdo: imagen con difuminado en el borde derecho */}
            <div className="relative h-[280px] lg:h-auto lg:min-h-[320px] shrink-0">
              <div className="absolute inset-0 bg-zinc-900/80">
                {/* Sustituir por <Image /> cuando tengas la imagen en /public (ej. task-management-preview.png) */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url(/ai-editor-2.png)",
                    backgroundColor: "rgb(39 39 42)", // fallback si no hay imagen
                  }}
                />
              </div>
              {/* Difuminado: gradiente para integrar la imagen con el fondo de la card */}
              <div
                className="absolute inset-y-0 right-0 w-1/3 min-w-[120px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to left, #000000 0%, rgba(0,0,0,0.85) 35%, transparent 100%)",
                }}
              />
            </div>

            {/* Lado derecho: texto */}
            <div className="flex flex-col justify-center gap-3 sm:gap-4 p-6 sm:p-8 lg:p-10 xl:p-12">
              <h3 className="text-xl sm:text-2xl lg:text-3xl">
                Efficient Task Organization
              </h3>
              <p className="text-muted-foreground max-w-[44ch] text-sm sm:text-base">
                Streamline your workflow by organizing tasks intuitively and
                efficiently. With smart task management, you can easily create,
                categorize, and prioritize tasks, ensuring nothing falls through
                the cracks and every goal is tackled with precision and timeliness.
              </p>
              <Link
                href="#integration"
                className="text-sm text-foreground/90 hover:text-foreground inline-flex items-center gap-1 w-fit"
              >
                Learn more
                <span aria-hidden className="ml-0.5">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tres cards de características */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: Layers01Icon,
              title: "Organize with ease",
              description:
                "Create, categorize, and prioritize tasks effortlessly.",
            },
            {
              icon: Clock01Icon,
              title: "Deadline reminders",
              description:
                "Set task reminders to receive notifications on time.",
            },
            {
              icon: RepeatIcon,
              title: "Recurring tasks",
              description:
                "Set recurring tasks for regular activities to save time.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="relative border border-white/10 rounded-lg rounded-br-none rounded-tl-none overflow-hidden pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 px-5 sm:px-6 lg:px-8 flex flex-col gap-3 sm:gap-4 transition hover:border-white/15"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(82, 39, 255, 0.12) 0%, rgba(82, 39, 255, 0.04) 40%, transparent 70%), #000000",
              }}
            >
              <HugeiconsIcon
                icon={item.icon}
                size={28}
                strokeWidth={1.5}
                className="text-foreground"
              />
              <h4 className="text-lg sm:text-xl font-semibold">{item.title}</h4>
              <p className="text-muted-foreground text-sm max-w-[36ch]">
                {item.description}
              </p>
              <Link
                href="#integration"
                className="text-sm text-foreground/90 hover:text-foreground inline-flex items-center gap-1 w-fit mt-auto"
              >
                Learn more
                <span aria-hidden className="ml-0.5">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <TestimonialsSection />

      <PricingSection />

      <ReadyToStartSection />

      <FaqSection />

      <footer
        id="contact"
        className="relative px-4 sm:px-6 py-12 sm:py-16 text-center"
        style={{ backgroundColor: "#0B0B0E" }}
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 sm:gap-8">
          <Link href="/" className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full">
            <Image
              src="/icons/zot-icon-only.svg"
              alt="Zot"
              width={32}
              height={32}
              className="text-white filter-[drop-shadow(0_0_6px_rgba(255,255,255,0.5))_drop-shadow(0_0_12px_rgba(82,39,255,0.4))]"
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-white/90">
            <Link href="#integration" className="hover:text-white transition-colors">
              Integration
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#testimonial" className="hover:text-white transition-colors">
              Testimonial
            </Link>
            <Link href="#contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center justify-center gap-4 sm:gap-6" aria-label="Redes sociales">
            <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="X (Twitter)">
              <HugeiconsIcon icon={NewTwitterIcon} size={22} strokeWidth={1.5} />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Instagram">
              <HugeiconsIcon icon={InstagramIcon} size={22} strokeWidth={1.5} />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Facebook">
              <HugeiconsIcon icon={Facebook01Icon} size={22} strokeWidth={1.5} />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="TikTok">
              <HugeiconsIcon icon={TiktokIcon} size={22} strokeWidth={1.5} />
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="YouTube">
              <HugeiconsIcon icon={YoutubeIcon} size={22} strokeWidth={1.5} />
            </a>
          </div>

          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Zot. All rights reserved.
          </p>
        </div>
      </footer>
    </div >
  )
}
