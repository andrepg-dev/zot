import { getDashboardUrl } from "@/lib/dashboard-url";
import LandingPageTitle from "@/components/LandingPageTitle";
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
    ctaHref: "__dashboard__",
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
    blurb: "For products in production that need headroom and support.",
    ctaLabel: "Start free trial",
    ctaHref: "__dashboard__",
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
    ctaHref: "#contact",
    popular: false,
    features: [
      "500,000 users per month signup limit",
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
    <section className="px-16 pb-24 pt-16 bg-[#000000]" id="pricing">
      <LandingPageTitle
        subtitle="Pricing"
        title={{ before: "Choose the plan that", gradient: "fits" }}
        gradient={{ colors: ["#a78bfa", "#c4b5fd"], animationSpeed: 16 }}
        description="Transparent pricing with zero surprises. Upgrade when you need more room to scale launches, emails, and domains."
      />

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-3 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-6 shadow-lg backdrop-blur border-white/10 bg-zinc-900/60
              }`}
          >
            {plan.popular && (
              <span className="absolute right-4 top-4 rounded-full bg-[#5227FF]/25 px-3 py-1 text-xs font-semibold text-[#c4b5fd]">
                Most popular
              </span>
            )}

            <div className="space-y-2">
              <p className={`text-xs uppercase tracking-wide ${plan.popular ? "text-[#a78bfa]" : "text-white/60"}`}>
                {plan.name}
              </p>
              <p className="text-lg font-semibold text-foreground">{plan.blurb}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.frequency}</span>
              </div>
            </div>

            <Link
              href={plan.ctaHref === "__dashboard__" ? dashboardUrl : plan.ctaHref}
              className={`mt-6 inline-flex border h-11 w-full cursor-pointer items-center justify-center hover:bg-zinc-800/80 rounded-full px-6 py-2.5 text-sm font-medium transition ${plan.popular
                ? "bg-zinc-900 text-white border-white/30 hover:border-white/50 backdrop-blur "
                : "border border-white/30 bg-zinc-900/80 text-white backdrop-blur hover:border-white/50"
                }`}
            >
              {plan.ctaLabel}
            </Link>

            <div className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <div
                  key={`${plan.name}-${feature}`}
                  className="flex items-start gap-3"
                >
                  <span className={`mt-0.5 inline-flex shrink-0 rounded-full p-1 ${plan.popular ? "text-[#a78bfa]" : "text-white/80"}`}>
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={16}
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
        ))}
      </div>
    </section>
  );
}
