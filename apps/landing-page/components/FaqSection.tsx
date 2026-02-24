"use client";

import LandingPageTitle from "@/components/LandingPageTitle";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "How do I get started with analytics?",
    answer:
      "Sign up for a free account, connect your project, and add our snippet or SDK. You'll see your first events within minutes.",
  },
  {
    question: "What platforms and frameworks are supported?",
    answer:
      "We support web (React, Next.js, Vue, plain JS), mobile (React Native, iOS, Android), and server-side tracking. No matter what project you're working on, we've got you covered.",
  },
  {
    question: "Can I try Zot before committing?",
    answer:
      "Yes. Start with a free trial that includes core analytics and task management. No credit card required.",
  },
  {
    question: "How is my data stored and protected?",
    answer:
      "Data is encrypted in transit and at rest. We comply with common privacy frameworks and do not sell your data.",
  },
  {
    question: "How does pricing work for teams?",
    answer:
      "Plans scale by team size and usage. You can upgrade or change plan at any time from your account settings.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-16 pb-16 sm:pb-20 lg:pb-24 pt-12 sm:pt-14 lg:pt-16 bg-[#000000]">
      <LandingPageTitle
        subtitle="Support"
        title={{ before: "Frequently asked", gradient: "question" }}
        gradient={{ colors: ["#a1a1aa", "#ffffff"], animationSpeed: 16 }}
        description="No matter what project you're working on, we've got you covered with the best tools for analytics and task management."
      />

      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 flex max-w-2xl flex-col gap-3 px-0">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded border border-white/10 bg-zinc-900/80 transition-colors hover:border-white/15"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="text-white font-medium text-sm sm:text-base">{item.question}</span>
                <span
                  className="flex shrink-0 transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={22}
                    strokeWidth={2}
                    className="text-white"
                  />
                </span>
              </button>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className="grid transition-[grid-template-rows] duration-200 ease-out"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-white/10 px-4 sm:px-5 py-3 sm:py-4 text-muted-foreground text-sm">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
