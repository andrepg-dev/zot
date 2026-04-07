"use client";

import PageComponent from "@/components/layouts/page-component";
import { plans } from "@/constants/billing-constant";
import { CheckIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import posthog from "posthog-js";

export default function BillingPage() {
  return (
    <PageComponent className="max-w-6xl mx-auto text-foreground relative">
      <div className="flex flex-col gap-8">
        <div className="text-center space-y-3">
          <p className="text-xs tracking-[0.25em] uppercase text-blue-300/80">Billing</p>
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
              className={`relative flex flex-col bg-[#0D0D0E] border p-6 shadow-lg backdrop-blur ${
                plan.popular ? "border-[#4338CA] -translate-y-5" : "border-white/10"
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
                onClick={() =>
                  posthog.capture("checkout_initiated", {
                    plan: plan.name,
                    price: plan.price,
                    is_popular: plan.popular ?? false
                  })
                }
                className={`mt-6 inline-flex h-10.5 items-center justify-center rounded-sm border px-4 text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-[#4338CA] text-white border-blue-500 drop-shadow-lg drop-shadow-black "
                    : "border-blue-500/50 text-blue-100 hover:border-blue-400 hover:bg-blue-500/10"
                }`}
              >
                {plan.ctaLabel}
              </Link>

              <div className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <div key={`${plan.name}-${feature}`} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex rounded-full p-1 text-blue-100">
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
