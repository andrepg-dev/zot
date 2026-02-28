"use client";

import LandingPageTitle from "@/components/LandingPageTitle";
import Silk from "@/components/Silk";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

export default function ReadyToStartSection() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: tu lógica de envío (ej. registrar en waitlist)
    alert(email);
  }

  return (
    <section id="testimonial" className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 pb-16 sm:pb-20 lg:pb-24 pt-12 sm:pt-14 lg:pt-16">
      <div
        className="relative w-full overflow-hidden shadow-[0_0_20px_rgba(82,39,255,0.25),0_0_0px_rgba(0,0,0,0.4)]"
      >
        <div className="absolute inset-0 z-0 h-full min-h-[280px] sm:min-h-[320px] w-full">
          <Silk
            speed={2.5}
            scale={1}
            color="#5227ff"
            noiseIntensity={5}
            rotation={5.54}
          />
        </div>
        <div
          className="relative z-10 px-5 sm:px-8 lg:px-10 py-10 sm:py-12 lg:py-16 text-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(49, 46, 129, 0.1) 0%, rgba(67, 56, 202, 0.06) 50%, rgba(55, 48, 163, 0.1) 100%), rgba(0, 0, 0, 0.7)",
          }}
        >
          <LandingPageTitle
            subtitle=""
            title={{ before: "Early user", gradient: "discounts" }}
            gradient={{ colors: ["#c4b5fd", "#ffffff"], animationSpeed: 16 }}
            description="Early adopters get exclusive pricing on Zot. Leave your email and we&apos;ll send you an offer when we launch."
            classNames={{
              description: "max-w-[50ch] !text-xl text-balance"
            }}
          />

          <form
            onSubmit={handleSubmit}
            className="mt-6 sm:mt-8 lg:mt-10 flex items-center justify-center w-full"
          >
            <div className="relative flex items-center w-full max-w-md">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 sm:h-12  border border-white/20 bg-black/50 backdrop-blur-md pl-5 pr-28 sm:pr-32 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#5227FF] focus:ring-1 focus:ring-[#5227FF]/50"
              />
              <button
                type="submit"
                className="absolute right-1.5 h-8 sm:h-9 bg-white px-4 sm:px-5 text-sm font-medium text-black transition-all hover:bg-white/90 hover:px-6 sm:hover:px-7 inline-flex items-center gap-1.5 cursor-pointer"
              >
                Join
                <HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
