"use client";

import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import GlobalButton, { type GlobalButtonProps } from "@/components/global/button";

interface CopyButtonProps extends Omit<GlobalButtonProps, "onPress"> {
  text: string;
}

export default function CopyButton({ text, children, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const Icon = copied ? CheckIcon : ClipboardDocumentIcon;

  return (
    <GlobalButton variant="flat" onPress={handleCopy} {...props}>
      <Icon className={copied ? "size-4" : "size-4"} />
      {children}
    </GlobalButton>
  );
}
