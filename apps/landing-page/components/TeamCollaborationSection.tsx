"use client";

import { Mail01Icon, PlusSignIcon, WebhookIcon } from "@hugeicons/core-free-icons";
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
      title: "Webhook callbacks",
      description: "Automatically receive webhook notifications on user signup and offboarding events. Integrate with your existing stack in minutes.",
      icon: WebhookIcon,
    },
    {
      id: 1,
      title: "Email campaigns",
      description: "Build email templates with React Email and send them directly to your waitlist users. Stay close to the code, keep your audience engaged.",
      icon: Mail01Icon,
    },
    {
      id: 2,
      title: "Smart notifications",
      description: "Get notified via email on every 20 users registered. Stay on top of your growth without checking the dashboard.",
      icon: PlusSignIcon,
    },
  ];

  const cards = [
    {
      url: "api.zot.so/webhooks",
      title: "Webhook integration",
      description: "Connect your waitlist events to any service via webhooks. Automate workflows when users sign up or leave.",
    },
    {
      url: "app.zot.so/emails",
      title: "Email editor",
      description: "Edit your email templates with code powered by React Email. Preview, tweak, and ship beautiful emails without leaving your workflow.",
    },
    {
      url: "app.zot.so/notifications",
      title: "Growth alerts",
      description: "Receive milestone notifications as your waitlist grows. Never miss a key moment in your product validation.",
    },
  ];

  const handleButtonClick = (index: number) => {
    setActiveCardIndex(index);
  };

  const activeCard = cards[activeCardIndex];

  return (
    <section id="integration" className="px-4 sm:px-6 md:px-8 lg:px-16 pb-20 sm:pb-28 lg:pb-36 flex flex-col gap-10 sm:gap-12 lg:gap-16 overflow-hidden">
      <LandingPageTitle
        subtitle="Integrations"
        title={{ before: "Powerful", gradient: "automation tools" }}
        gradient={{ colors: ["#5227FF", "#ffffff"], animationSpeed: 16 }}
        classNames={{
          description: "max-w-[50ch]"
        }}
        description="Webhooks, email campaigns, and smart notifications. Automate your workflow and stay connected to your users."
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
          <h2 className="text-4xl sm:text-5xl text-white">5 min</h2>
          <h3 className="text-xl sm:text-2xl font-medium text-white">Setup time</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-[35ch] mx-auto">
            Create a waitlist, configure webhooks, and start collecting leads in under five minutes.
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
          <h2 className="text-4xl sm:text-5xl text-white">50+</h2>
          <h3 className="text-xl sm:text-2xl font-medium text-white">Waitlists per account</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-[35ch] mx-auto">
            Run multiple waitlists simultaneously for different products, features, or markets.
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
          <h2 className="text-4xl sm:text-5xl text-white">100%</h2>
          <h3 className="text-xl sm:text-2xl font-medium text-white">Clean leads</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-[35ch] mx-auto">
            Fake email detection ensures every sign up on your waitlist is a real, interested user.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
