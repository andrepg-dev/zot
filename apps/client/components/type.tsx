import { cn } from "@/lib/utils";
import React from "react";

type VariantKey = keyof typeof variants;

interface TypeProps {
  variant?: VariantKey;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const variants = {
  h1: "text-xl font-normal",
  h2: "text-lg font-medium",
  h3: "text-lg font-normal",
  h4: "text-base font-medium",
  h5: "text-base font-normal",
  h6: "text-sm font-medium",
  base: "text-sm",
  sm: "text-xs",
  link: "text-primary-400 hover:underline decoration-2 cursor-pointer",
} as const;

const elementMap: Record<VariantKey, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  base: "p",
  sm: "p",
  link: "span",
};

export default function Type({
  variant = "base",
  children,
  className,
  as,
  ...props
}: TypeProps) {
  const Component = as || elementMap[variant];

  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
}
