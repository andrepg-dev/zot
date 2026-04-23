"use client";

import LandingPageTitle from "@/components/LandingPageTitle";
import Silk from "@/components/Silk";
import { ArrowRight02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAddUser } from "@zot-core/sdk/react";
import { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_ZOT_API_KEY ?? "";
const WAITLIST_ID = process.env.NEXT_PUBLIC_ZOT_WAITLIST_ID ?? "";

export default function ReadyToStartSection() {
  const [email, setEmail] = useState("");

  const { addUser, isPending, isUserRegistered, error, reset } = useAddUser({
    apiKey: API_KEY,
    waitlistId: WAITLIST_ID,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    addUser({ email });
  }

  const alreadyRegistered =
    error && "statusCode" in (error as { statusCode?: number }) &&
    (error as { statusCode?: number }).statusCode === 409;

  return (
    <section id="testimonial" className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 pb-16 sm:pb-20 lg:pb-24 pt-12 sm:pt-14 lg:pt-16">
      <div
        className="relative w-full overflow-hidden shadow-[0_0_20px_rgba(0,111,238,0.3),0_0_0px_rgba(0,0,0,0.4)]"
      >
        <div className="absolute inset-0 z-0 h-full min-h-[280px] sm:min-h-[320px] w-full">
          <Silk
            speed={2.5}
            scale={1}
            color="#006FEE"
            noiseIntensity={5}
            rotation={5.54}
          />
        </div>
        <div
          className="relative z-10 px-5 sm:px-8 lg:px-10 py-10 sm:py-12 lg:py-16 text-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(10, 24, 66, 0.35) 0%, rgba(0, 111, 238, 0.08) 50%, rgba(10, 24, 66, 0.35) 100%), rgba(0, 0, 0, 0.72)",
          }}
        >
          <LandingPageTitle
            subtitle=""
            title={{ before: "Early adopter", gradient: "discounts" }}
            gradient={{ colors: ["#8AB6FF", "#ffffff"], animationSpeed: 16 }}
            description="Early adopters get exclusive pricing on Zot. Drop your email and we&apos;ll send you an offer the moment we launch."
            classNames={{
              description: "max-w-[50ch] !text-xl text-balance"
            }}
          />

          {isUserRegistered ? (
            <div className="mt-6 sm:mt-8 lg:mt-10 mx-auto max-w-md">
              <div className="flex items-center justify-center gap-3 border border-white/20 bg-black/50 backdrop-blur-md px-5 py-3.5 text-sm text-white">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} strokeWidth={2} className="text-[#22C55E] shrink-0" />
                <span>You&apos;re on the list. We&apos;ll be in touch soon.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setEmail("");
                }}
                className="mt-3 text-xs text-white/70 hover:text-white underline underline-offset-4"
              >
                Register another email
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 sm:mt-8 lg:mt-10 flex flex-col items-center justify-center w-full gap-2"
            >
              <div className="relative flex items-center w-full max-w-md">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isPending}
                  required
                  className="w-full h-11 sm:h-12 border border-white/20 bg-black/50 backdrop-blur-md pl-5 pr-28 sm:pr-32 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#006FEE] focus:ring-1 focus:ring-[#006FEE]/50 disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="absolute right-1.5 h-8 sm:h-9 bg-white px-4 sm:px-5 text-sm font-medium text-black transition-all hover:bg-white/90 hover:px-6 sm:hover:px-7 inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:px-4 sm:disabled:hover:px-5"
                >
                  {isPending ? "Joining..." : "Join"}
                  {!isPending && (
                    <HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} />
                  )}
                </button>
              </div>
              {error && (
                <p role="alert" className="text-xs text-white/80 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 mt-1">
                  {alreadyRegistered
                    ? "This email is already on the list."
                    : "Something went wrong. Try again in a moment."}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
