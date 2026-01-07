"use client";

import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const plans = [
    {
      name: "Free",
      price: "$0",
      frequency: "/ month",
      blurb: "Perfect to validate an idea and run simple launches.",
      ctaLabel: "Current plan",
      ctaHref: "/app/launch/waitlist",
      popular: false,
      features: [
        "15,000 users signup limit",
        "3 waitlists maximum",
        "3 landing pages maximum",
        "2,000 users emailed per month",
        "10 email templates",
        "Custom email creation",
        "1 domain for branded emails and landing pages",
        "Analytics for signups and sent emails",
        "Trend search powered by Google Search"
      ]
    },
    {
      name: "Premium",
      price: "$25",
      frequency: "/ month",
      blurb: "For products in production that need headroom and support.",
      ctaLabel: "Upgrade now",
      ctaHref: "/app/billing",
      popular: true,
      features: [
        "75,000 users signup limit",
        "15 waitlists maximum",
        "15 landing pages maximum",
        "30,000 users emailed per month",
        "30 email templates",
        "Custom email creation",
        "10 domains for emails and landing pages",
        "Extra security to block fake or disposable emails",
        "Analytics for sent emails and registered users",
        "Trend search with Google Search",
        "Use more powerful AI models"
      ]
    },
    {
      name: "Scale",
      price: "$90",
      frequency: "/ month",
      blurb: "Built for fast-growing teams with heavy launch pipelines.",
      ctaLabel: "Contact sales",
      ctaHref: "/app/billing",
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
        "Google Search included",
        "Use more powerful AI models"
      ]
    }
  ];

  return (
    <PageComponent className="max-w-6xl mx-auto text-foreground relative">
      {/* <SidebarNavigation hidden navItems={defaultNavItems} /> */}
      <HeaderNavigation hidden />

      <div className="fixed top-20 right-10">
        <Button
          isIconOnly
          radius="full"
          className="bg-default-100"
          onPress={() => {
            router.back();
          }}
        >
          <XMarkIcon className="size-5" />
        </Button>
      </div>

      <div
        className="fixed inset-0 -z-10 w-full"
        style={{
          background: `
       radial-gradient(ellipse 140% 50% at 15% 60%, rgba(59, 130, 246, 0.05), transparent 48%),
       radial-gradient(ellipse 90% 80% at 85% 25%, rgba(245, 101, 101, 0.04), transparent 58%),
       radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.06), transparent 52%),
       radial-gradient(ellipse 100% 45% at 70% 5%, rgba(251, 191, 36, 0.03), transparent 42%),
       radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.05), transparent 55%),
       #000000
     `
        }}
      />

      <div className="flex flex-col gap-8">
        <div className="text-center space-y-3">
          <p className="text-xs tracking-[0.25em] uppercase text-blue-300/80">Pricing</p>
          <h1 className="text-3xl font-semibold">Choose the plan that fits</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing with zero surprises. Upgrade when you need more room to scale
            launches, emails, and domains.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3 mt-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-card/80 p-6 shadow-lg backdrop-blur ${
                plan.popular
                  ? "border-blue-500/60 ring-1 ring-blue-500/40 -translate-y-5"
                  : "border-white/10"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-4 top-4 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100">
                  Most popular
                </span>
              )}

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-blue-300/80">{plan.name}</p>
                <p className="text-lg font-semibold">{plan.blurb}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.frequency}</span>
                </div>
              </div>

              <Link
                href={plan.ctaHref}
                className={`mt-6 inline-flex h-11 items-center justify-center rounded-md border px-4 text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-blue-500 text-white border-blue-500 drop-shadow-lg drop-shadow-black "
                    : "border-blue-500/50 text-blue-100 hover:border-blue-400 hover:bg-blue-500/10"
                }`}
              >
                {plan.ctaLabel}
              </Link>

              <div className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex rounded-full bg- p-1 text-blue-100">
                      <CheckIcon className="size-4" />
                    </span>
                    <span className="text-sm leading-relaxed text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageComponent>
  );
}
