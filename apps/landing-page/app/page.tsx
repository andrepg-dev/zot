import DemoSection from "@/components/DemoSection";
import DeveloperToolsSection from "@/components/DeveloperToolsSection";
import HeroCodePreview from "@/components/HeroCodePreview";
import HeroInstallCommand from "@/components/HeroInstallCommand";
import LandingPageTitle from "@/components/LandingPageTitle";
import type { LogoItem } from "@/components/LogoLoop";
import LogoLoop from "@/components/LogoLoop";
import ProductivityInsightsCard from "@/components/ProductivityInsightsCard";
import ProjectsChartSVG from "@/components/ProjectsChartSVG";
import { getDashboardUrl } from "@/lib/dashboard-url";
import {
  ChartColumnIcon,
  Facebook01Icon,
  InstagramIcon,
  Mail01Icon,
  NewTwitterIcon,
  Notification03Icon,
  PlusSignIcon,
  ShieldKeyIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const DarkVeil = dynamic(() => import("@/components/DarkVeil"), {
  loading: () => <div className="absolute inset-0" aria-hidden />,
});

const HeroCascade = dynamic(() => import("@/components/HeroCascade"), {
  loading: () => (
    <div
      className="flex justify-center items-center w-full min-h-screen flex-col pt-28 sm:pt-32 pb-32 sm:pb-24"
      aria-label="Hero section"
    >
      <div className="flex mb-16 sm:mb-20 lg:mb-36 justify-center items-center w-full gap-4 flex-col px-4 sm:px-6 min-h-[50vh]" />
    </div>
  ),
});

const AnimatedContent = dynamic(() => import("@/components/AnimatedContent"), {
  loading: () => <div className="min-h-[200px]" />,
});

const EnhanceReliabilitySection = dynamic(
  () => import("@/components/EnhanceReliabilitySection")
);

const TeamCollaborationSection = dynamic(
  () => import("@/components/TeamCollaborationSection")
);

const TestimonialsSection = dynamic(
  () => import("@/components/TestimonialsSection")
);

const PricingSection = dynamic(() => import("@/components/PricingSection"));

const ReadyToStartSection = dynamic(
  () => import("@/components/ReadyToStartSection")
);

const FaqSection = dynamic(() => import("@/components/FaqSection"));

const ShinyText = dynamic(() => import("@/components/ShinyText"));

const logoipsumLogos: LogoItem[] = [
  { src: "/icons/zot-icon-only.svg", alt: "Zot", title: "Zot", width: 55, height: 32 },
  { src: "/logos/hopta-logo.svg", alt: "Hopta", title: "Hopta", width: 120, height: 32 },
  { src: "/logos/dymo-logo.svg", alt: "Dymo", title: "Dymo", width: 120, height: 32 },
];

export default function HomePage() {
  const dashboardUrl = getDashboardUrl();

  return (
    <div className="font-sans overflow-x-hidden">
      <div
        className="absolute top-5 left-0 w-3/6 right-0 z-30 h-10 hidden sm:flex items-center justify-center px-4 bg-[#006FEE]/10 ml-auto border-l-8 border-l-[#006FEE]"
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

      <div className="w-full h-screen absolute -z-10 bg-black bg-[url('/background.webp')] bg-cover bg-center">
        <DarkVeil
          speed={0.2}
          hueShift={20}
          noiseIntensity={0.1}
          scanlineIntensity={9}
          scanlineFrequency={0.15}
          warpAmount={2}
        />
      </div>

      <header className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 text-muted-foreground absolute top-8 left-0 right-0 z-20">
        <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 items-center">
          <Image
            src="/zot-icon.png"
            alt="Zot"
            width={32}
            height={32}
            className="shrink-0"
            priority
          />
          <nav className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 items-center">
            <Link href="#integration" className="ml-0 md:ml-4 text-sm hover:text-foreground">Features</Link>
            <Link href="#demo" className="text-sm hover:text-foreground">Demo</Link>
            <Link href="#pricing" className="text-sm hover:text-foreground">Pricing</Link>
            <a
              href="https://www.npmjs.com/package/@zot-core/sdk"
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:text-foreground"
            >
              SDK
            </a>
            <Link href="#faq" className="text-sm hover:text-foreground">FAQ</Link>
            <Link href="#contact" className="text-sm hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </header>

      <HeroCascade className="relative flex justify-center items-center w-full min-h-screen flex-col pt-28 sm:pt-32 pb-32 sm:pb-28" aria-label="Hero section">
        <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-12 xl:gap-16 items-center mb-16 sm:mb-20 lg:mb-28">
          <div className="flex flex-col gap-5 sm:gap-6 items-center lg:items-start text-center lg:text-left">
            <div
              data-hero-badge
              style={{ opacity: 0 }}
              className="hidden sm:inline-flex bg-black/30 hover:bg-zinc-600/10 transition backdrop-blur-md px-4 py-1.5 border items-center gap-2 sm:gap-4 cursor-pointer flex-wrap"
            >
              <ShinyText
                text="The indie hacker platform"
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
            </div>

            <h1
              data-hero-heading
              style={{ opacity: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[56px] xl:text-6xl leading-[1.05] tracking-tight relative perspective-[600px]"
            >
              Ship your waitlist <br /> in one command
            </h1>

            <h3
              data-hero-subtitle
              style={{ opacity: 0 }}
              className="text-muted-foreground text-base sm:text-lg max-w-[52ch] leading-relaxed"
            >
              The waitlist stack for developers. CLI, SDK, and agent
              integrations so you spend minutes, not days, collecting real
              leads.
            </h3>

            <div data-hero-command style={{ opacity: 0 }} className="w-full max-w-md">
              <HeroInstallCommand command="npx @zot-core/agents add waitlist" />
            </div>

            <div
              data-hero-ctas
              style={{ opacity: 0 }}
              className="flex flex-wrap gap-3 sm:gap-4 mt-1 justify-center lg:justify-start"
            >
              <Link
                href={dashboardUrl}
                className="bg-[#006FEE] hover:bg-[#0A84FF] hover:px-8 transition-all ring-1 ring-[#006FEE]/40 text-white px-5 sm:px-6 py-2 border border-[#006FEE]/60 cursor-pointer inline-flex items-center justify-center text-sm sm:text-base shadow-[0_0_24px_rgba(0,111,238,0.35)]"
              >
                Start Launching
              </Link>
              <Link
                href="#integration"
                className="backdrop-blur-md border border-white/20 bg-white/5 hover:bg-white/10 px-5 sm:px-6 py-2 cursor-pointer inline-flex items-center justify-center text-sm sm:text-base transition-all hover:px-8"
              >
                See how it works
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end w-full">
            <HeroCodePreview />
          </div>
        </div>

        <div
          data-hero-bottom
          style={{ opacity: 0 }}
          className="absolute bottom-8 sm:bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-4xl px-4"
        >
          <span className="text-xs sm:text-sm text-foreground/80 text-center">
            Trusted by founders and indie hackers shipping real products
          </span>

          <div className="h-[40px] sm:h-[48px] w-full max-w-[95%] relative overflow-hidden">
            <LogoLoop
              logos={logoipsumLogos}
              speed={10}
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
      </HeroCascade>

      <DeveloperToolsSection />

      <DemoSection />

      <section className="content-visibility-auto px-4 sm:px-6 md:px-8 lg:px-16 pb-20 sm:pb-24 lg:pb-32 bg-black">
        <LandingPageTitle
          subtitle="Waitlist insights"
          title={{ before: "Real-time", gradient: "analytics" }}
          gradient={{ colors: ["#006FEE", "#ffffff"], animationSpeed: 16 }}
          description="Track signups, referrals, conversion rates and traffic sources as they happen. Know if you have traction or if it&apos;s time to pivot."
          classNames={{
            description: "max-w-[50ch]"
          }}
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
              previewImage={{ src: "/analytics-4.webp", alt: "Screenshot de analytics" }}
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
              className="border border-white/10 aspect-square min-h-[280px] sm:min-h-[320px] relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse 80% 80% at 50% 40%, rgba(0, 111, 238, 0.35) 0%, rgba(0, 111, 238, 0.12) 35%, transparent 70%), #000000",
              }}>
              <div className="p-6 sm:p-8 lg:p-12">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <HugeiconsIcon icon={ChartColumnIcon} className="size-7" />
                  <h3 className="text-2xl sm:text-3xl">Growth tracking</h3>
                  <h4 className="text-muted-foreground max-w-[40ch] text-sm sm:text-base">
                    Daily signups, referral performance, and conversion rates at a glance. Make data-driven decisions with a single dashboard.
                  </h4>
                </div>
              </div>

              <div className="border-t border-l ml-auto w-5/6 h-full bg-black backdrop-blur-3xl relative">
                <div className="m-2 bg-zinc-900 border w-full min-h-[160px] sm:h-[200px] p-3 sm:p-4 relative">
                  <h4 className="text-base sm:text-lg font-medium">Total sign ups</h4>
                  <h6 className="text-muted-foreground">
                    Your waitlist is growing, it <br className="hidden sm:block" /> looks like there&apos;s <span className="text-white font-medium">real traction!</span>
                  </h6>

                  <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 flex flex-wrap items-center gap-2 sm:gap-0">
                    <h2 className="text-2xl sm:text-4xl font-semibold">18.2k</h2>
                    <div className="flex ml-2 sm:ml-6 gap-2 flex-wrap items-center">
                      <div className="border border-green-700 bg-green-500/20 text-emerald-700 px-2 flex items-center text-xs">
                        +12.5%
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

      <div className="content-visibility-auto">
        <TeamCollaborationSection />
      </div>


      <section className="content-visibility-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 pb-20 sm:pb-24 lg:pb-32 bg-[#000000]">
        <LandingPageTitle
          subtitle="Stay connected"
          title={{ before: "Emails &", gradient: "notifications" }}
          gradient={{ colors: ["#22C55E", "#00FF88"], animationSpeed: 16 }}
          description="Write email templates in code with React Email, send them straight to your waitlist, and get real-time notifications. Full control, zero guesswork."
        />

        {/* Card principal: imagen (con difuminado) a la izquierda, texto a la derecha */}
        <div className="mt-10 sm:mt-12 lg:mt-16 relative">
          <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -left-[12.5px] -top-[12.5px] z-50 text-zinc-700" />
          <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={1} className="absolute -right-[12.5px] -bottom-[12.5px] z-50 text-zinc-700" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden border border-white/10 min-h-[280px] sm:min-h-[320px]"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(0, 111, 238, 0.2) 0%, rgba(0, 111, 238, 0.06) 40%, transparent 70%), #000000",
            }}
          >
            {/* Lado izquierdo: imagen con difuminado en el borde derecho */}
            <div className="relative h-[280px] lg:h-auto lg:min-h-[320px] shrink-0">
              <div className="absolute inset-0 bg-zinc-900/80">
                <Image
                  src="/ai-editor-2.webp"
                  alt="AI editor preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
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
                Code your emails, own the design
              </h3>
              <p className="text-muted-foreground max-w-[44ch] text-sm sm:text-base">
                Build and edit email templates as React components with
                React Email. Full control over every pixel, version them in
                git, and send updates, referral links, and announcements to
                your waitlist whenever you need.
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
              icon: Mail01Icon,
              title: "Code-first templates",
              description:
                "Write email templates as React components with React Email. Ship exactly the emails your users deserve, version-controlled in your repo.",
            },
            {
              icon: Notification03Icon,
              title: "Milestone alerts",
              description:
                "Email notifications every time your waitlist hits a new milestone. Stay on top of growth without babysitting the dashboard.",
            },
            {
              icon: ShieldKeyIcon,
              title: "Fake email blocking",
              description:
                "Disposable and throwaway emails are blocked automatically. Your leads stay clean without a single line of config.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="relative border border-white/10 overflow-hidden pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 px-5 sm:px-6 lg:px-8 flex flex-col gap-3 sm:gap-4 transition hover:border-white/15"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0, 111, 238, 0.12) 0%, rgba(0, 111, 238, 0.04) 40%, transparent 70%), #000000",
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

      <div className="content-visibility-auto">
        <TestimonialsSection />
      </div>

      <div className="content-visibility-auto">
        <PricingSection />
      </div>

      <div className="content-visibility-auto">
        <ReadyToStartSection />
      </div>

      <div className="content-visibility-auto">
        <FaqSection />
      </div>

      <footer
        id="contact"
        className="relative px-4 sm:px-6 py-12 sm:py-16 text-center border-t"
        style={{ backgroundColor: "#121214" }}
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 sm:gap-8">
          <Link href="/" className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
            <Image
              src="/zot-icon.png"
              alt="Zot"
              width={40}
              height={40}
              className="filter-[drop-shadow(0_0_8px_rgba(255,255,255,0.45))_drop-shadow(0_0_16px_rgba(0,111,238,0.5))]"
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-white/90">
            <Link href="#integration" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#demo" className="hover:text-white transition-colors">
              Demo
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <a
              href="https://www.npmjs.com/package/@zot-core/sdk"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              SDK
            </a>
            <Link href="#faq" className="hover:text-white transition-colors">
              FAQ
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
