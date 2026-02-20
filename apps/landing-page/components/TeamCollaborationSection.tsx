"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import CardSwap, { Card, CardSwapRef } from "./CardSwap";
import LandingPageTitle from "./LandingPageTitle";
import WebWindowCard from "./WebWindowCard";

export default function TeamCollaborationSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardSwapRef = useRef<CardSwapRef>(null);

  const buttons = [
    {
      id: 0,
      title: "Team projects",
      description: "Work together with your team on shared projects. Assign tasks and track progress all in one place.",
      icon: PlusSignIcon,
    },
    {
      id: 1,
      title: "Real-time updates",
      description: "Stay in sync with real-time updates. Every change is instantly visible to all team members.",
      icon: PlusSignIcon,
    },
    {
      id: 2,
      title: "In-app chat",
      description: "Discuss tasks, share updates, and stay connected without switching platforms or tools.",
      icon: PlusSignIcon,
    },
  ];

  const cards = [
    {
      url: "collab.zot.so",
      title: "Real-time updates",
      description: "See every change your team makes as it happens in a familiar web-style interface.",
    },
    {
      url: "team.zot.so",
      title: "Shared workspaces",
      description: "Organize projects, documents, and feedback in a single, collaborative web view.",
    },
    {
      url: "updates.zot.so",
      title: "Status at a glance",
      description: "Track what changed, who did it, and when, without leaving the browser experience.",
    },
  ];

  const handleButtonClick = (index: number) => {
    setActiveCardIndex(index);
    if (cardSwapRef.current) {
      cardSwapRef.current.goToCard(index);
    }
  };

  return (
    <section className="px-16 pb-32 flex flex-col gap-16 overflow-hidden">
      <LandingPageTitle
        subtitle="Integrated community"
        title={{ before: "Seamless", gradient: "team collaboration" }}
        gradient={{ colors: ["#5227FF", "#ffffff"], animationSpeed: 16 }}
        description="Keep everyone in sync with instant updates that ensure all team members have the latest information."
      />

      <div className="h-[550px] relative overflow-hidden pt-24 -mb-12">
        <div className="absolute left-28 top-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-5 w-[420px]">
            {buttons.map((button, index) => {
              const isActive = activeCardIndex === index;
              return (
                <button
                  key={button.id}
                  onClick={() => handleButtonClick(index)}
                  className={`w-full min-h-[100px] text-left rounded-3xl px-7 py-5 flex flex-col gap-3 transition-colors cursor-pointer border ${isActive
                    ? "bg-zinc-900 border-border shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                    : "bg-zinc-900/20 text-muted-foreground hover:text-white/90 hover:bg-zinc-900/40 border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${isActive ? "bg-zinc-800" : "bg-zinc-800/60"
                        }`}
                    >
                      <HugeiconsIcon
                        icon={button.icon}
                        size={16}
                        strokeWidth={1.5}
                        className={isActive ? "text-zinc-100" : "text-zinc-200"}
                      />
                    </span>
                    <span className={`text-sm font-medium ${isActive ? "text-white" : ""}`}>
                      {button.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{button.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <CardSwap
          cardDistance={60}
          verticalDistance={70}
          height={500}
          width={700}
          simultaneousCards={2}
          delay={3000}
        >
          {cards.map((card, index) => (
            <Card key={index}>
              <WebWindowCard url={card.url} title={card.title} description={card.description} />
            </Card>
          ))}
        </CardSwap>
      </div>
    </section>
  );
}
