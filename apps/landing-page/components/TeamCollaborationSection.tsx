"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import AnimatedContent from "./AnimatedContent";
import LandingPageTitle from "./LandingPageTitle";
import WebWindowCard from "./WebWindowCard";

export default function TeamCollaborationSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

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
  };

  const activeCard = cards[activeCardIndex];

  return (
    <section id="integration" className="px-4 sm:px-6 md:px-8 lg:px-16 pb-20 sm:pb-28 lg:pb-36 flex flex-col gap-10 sm:gap-12 lg:gap-16 overflow-hidden">
      <LandingPageTitle
        subtitle="Integrated community"
        title={{ before: "Seamless", gradient: "team collaboration" }}
        gradient={{ colors: ["#5227FF", "#ffffff"], animationSpeed: 16 }}
        description="Keep everyone in sync with instant updates that ensure all team members have the latest information."
      />

      <div className="min-h-[500px] lg:min-h-[550px] lg:h-[550px] relative pt-12 sm:pt-16 lg:pt-24 -mb-8 lg:-mb-12 flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-0">
        <div className="lg:absolute left-0 lg:left-8 xl:left-28 top-1/2 lg:-translate-y-1/2 z-10 w-full">
          <div className="flex flex-col gap-3 sm:gap-5 w-full lg:w-[380px] xl:max-w-[420px]">
            {buttons.map((button, index) => {
              const isActive = activeCardIndex === index;
              return (
                <button
                  key={button.id}
                  onClick={() => handleButtonClick(index)}
                  type="button"
                  className={`w-full min-h-[80px] sm:min-h-[100px] text-left rounded-2xl sm:rounded-3xl px-5 sm:px-7 py-4 sm:py-5 flex flex-col gap-2 sm:gap-3 transition-colors cursor-pointer border ${isActive
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

        <div className="flex-1 flex items-center justify-center lg:justify-end lg:pr-8 xl:pr-16 lg:pl-4 xl:pl-8 min-h-[320px] sm:min-h-[400px]">
          <div className="w-full max-w-[700px] h-[320px] sm:h-[400px] lg:h-[500px] rounded-xl border overflow-hidden bg-black border-border">
            <WebWindowCard
              url={activeCard.url}
              title={activeCard.title}
              description={activeCard.description}
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mt-10 sm:mt-12 lg:mt-16">
        <AnimatedContent
          distance={60}
          direction="vertical"
          reverse={false}
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          delay={0.1}
          className="flex flex-col items-center text-center gap-4"
        >
          <h2 className="text-4xl sm:text-5xl text-white">98%</h2>
          <h3 className="text-xl sm:text-2xl font-medium text-white">Team adoption</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-[35ch] mx-auto">
            98% team adoption highlights widespread tool use and effective communication.
          </p>
        </AnimatedContent>

        <AnimatedContent
          distance={60}
          direction="vertical"
          reverse={false}
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          delay={0.2}
          className="flex flex-col items-center text-center gap-4"
        >
          <h2 className="text-4xl sm:text-5xl text-white">30+</h2>
          <h3 className="text-xl sm:text-2xl font-medium text-white">Projects managed</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-[35ch] mx-auto">
            Our platform manages 30+ projects concurrently, maintaining flexibility and productivity.
          </p>
        </AnimatedContent>

        <AnimatedContent
          distance={60}
          direction="vertical"
          reverse={false}
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          delay={0.3}
          className="flex flex-col items-center text-center gap-4"
        >
          <h2 className="text-4xl sm:text-5xl text-white">100+</h2>
          <h3 className="text-xl sm:text-2xl font-medium text-white">Seamless integration</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-[35ch] mx-auto">
            Seamlessly integrates with key tools, ensuring smooth workflow and collaboration.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
