"use client";

import LandingPageTitle from "@/components/LandingPageTitle";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "What is Zot and who is it for?",
    answer:
      "Zot is a developer-first waitlist platform for founders, indie hackers, and teams validating product ideas. Create waitlists from the terminal, drop them into any React app with a single hook, track real-time analytics, send emails, and block fake signups, all from one dashboard.",
  },
  {
    question: "How quickly can I set up a waitlist?",
    answer:
      "Under five minutes. Run npx @zot-core/cli waitlist create to create it, then useAddUser from @zot-core/sdk/react to embed the form. Or skip the code and share the link Zot gives you.",
  },
  {
    question: "How do I integrate Zot in my Next.js app?",
    answer:
      "Two steps. First, npx @zot-core/cli waitlist create --write-env .env.local --public creates the waitlist and stores its ID in your env. Then import useAddUser from @zot-core/sdk/react, pass the env vars, and render your form. Full guide: npx skills add launch-waitlist-zot/zot-skills.",
  },
  {
    question: "Does Zot work with AI coding agents?",
    answer:
      "Yes. npx skills add launch-waitlist-zot/zot-skills writes integration guides for Claude Code, Cursor, GitHub Copilot and AGENTS.md, so whichever agent is editing your repo ships the right code on the first try.",
  },
  {
    question: "How does the fake email protection work?",
    answer:
      "Zot automatically detects and blocks disposable and temporary email addresses when users try to sign up. This ensures every lead on your waitlist is a real person with a valid email, giving you clean data to validate your idea.",
  },
  {
    question: "Can I send emails to my waitlist users?",
    answer:
      "Yes. Zot lets you author email templates as components in your codebase. You keep full control over design and content, and can send updates, welcome messages, and announcements directly to your waitlist.",
  },
  {
    question: "What analytics does Zot provide?",
    answer:
      "You get real-time metrics including total sign ups, referrals, daily registrations, emails sent, fake users blocked, traffic sources, top referrers, and conversion rates. Everything you need to measure traction.",
  },
  {
    question: "How do webhooks work?",
    answer:
      "You can configure a webhook URL in your waitlist settings. Zot will automatically send HTTP callbacks when users sign up or are offboarded. You also get email notifications every 20 registered users.",
  },
  {
    question: "Can I export my waitlist data?",
    answer:
      "Absolutely. All plans include data export so you can download your sign ups and use them in your own tools, CRM, or email marketing platform whenever you need.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="px-4 sm:px-6 md:px-8 lg:px-16 pb-16 sm:pb-20 lg:pb-24 pt-12 sm:pt-14 lg:pt-16 bg-[#000000]">
      <LandingPageTitle
        subtitle="Support"
        title={{ before: "Frequently asked", gradient: "question" }}
        gradient={{ colors: ["#a1a1aa", "#ffffff"], animationSpeed: 16 }}
        description="Everything you need to know about launching and managing your waitlist with Zot."
      />

      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 flex max-w-2xl flex-col gap-3 px-0">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-white/10 bg-zinc-900/80 transition-colors hover:border-white/15"
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
