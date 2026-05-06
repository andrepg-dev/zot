import DemoSection from "@/components/DemoSection";
import DeveloperToolsSection from "@/components/DeveloperToolsSection";
import HeroCodePreview from "@/components/HeroCodePreview";
import HeroInstallCommand from "@/components/HeroInstallCommand";
import LandingPageTitle from "@/components/LandingPageTitle";
import type { LogoItem } from "@/components/LogoLoop";
import LogoLoop from "@/components/LogoLoop";
import ProductivityInsightsCard from "@/components/ProductivityInsightsCard";
import WebWindowCard from "@/components/WebWindowCard";
import { getDashboardUrl } from "@/lib/dashboard-url";
import {
  PlusSignIcon,
  ShieldKeyIcon,
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
      <div className="w-full h-screen absolute -z-10 bg-black bg-[url('/background.avif')] bg-cover bg-center">
        <DarkVeil
          speed={0.1}
          hueShift={20}
          noiseIntensity={0.1}
          scanlineIntensity={9}
          scanlineFrequency={0.15}
          warpAmount={2}
        />
      </div>

      <header className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 text-muted-foreground absolute top-14 sm:top-16 left-0 right-0 z-20">
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
            <Link href="#integration" className="ml-0 md:ml-4 text-sm hover:text-foreground">Integrations</Link>
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
        <div className="w-full sm:max-w-[1400px] 2xl:max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-12 xl:gap-16 items-center mb-16 sm:mb-20 lg:mb-28">
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
              Ship your waitlist <br /> <span className="text-muted-foreground">in one command</span>
            </h1>

            <h3
              data-hero-subtitle
              style={{ opacity: 0 }}
              className="text-muted-foreground text-base sm:text-lg max-w-[52ch] leading-relaxed"
            >
              Waitlists, email campaigns, fake user blocking, webhooks,
              and more. All wired up in minutes.
            </h3>

            <div data-hero-command style={{ opacity: 0 }} className="w-full max-w-md">
              <HeroInstallCommand command="npx skills add launch-waitlist-zot/zot-skills" />
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
                href="#demo"
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
              previewImage={{ src: "/waitlist-dashboard.avif", alt: "Waitlist dashboard preview" }}
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
              <div className="p-6 sm:p-8 lg:p-12 relative z-10">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <HugeiconsIcon icon={ShieldKeyIcon} className="size-7" />
                  <h3 className="text-2xl sm:text-3xl">Fake user blocking</h3>
                  <h4 className="text-muted-foreground max-w-[40ch] text-sm sm:text-base">
                    Disposable and invalid emails are filtered automatically so your waitlist stays clean and every lead is real.
                  </h4>
                </div>
              </div>

              <div className="absolute inset-x-4 sm:inset-x-6 bottom-4 sm:bottom-6 top-[42%] sm:top-[40%] border border-white/10 overflow-hidden bg-black">
                <WebWindowCard
                  url="app.zot.so/security"
                  title="Fake user blocking"
                  description="Blocked emails preview"
                  imageSrc="/users-blocked.avif"
                  imageAlt="Blocked users preview"
                />
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
              Integrations
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

          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Zot. All rights reserved.
          </p>
        </div>
      </footer>
    </div >
  )
}
