"use client";

import { getProfile } from "@/actions/auth/profile";
import { createCheckoutSession } from "@/actions/subscriptions/subscriptions.actions";
import PageComponent from "@/components/layouts/page-component";
import { plans } from "@/constants/billing-constant";
import { CheckIcon } from "@heroicons/react/24/solid";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import posthog from "posthog-js";

export default function BillingPage() {
  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile
  });

  const currentPlan = profile?.suscriptionPlan ?? "FREE";

  const { mutate: startCheckout, isPending: isCheckoutPending } = useMutation({
    mutationFn: () => createCheckoutSession({}),
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      addToast({ title: "Error", description: "Missing checkout URL", color: "danger" });
    },
    onError: (err: Error) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

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

        <div className="grid gap-3 lg:grid-cols-2 max-w-3xl mx-auto w-full mt-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col bg-default-50/70 border p-6 shadow-lg backdrop-blur ${
                plan.popular ? "border-[#4338CA] -translate-y-5" : "border-white/10"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-4 top-4 bg-[#4338CA]/20 border-[#4338CA] px-3 py-1 text-xs font-semibold text-blue-100">
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

              {currentPlan === plan.name.toUpperCase() && currentPlan !== "FREE" ? (
                <span className="mt-6 inline-flex h-10.5 items-center justify-center border px-4 text-sm font-semibold border-blue-500/50 text-blue-100 opacity-70 cursor-default">
                  Current plan
                </span>
              ) : plan.popular ? (
                <button
                  type="button"
                  disabled={isCheckoutPending}
                  onClick={() => {
                    posthog.capture("checkout_initiated", {
                      plan: plan.name,
                      price: plan.price,
                      is_popular: plan.popular ?? false
                    });
                    startCheckout();
                  }}
                  className="mt-6 inline-flex h-10.5 items-center justify-center border px-4 text-sm font-semibold transition-colors hover:bg-[#4338CA]/50 bg-[#4338CA]/70 text-white border-blue-500 drop-shadow-lg drop-shadow-black disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isCheckoutPending ? "Redirecting..." : plan.ctaLabel}
                </button>
              ) : (
                <span className="mt-6 inline-flex h-10.5 items-center justify-center border px-4 text-sm font-semibold border-blue-500/50 text-blue-100 opacity-50 cursor-not-allowed">
                  {plan.ctaLabel}
                </span>
              )}

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
