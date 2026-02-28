import Grainient from "@/components/Grainient";
import LandingPageTitle from "@/components/LandingPageTitle";
import { getDashboardUrl } from "@/lib/dashboard-url";
import { Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

/** Planes alineados con apps/client/constants/billing-constant.ts */
const PLANS = [
  {
    name: "Free",
    price: "$0",
    frequency: "/ month",
    blurb: "Perfect to validate an idea and run simple launches.",
    ctaLabel: "Get started",
    ctaHref: "#testimonial",
    popular: false,
    features: [
      "15,000 users signup limit",
      "3 waitlists maximum",
      "3 landing pages maximum",
      "2,000 users emailed per month",
      "10 email templates",
      "Custom email creation",
      "Export your data",
      "1 domain for branded emails and landing pages",
      "Analytics for signups and sent emails",
      "Trend search powered by Google Search",
    ],
  },
  {
    name: "Premium",
    price: "$49",
    frequency: "/ month",
    /** Descuento early-user: 3 meses por $25. Si está definido, se muestra precio tachado y la oferta. */
    earlyUserOffer: {
      price: "$25",
      period: "3 months",
      label: "Early user offer",
    },
    blurb: "For products in production that need headroom and support.",
    ctaLabel: "Start free trial",
    ctaHref: "#testimonial",
    popular: true,
    features: [
      "Unlimited users signup",
      "50 waitlists maximum",
      "50 landing pages maximum",
      "30,000 users emailed per month",
      "50 email templates",
      "Custom email creation",
      "10 domains for emails and landing pages",
      "Extra security to block fake or disposable emails",
      "Analytics for sent emails and registered users",
      "Export your data",
      "Use more powerful AI models",
    ],
  },
  {
    name: "Scale",
    price: "$180",
    frequency: "/ month",
    blurb: "Built for fast-growing teams with heavy launch pipelines.",
    ctaLabel: "Contact sales",
    ctaHref: "#testimonial",
    popular: false,
    features: [
      "Unlimited users per month signup limit",
      "100 waitlists maximum",
      "100 landing pages maximum",
      "200 email templates",
      "100,000 users emailed per month",
      "500 domains for emails and landing pages",
      "Extra security to block fake or disposable emails",
      "Analytics for sent emails and registered users",
      "Export your data",
      "Use more powerful AI models",
    ],
  },
];

export default function PricingSection() {
  const dashboardUrl = getDashboardUrl();
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-16 pb-16 sm:pb-20 lg:pb-24 pt-12 sm:pt-14 lg:pt-16 bg-[#000000]" id="pricing">
      <LandingPageTitle
        subtitle="Pricing"
        title={{ before: "Choose the plan that", gradient: "fits" }}
        gradient={{ colors: ["#a78bfa", "#c4b5fd"], animationSpeed: 16 }}
        description="Transparent pricing with zero surprises. Upgrade when you need more room to scale launches, emails, and domains."
      />

      <div className="mx-auto mt-10 sm:mt-12 lg:mt-16 grid max-w-6xl grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3 items-start px-0">
        {PLANS.map((plan) => {
          const isPremium = "earlyUserOffer" in plan && plan.earlyUserOffer;
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col border overflow-hidden border-white/10 bg-black/30 ${isPremium ? "" : "backdrop-blur"}`}
            >
              {/* Background: Grainient solo en card central; laterales fondo oscuro plano */}
              <div className="absolute inset-0 pointer-events-none w-full h-full min-h-[400px]">
                {isPremium ? (
                  <>
                    <Grainient
                      color1="#3f3f46"
                      color2="#27272a"
                      color3="#0D0D0E"
                      timeSpeed={0}
                      colorBalance={0}
                      warpStrength={1}
                      warpFrequency={5}
                      warpSpeed={0}
                      warpAmplitude={50}
                      blendAngle={0}
                      blendSoftness={0.08}
                      rotationAmount={500}
                      noiseScale={1.5}
                      grainAmount={0.07}
                      grainScale={1.5}
                      grainAnimated={false}
                      contrast={1.3}
                      gamma={1}
                      saturation={0.85}
                      centerX={-0.5}
                      centerY={0}
                      zoom={0.85}
                      vignetteStrength={0.55}
                      vignetteRadius={0.35}
                      centerVariation={0.2}
                      className="absolute inset-0 w-full h-full"
                    />
                    <div className="absolute inset-0 bg-[#0D0D0E]/50 pointer-events-none" aria-hidden />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to right, rgba(13,13,14,0.9) 0%, rgba(13,13,14,0.45) 40%, transparent 70%)" }}
                      aria-hidden
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-zinc-900/90" aria-hidden />
                )}
              </div>

              <div className={`relative z-10 flex flex-col flex-1 p-4 sm:p-5 lg:p-6 ${isPremium ? "bg-[#0D0D0E]/60" : "bg-black/40"}`}>
                {"earlyUserOffer" in plan && plan.earlyUserOffer && (
                  <span className="absolute right-4 top-4 rounded-full bg-[#4338ca] px-3 py-1 text-xs font-semibold text-white z-20">
                    Early user offer
                  </span>
                )}

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-[#a78bfa]">
                    {plan.name}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {plan.blurb}
                  </p>
                  {"earlyUserOffer" in plan && plan.earlyUserOffer && (
                    <p className="text-xs font-medium text-zinc-400">
                      {plan.earlyUserOffer.label}
                    </p>
                  )}
                  <div className="flex flex-wrap items-baseline gap-2">
                    {"earlyUserOffer" in plan && plan.earlyUserOffer ? (
                      <>
                        <span className="text-3xl sm:text-4xl font-semibold text-foreground">
                          {plan.earlyUserOffer.price}
                        </span>
                        <span className="text-muted-foreground">
                          for {plan.earlyUserOffer.period}
                        </span>
                        <span className="text-lg text-muted-foreground line-through ml-1 inline-block">
                          {plan.price}{plan.frequency}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl sm:text-4xl font-semibold text-foreground">
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground">{plan.frequency}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={plan.ctaHref === "__dashboard__" ? dashboardUrl : plan.ctaHref}
                    className={`inline-flex h-10 w-full cursor-pointer items-center justify-center rounded border px-5 py-2.5 text-sm font-medium transition ${isPremium
                      ? "border-[#4338ca]/60 bg-[#4338ca] text-white hover:bg-[#3730a3] hover:border-[#4338ca]"
                      : "border border-zinc-600/80 bg-[#131315] text-white hover:bg-zinc-800/80 hover:border-zinc-500"
                      }`}
                  >
                    {plan.ctaLabel}
                  </Link>
                  {(plan.name === "Premium" || plan.name === "Scale") && (
                    <p className="mt-2 text-xs text-zinc-500 text-center">
                      This offer is valid during our early user adoption phase. You won&apos;t be charged.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={`${plan.name}-${feature}`}
                      className="flex items-start gap-3"
                    >
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isPremium ? "bg-[#131315] text-white" : "text-zinc-400"}`}
                        aria-hidden
                      >
                        <HugeiconsIcon
                          icon={Tick01Icon}
                          size={14}
                          strokeWidth={2.5}
                          className="text-current"
                        />
                      </span>
                      <span className="text-sm leading-relaxed text-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-8 sm:mt-10 max-w-2xl text-center text-xs text-zinc-500 space-y-1">
        <p>Prices and plans may change.</p>
        <p>We&apos;re currently in beta and testing.</p>
      </div>
    </section>
  );
}
