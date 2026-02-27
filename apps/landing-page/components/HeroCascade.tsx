"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

interface HeroCascadeProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeroCascade({ children, className }: HeroCascadeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      const badge = container.querySelector<HTMLElement>("[data-hero-badge]");
      const heading = container.querySelector<HTMLElement>("[data-hero-heading]");
      const subtitle = container.querySelector<HTMLElement>(
        "[data-hero-subtitle]"
      );
      const ctas = container.querySelector<HTMLElement>("[data-hero-ctas]");
      const bottom = container.querySelector<HTMLElement>("[data-hero-bottom]");

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });

      if (badge) {
        gsap.set(badge, {
          opacity: 0,
          y: 0,
        });
        tl.to(badge, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "linear",
        });
      }

      if (heading) {
        gsap.set(heading, { opacity: 1 });
        const split = new SplitText(heading, {
          type: "words",
        });

        gsap.set(split.words, {
          opacity: 0,
          y: 30,
          rotateX: -15,
          filter: "blur(4px)",
          transformOrigin: "50% 100%",
        });

        tl.to(
          split.words,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.04,
            ease: "power2.out",
          },
          badge ? "-=0.5" : "0"
        );
      }

      if (subtitle) {
        gsap.set(subtitle, { opacity: 0, y: 16, filter: "blur(3px)" });
        tl.to(
          subtitle,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
          },
          "-=0.45"
        );
      }

      if (ctas) {
        gsap.set(ctas, { opacity: 0, y: 16, scale: 0.96 });
        tl.to(
          ctas,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.35"
        );
      }

      if (bottom) {
        gsap.set(bottom, { opacity: 0, y: 12 });
        tl.to(
          bottom,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.35"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
