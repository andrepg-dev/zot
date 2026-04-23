"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "One `npx @zot-core/cli waitlist create` and we were live. A week later we had 2,000 signups and clear data showing our idea had real demand.",
    name: "David Martinez",
    role: "Indie Founder",
    avatarFallback: "DM",
  },
  {
    quote:
      "The fake email blocking alone saved us from a list full of junk. Every lead on our waitlist is a real person. That changes everything when you're validating.",
    name: "Sarah Chen",
    role: "Product Lead",
    avatarFallback: "SC",
  },
  {
    quote:
      "The @zot-core/sdk hook dropped our waitlist form into the app in ten minutes. Webhooks and React Email templates automated the rest of the onboarding flow. We focused on shipping the product.",
    name: "Marcus Johnson",
    role: "CTO, Early-stage Startup",
    avatarFallback: "MJ",
  },
  {
    quote:
      "I needed to know if my SaaS idea was worth pursuing before writing a single line of code. Zot's analytics gave me that answer in days, not months.",
    name: "Elena Rodriguez",
    role: "Solo Founder",
    avatarFallback: "ER",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonial = TESTIMONIALS[currentIndex];

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? TESTIMONIALS.length - 1 : i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i === TESTIMONIALS.length - 1 ? 0 : i + 1));
  }, []);

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-16 pb-16 sm:pb-20 lg:pb-24 pt-12 sm:pt-14 lg:pt-16 bg-[#000000]">
      <div className="mx-auto max-w-4xl relative">
        {/* Flechas */}
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:translate-x-0 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 border border-white/10 flex items-center justify-center text-white hover:bg-zinc-700 hover:border-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Testimonio anterior"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-0 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 border border-white/10 flex items-center justify-center text-white hover:bg-zinc-700 hover:border-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Siguiente testimonio"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={20} strokeWidth={2} />
        </button>

        {/* Cita */}
        <blockquote className="text-center px-10 sm:px-14 lg:px-20">
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-white leading-relaxed">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </blockquote>

        {/* Avatar */}
        <div className="flex flex-col items-center mt-8 sm:mt-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#fce7f3] flex items-center justify-center border-2 border-white/10">
            <span className="text-lg font-semibold text-zinc-600">
              {testimonial.avatarFallback}
            </span>
          </div>
          <p className="mt-3 text-base sm:text-lg font-medium text-white">
            {testimonial.name}
          </p>
          <p className="text-sm text-zinc-400">{testimonial.role}</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Testimonios">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Testimonio ${i + 1}`}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                i === currentIndex ? "bg-white" : "bg-zinc-600 border border-zinc-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
