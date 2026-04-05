"use client";

import type { AiMessage } from "@/actions/ai/ai-email.actions";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import ShinyText from "../ui/shiny-text";
import ChatMessage from "./chat-message";

interface ChatMessageListProps {
  messages: AiMessage[];
  isPending: boolean;
  conversationId: string;
}

export default function ChatMessageList({
  messages,
  isPending,
  conversationId
}: ChatMessageListProps) {
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
          <ShinyText text="Generating" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
