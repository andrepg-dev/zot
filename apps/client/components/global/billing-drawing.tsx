"use client";

import GlobalDrawer from "@/components/global/drawer";
import { plans } from "@/constants/billing-constant";
import { CheckIcon } from "@heroicons/react/24/solid";
import { DrawerBody, DrawerHeader, useDisclosure } from "@heroui/react";
import Link from "next/link";
import posthog from "posthog-js";

export default function BillingDrawing({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div onClick={onOpen}>{children}</div>

      <GlobalDrawer isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" expandedSize="5xl">
        <DrawerHeader className="flex flex-col gap-2 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-blue-300/80">Billing</p>
          <h1 className="text-2xl font-semibold">Choose the plan that fits</h1>
          <p className="text-sm text-muted-foreground font-normal max-w-xl mx-auto">
            Transparent pricing with zero surprises. Upgrade when you need more room to scale
            launches, emails, and domains.
          </p>
        </DrawerHeader>
        <DrawerBody className="overflow-y-auto">
          <div className="grid gap-3 lg:grid-cols-3 mt-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col bg-[#0D0D0E] border p-5 shadow-lg backdrop-blur ${
                  plan.popular ? "border-[#4338CA] -translate-y-4" : "border-white/10"
                }`}
              >
                {plan.popular && (
                  <span className="absolute right-3 top-3 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-100">
                    Most popular
                  </span>
                )}

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wide text-blue-300/80">
                    {plan.name}
                  </p>
                  <p className="text-base font-semibold">{plan.blurb}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-semibold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.frequency}</span>
                  </div>
                </div>

                <Link
                  href={plan.ctaHref}
                  onClick={() => {
                    posthog.capture("checkout_initiated", {
                      plan: plan.name,
                      price: plan.price,
                      is_popular: plan.popular ?? false
                    });
                    onOpenChange();
                  }}
                  className={`mt-5 inline-flex h-10 items-center justify-center border px-3 text-sm font-semibold transition-colors ${
                    plan.popular
                      ? "bg-[#4338CA] text-white border-blue-500 drop-shadow-lg drop-shadow-black "
                      : "border-blue-500/50 text-blue-100 hover:border-blue-400 hover:bg-blue-500/10"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>

                <div className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <div key={`${plan.name}-${feature}`} className="flex items-start gap-2.5">
                      <span className="mt-0.5 inline-flex rounded-full p-0.5 text-blue-100">
                        <CheckIcon className="size-3.5" />
                      </span>
                      <span className="text-[13px] leading-relaxed text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DrawerBody>
      </GlobalDrawer>
    </>
  );
}
