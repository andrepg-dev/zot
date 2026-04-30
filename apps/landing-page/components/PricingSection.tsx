"use client";

import Grainient from "@/components/Grainient";
import LandingPageTitle from "@/components/LandingPageTitle";
import { getDashboardUrl } from "@/lib/dashboard-url";
import Link from "next/link";
import { useState } from "react";

const ANNUAL_DISCOUNT = 0.16;

type Interval = "monthly" | "yearly";

/** Planes alineados con apps/client/constants/billing-constant.ts */
const PLANS = [
  {
    name: "Free",
    price: { monthly: "$0", annual: "$0" },
    blurb: "A demo to try Zot before you launch.",
    ctaLabel: "Get started",
    ctaHref: "__dashboard__",
    popular: false,
    features: [
      "500 users signup limit",
      "1 waitlist",
      "1 landing page",
      "50 users emailed per month",
      "Custom email creation",
      "Export your data",
      "Analytics for signups and sent emails",
      "@zot-core/cli, @zot-core/sdk and @zot-core/agents included",
    ],
  },
  {
    name: "Starter",
    price: { monthly: "$19", annual: "$16" },
    blurb: "For indie hackers who already validated something.",
    ctaLabel: "Start with Starter",
    ctaHref: "__dashboard__",
    popular: false,
    features: [
      "5,000 users signup limit",
      "3 waitlists maximum",
      "1,000 users emailed per month",
      "Custom email creation",
      "1 domain for branded emails",
      "Analytics for signups and sent emails",
      "Export your data",
      "@zot-core/cli, @zot-core/sdk and @zot-core/agents included",
    ],
  },
  {
    name: "Pro",
    price: { monthly: "$49", annual: "$41" },
    blurb: "For products in production that need real headroom.",
    ctaLabel: "Upgrade plan",
    ctaHref: "__dashboard__",
    popular: true,
    features: [
      "50,000 users signup limit",
      "10 waitlists maximum",
      "10,000 users emailed per month",
      "Custom email creation",
      "10 domains for branded emails",
      "Extra security to block fake or disposable emails",
      "Analytics for sent emails and registered users",
      "Export your data",
      "Use more powerful AI models",
      "Priority support",
      "@zot-core/cli, @zot-core/sdk and @zot-core/agents included",
    ],
  },
];

export default function PricingSection() {
  const dashboardUrl = getDashboardUrl();
  const [interval, setInterval] = useState<Interval>("monthly");
  const discountPct = Math.round(ANNUAL_DISCOUNT * 100);
  return (
    <section
      className="px-4 sm:px-6 md:px-8 lg:px-16 pb-16 sm:pb-20 lg:pb-24 pt-12 sm:pt-14 lg:pt-16 bg-[#000000]"
      id="pricing"
    >
      <LandingPageTitle
        subtitle="Pricing"
        title={{ before: "Choose the plan that", gradient: "fits" }}
        gradient={{ colors: ["#60A5FA", "#ffffff"], animationSpeed: 16 }}
        description="Transparent pricing with zero surprises. Upgrade when you need more room to scale launches, emails, and domains."
      />

      <div className="mx-auto mt-8 flex justify-center">
        <div className="inline-flex items-center gap-1 border border-white/10 bg-black/40 p-1 backdrop-blur">
          <button
            type="button"
            onClick={() => setInterval("monthly")}
            className={`px-4 py-1.5 text-sm transition-colors ${
              interval === "monthly"
                ? "bg-[#006FEE] text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval("yearly")}
            className={`px-4 py-1.5 text-sm transition-colors flex items-center gap-2 ${
              interval === "yearly"
                ? "bg-[#006FEE] text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Yearly
            <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-200 bg-blue-500/20 border border-blue-500/40 px-1.5 py-0.5">
              Save {discountPct}%
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 grid max-w-6xl grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 items-start px-0">
        {PLANS.map((plan) => {
          const isPremium = plan.popular;
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
                    <div
                      className="absolute inset-0 bg-[#0D0D0E]/50 pointer-events-none"
                      aria-hidden
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(13,13,14,0.9) 0%, rgba(13,13,14,0.45) 40%, transparent 70%)",
                      }}
                      aria-hidden
                    />
                  </>
                ) : (
                  <div
                    className="absolute inset-0 bg-zinc-900/90"
                    aria-hidden
                  />
                )}
              </div>

              <div
                className={`relative z-10 flex flex-col flex-1 p-4 sm:p-5 lg:p-6 ${isPremium ? "bg-[#0D0D0E]/60" : "bg-black/40"}`}
              >
                {isPremium && (
                  <span className="absolute right-4 top-4 bg-[#006FEE] px-3 py-1 text-xs font-semibold text-white z-20">
                    Most popular
                  </span>
                )}

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-[#60A5FA]">
                    {plan.name}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {plan.blurb}
                  </p>
                  <div className="flex flex-wrap items-baseline gap-2">
                    {interval === "yearly" && plan.price.annual !== plan.price.monthly && (
                      <span className="text-xl sm:text-2xl font-medium text-muted-foreground line-through decoration-red-400/70 decoration-2">
                        {plan.price.monthly}
                      </span>
                    )}
                    <span className="text-3xl sm:text-4xl font-semibold text-foreground">
                      {interval === "yearly" ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={
                      plan.ctaHref === "__dashboard__"
                        ? dashboardUrl
                        : plan.ctaHref
                    }
                    className={`inline-flex h-10 w-full cursor-pointer items-center justify-center border px-5 py-2.5 text-sm font-medium transition ${
                      isPremium
                        ? "border-[#006FEE]/60 bg-[#006FEE] text-white hover:bg-[#0A84FF] hover:border-[#0A84FF]"
                        : "border border-zinc-600/80 bg-[#131315] text-white hover:bg-zinc-800/80 hover:border-zinc-500"
                    }`}
                  >
                    {plan.ctaLabel}
                  </Link>
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
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
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
    </section>
  );
}
