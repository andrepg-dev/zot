"use client";

import type { AiMessage } from "@/actions/ai/ai-email.actions";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@heroui/spinner";
import { useEffect, useRef } from "react";
import ChatMessage from "./chat-message";

interface ChatMessageListProps {
  messages: AiMessage[];
  isPending: boolean;
}

export default function ChatMessageList({ messages, isPending }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  if (messages.length === 0 && !isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
        <SparklesIcon className="size-5" />
        <span className="text-xs">Describe the email you want to create</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto pb-4">
      {messages.map((message) => (
        <ChatMessage key={message._id} message={message} />
      ))}

      {isPending && (
        <div className="flex items-center gap-2 p-2">
          <Spinner size="sm" />
          <span className="text-xs text-muted-foreground">Generating...</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
