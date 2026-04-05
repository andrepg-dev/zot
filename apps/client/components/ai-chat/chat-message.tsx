"use client";

import type { AiMessage } from "@/actions/ai/ai-email.actions";
import GlobalTooltip from "@/components/global/tooltip";
import Type from "@/components/type";
import { formatTime } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { CheckIcon, ClipboardDocumentIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface ChatMessageProps {
  message: AiMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const content = isUser ? message.message : message.response;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const actions = (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Type variant="sm" className="text-muted-foreground flex items-center gap-1">
        <ClockIcon className="size-3" />
        {formatTime(message.created_at)}
      </Type>
      <GlobalTooltip content={copied ? "Copied!" : "Copy message"}>
        <button
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {copied ? <CheckIcon className="size-3" /> : <ClipboardDocumentIcon className="size-3" />}
        </button>
      </GlobalTooltip>
    </div>
  );

  return (
    <div
      className={cn(
        "group flex flex-col",
        isUser ? "items-end max-w-[90%] ml-auto" : "items-start"
      )}
    >
      <div
        className={cn("p-2.5 rounded-lg text-sm", isUser ? "bg-default-100 border" : "flex gap-2")}
      >
        <div className="flex flex-col gap-1">
          <Type className="whitespace-pre-wrap">{content}</Type>
          {!isUser && actions}
        </div>
      </div>
      {isUser && <div className="mt-1 px-1">{actions}</div>}
    </div>
  );
}
