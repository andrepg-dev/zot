"use client";

import PageComponent from "@/components/layouts/page-component";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <PageComponent className="max-w-2xl mx-auto text-foreground relative">
      <div className="flex flex-col items-center gap-8 py-16">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl animate-pulse" />
          <CheckCircleIcon className="relative size-20 text-blue-400 drop-shadow-lg" />
        </div>

        <div className="text-center space-y-3">
          <p className="text-xs tracking-[0.25em] uppercase text-blue-300/80">
            Payment confirmed
          </p>
          <h1 className="text-3xl font-semibold">Welcome to Premium</h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your subscription is now active. All Premium features are ready
            for you to use — unlimited waitlists, more email capacity, extra
            domains, and powerful AI models.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link
            href="/app/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-md border bg-blue-500 text-white border-blue-500 px-6 text-sm font-semibold transition-colors drop-shadow-lg drop-shadow-black hover:bg-blue-600"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/app/billing"
            className="inline-flex h-11 items-center justify-center rounded-md border border-blue-500/50 text-blue-100 px-6 text-sm font-semibold transition-colors hover:border-blue-400 hover:bg-blue-500/10"
          >
            View your plan
          </Link>
        </div>

        {sessionId && (
          <p className="text-xs text-muted-foreground/60 mt-4 font-mono">
            Session {sessionId.slice(0, 20)}…
          </p>
        )}
      </div>
    </PageComponent>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
