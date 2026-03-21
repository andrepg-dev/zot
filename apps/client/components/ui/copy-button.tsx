"use client";

import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
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

  return (
    <GlobalButton variant="flat" onPress={handleCopy} {...props} disableRipple>
      <span className="relative size-4">
        <AnimatePresence initial={false}>
          {copied ? (
            <motion.span
              key="check"
              className="absolute inset-0"
              initial={{ y: -8, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 8, opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <CheckIcon className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="clipboard"
              className="absolute inset-0"
              initial={{ y: -8, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 8, opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <ClipboardDocumentIcon className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {children}
    </GlobalButton>
  );
}
