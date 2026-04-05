"use client";

import type { AiMessage } from "@/actions/ai/ai-email.actions";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface ChatMessageProps {
  message: AiMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const content = isUser ? message.message : message.response;

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "p-2.5 rounded-lg max-w-4/5 text-sm",
          isUser ? "bg-default-100 border" : "flex gap-2"
        )}
      >
        {!isUser && (
          <SparklesIcon className="size-4 min-w-4 mt-0.5 text-primary" />
        )}
        <span className="whitespace-pre-wrap">{content}</span>
      </div>
    </div>
  );
}
