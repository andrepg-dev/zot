import AnimatedContent from "@/components/AnimatedContent";
import DarkVeil from "@/components/DarkVeil";
import EnhanceReliabilitySection from "@/components/EnhanceReliabilitySection";
import FaqSection from "@/components/FaqSection";
import LandingPageTitle from "@/components/LandingPageTitle";
import LogoLoop from "@/components/LogoLoop";
import ProductivityInsightsCard from "@/components/ProductivityInsightsCard";
import ProjectsChartSVG from "@/components/ProjectsChartSVG";
import ReadyToStartSection from "@/components/ReadyToStartSection";
import ShinyText from "@/components/ShinyText";
import TeamCollaborationSection from "@/components/TeamCollaborationSection";
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

      <section className="px-16 pb-32 bg-[#000000]">
        <LandingPageTitle
          subtitle="Productivity insights"
          title={{ before: "Advanced", gradient: "Analytics" }}
          gradient={{ colors: ["#5227FF", "#ffffff"], animationSpeed: 16 }}
          description="Gain valuable insights into your productivity with detailed reports that help you understand your habits."
        />

        {/* Card container */}
        <div className="grid grid-cols-2 gap-6 mt-16">
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

        {/* Enhance Reliability Section */}
        <EnhanceReliabilitySection />
      </section>

      <TeamCollaborationSection />

      <section className="px-24 pb-32 bg-[#000000]">
        <LandingPageTitle
          subtitle="Automated scheduling"
          title={{ before: "Comprehensive", gradient: "task management" }}
          gradient={{ colors: ["#22C55E", "#00FF88"], animationSpeed: 16 }}
          description="Effortlessly manage and prioritize your tasks using Ra diyal's intuitive interface, keeping your workload organized."
        />

        {/* Card principal: imagen (con difuminado) a la izquierda, texto a la derecha */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden border border-white/10 rounded-xl rounded-br-none rounded-tl-none min-h-[320px]"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(34, 197, 94, 0.2) 0%, rgba(0, 255, 136, 0.06) 40%, transparent 70%), #000000",
          }}
        >
          {/* Lado izquierdo: imagen con difuminado en el borde derecho */}
          <div className="relative h-[280px] lg:h-auto lg:min-h-[320px] shrink-0">
            <div className="absolute inset-0 bg-zinc-900/80">
              {/* Sustituir por <Image /> cuando tengas la imagen en /public (ej. task-management-preview.png) */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url(/task-management-preview.png)",
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
          <div className="flex flex-col justify-center gap-4 p-10 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-semibold">
              Efficient Task Organization
            </h3>
            <p className="text-muted-foreground max-w-[44ch]">
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

        {/* Tres cards de características */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="border border-white/10 rounded-xl rounded-br-none rounded-tl-none overflow-hidden p-8 flex flex-col gap-4 transition hover:border-white/15"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.12) 0%, rgba(0, 255, 136, 0.04) 40%, transparent 70%), #000000",
              }}
            >
              <HugeiconsIcon
                icon={item.icon}
                size={28}
                strokeWidth={1.5}
                className="text-foreground"
              />
              <h4 className="text-xl font-semibold">{item.title}</h4>
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

      <ReadyToStartSection />

      <FaqSection />

      <footer
        className="relative px-6 py-16 text-center"
        style={{ backgroundColor: "#0B0B0E" }}
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8">
          <Link href="/" className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full">
            <Image
              src="/icons/zot-icon-only.svg"
              alt="Zot"
              width={32}
              height={32}
              className="text-white filter-[drop-shadow(0_0_6px_rgba(255,255,255,0.5))_drop-shadow(0_0_12px_rgba(82,39,255,0.4))]"
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
            <Link href="#integration" className="hover:text-white transition-colors">
              Integration
            </Link>
            <Link href="#integration" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#integration" className="hover:text-white transition-colors">
              Testimonial
            </Link>
            <Link href="#integration" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center justify-center gap-6" aria-label="Redes sociales">
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
