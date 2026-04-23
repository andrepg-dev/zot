"use client";

import { animate } from "animejs";
import { useEffect, useRef } from "react";

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  locale?: string;
  startOnVisible?: boolean;
}

const THRESHOLD = 0.35;

export default function AnimatedCounter({
  value,
  duration = 1800,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  locale = "en-US",
  startOnVisible = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (current: number) => {
      const rounded =
        decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString(locale);
      el.textContent = `${prefix}${rounded}${suffix}`;
    };

    format(0);

    const run = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      const target = { n: 0 };
      animate(target, {
        n: value,
        duration,
        ease: "out(3)",
        onUpdate: () => format(target.n),
        onComplete: () => format(value),
      });
    };

    if (!startOnVisible) {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
          }
        }
      },
      { threshold: THRESHOLD }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, decimals, prefix, suffix, locale, startOnVisible]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={`${prefix}${decimals > 0 ? value.toFixed(decimals) : value.toLocaleString(locale)}${suffix}`}
    >
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : value.toLocaleString(locale)}
      {suffix}
    </span>
  );
}
