import LandingPageTitle from "@/components/LandingPageTitle";
import type { LogoItem } from "@/components/LogoLoop";
import LogoLoop from "@/components/LogoLoop";
import ProductivityInsightsCard from "@/components/ProductivityInsightsCard";
import ProjectsChartSVG from "@/components/ProjectsChartSVG";
import ShinyText from "@/components/ShinyText";
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
        className="absolute top-5 border-l-primary left-0 w-3/6 right-0 z-30 h-10 hidden sm:flex items-center justify-center px-4 bg-[#5227FF]/10 ml-auto border-l-8"
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
          speed={2.5}
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
            src="/zot-icon.svg"
            alt="Zot"
            width={28}
            height={28}
            className="shrink-0"
            priority
          />
          <nav className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 items-center">
            <Link href="#integration" className="ml-0 md:ml-4 text-sm hover:text-foreground">Features</Link>
            <Link href="#pricing" className="text-sm hover:text-foreground">Pricing</Link>
            <Link href="#faq" className="text-sm hover:text-foreground">FAQ</Link>
            <Link href="#contact" className="text-sm hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </header>

      <HeroCascade className="flex justify-center items-center w-full min-h-screen flex-col pt-28 sm:pt-32 pb-32 sm:pb-24" aria-label="Hero section">
        <div className="flex mb-16 sm:mb-20 lg:mb-36 justify-center items-center w-full gap-4 sm:gap-4 flex-col px-4 sm:px-6">
          <div data-hero-badge style={{ opacity: 0 }} className="hidden sm:flex bg-black/30 hover:bg-zinc-600/10 transition backdrop-blur-md px-3 sm:px-5 sm:pr-2 pr-2 py-1.5 rounded-full border items-center gap-2 sm:gap-4 cursor-pointer flex-wrap justify-center">
            <ShinyText
              text="Start executing your business idea with our services"
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

          <h1
            data-hero-heading
            style={{ opacity: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl text-center leading-tight px-2 relative perspective-[600px]"
          >
            Build products  <br /> The world actually needs
          </h1>
          <h3 data-hero-subtitle style={{ opacity: 0 }} className="text-muted-foreground text-base sm:text-lg md:text-xl text-center max-w-[50ch] px-4">
            For developers validating their products, AI tools and analytics are the backbone, launch products and collect leads with Zot
          </h3>

          <div data-hero-ctas style={{ opacity: 0 }} className="flex flex-wrap gap-3 sm:gap-6 justify-center mt-2">
            <Link href={dashboardUrl} className="bg-zinc-200 hover:px-8 transition-all hover:bg-zinc-300 ring-2 ring-zinc-700 text-black px-5 sm:px-6 py-1.5 border rounded-full cursor-pointer inline-flex items-center justify-center text-sm sm:text-base">
              Start Launching
            </Link>
            <Link href={dashboardUrl} className="backdrop-blur-md border px-5 sm:px-6 py-1.5 rounded-full cursor-pointer inline-flex items-center justify-center text-sm sm:text-base transition-all hover:px-8">
              Start free trial
            </Link>
          </div>
        </div>

        <div data-hero-bottom style={{ opacity: 0 }} className="absolute bottom-8 sm:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-4xl px-4">
          <span className="text-xs sm:text-sm text-foreground/80 text-center">
            Connect with top startups and founders to accelerate your growth
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

      <section className="content-visibility-auto px-4 sm:px-6 md:px-8 lg:px-16 pb-20 sm:pb-24 lg:pb-32 bg-black">
        <LandingPageTitle
          subtitle="WaitList insights"
          title={{ before: "Advanced", gradient: "Analytics" }}
          gradient={{ colors: ["#5227FF", "#ffffff"], animationSpeed: 16 }}
          description="Track sign ups, referrals, and engagement in real time. Know exactly if your idea has traction or if it's time to pivot."
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
              className="border border-white/10 rounded-none rounded-bl-none rounded-tr-none aspect-square min-h-[280px] sm:min-h-[320px] relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse 80% 80% at 50% 40%, rgba(82, 39, 255, 0.35) 0%, rgba(82, 39, 255, 0.12) 35%, transparent 70%), #000000",
              }}>
              <div className="p-6 sm:p-8 lg:p-12">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <HugeiconsIcon icon={ChartColumnIcon} className="size-7" />
                  <h3 className="text-2xl sm:text-3xl">Growth tracking</h3>
                  <h4 className="text-muted-foreground max-w-[40ch] text-sm sm:text-base">
                    Monitor daily sign ups, referral performance, and conversion rates.
                    See if your community is growing and make data-driven decisions.
                  </h4>
                </div>
              </div>

              <div className="border-t border-l ml-auto w-5/6 h-full rounded rounded-tr-none bg-black backdrop-blur-3xl relative">
                <div className="m-2 bg-zinc-900 border rounded w-full min-h-[160px] sm:h-[200px] p-3 sm:p-4 relative">
                  <h4 className="text-base sm:text-lg font-medium">Total sign ups</h4>
                  <h6 className="text-muted-foreground">
                    Your waitlist is growing, it <br className="hidden sm:block" /> looks like there&apos;s <span className="text-white font-medium">real traction!</span>
                  </h6>

                  <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 flex flex-wrap items-center gap-2 sm:gap-0">
                    <h2 className="text-2xl sm:text-4xl font-semibold">18.2k</h2>
                    <div className="flex ml-2 sm:ml-6 gap-2 flex-wrap items-center">
                      <div className="border border-green-700 bg-green-500/20 rounded-full text-emerald-700 px-2 flex items-center text-xs">
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
          description="Build email templates with code using React Email, send them to your waitlist, and get real-time notifications. Full control, zero guesswork."
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
                {/* Sustituir por <Image /> cuando tengas la imagen en /public (ej. task-management-preview.webp) */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url(/ai-editor-2.webp)",
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
                Code your emails, own the design
              </h3>
              <p className="text-muted-foreground max-w-[44ch] text-sm sm:text-base">
                Create and edit email templates directly with code using
                React Email. You stay close to the code, with full control
                over every pixel. Send updates, referral links, and
                announcements to your waitlist whenever you need.
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
                "Write your email templates with React Email. Full code control to craft exactly the emails your users deserve.",
            },
            {
              icon: Notification03Icon,
              title: "Milestone alerts",
              description:
                "Get notified about new sign ups at the frequency you choose.",
            },
            {
              icon: ShieldKeyIcon,
              title: "Fake email blocking",
              description:
                "Disposable and fake emails are automatically blocked, keeping your leads clean.",
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
              Features
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
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
