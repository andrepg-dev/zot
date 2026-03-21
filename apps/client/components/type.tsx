import { cn } from "@/lib/utils";
import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

type VariantKey = keyof typeof variants;

type TypeProps<C extends React.ElementType = "span"> = {
  variant?: VariantKey;
  children: React.ReactNode;
  className?: string;
  as?: C;
} & Omit<React.ComponentPropsWithoutRef<C>, "as" | "children" | "className">;

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
  code: "font-mono text-xs bg-default-100 px-1.5 py-0.5 rounded-sm border"
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
  code: "code"
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-1 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <CheckIcon className="size-3" /> : <ClipboardDocumentIcon className="size-3" />}
    </button>
  );
}

export default function Type<C extends React.ElementType = "span">({ variant = "base", children, className, as, ...props }: TypeProps<C>) {
  const Component = as || elementMap[variant];

  if (variant === "code") {
    const textContent = typeof children === "string" ? children : "";

    return (
      <span className="inline-flex items-center gap-0">
        <Component className={cn(variants[variant], className)} {...props}>
          {children}
        </Component>
        {textContent && <CopyButton text={textContent} />}
      </span>
    );
  }

  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
}
