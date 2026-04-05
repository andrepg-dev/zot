"use client";

import { type AiMessage, sendMessageToAi } from "@/actions/ai/ai-email.actions";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

interface UseAiChatOptions {
  onCodeReceived?: (code: string) => void;
}

export function useAiChat({ onCodeReceived }: UseAiChatOptions = {}) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const conversationIdRef = useRef<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (message: string) =>
      sendMessageToAi(message, conversationIdRef.current ?? undefined),
    onMutate: (message) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: crypto.randomUUID(),
          role: "user",
          message,
          created_at: new Date().toISOString()
        }
      ]);
    },
    onSuccess: (data) => {
      conversationIdRef.current = data.conversationId;

      setMessages((prev) => [
        ...prev,
        {
          _id: crypto.randomUUID(),
          role: "assistant",
          response: data.response,
          code: data.code,
          operation_type: data.operation_type,
          created_at: new Date().toISOString()
        }
      ]);

      if (data.code && onCodeReceived) {
        onCodeReceived(data.code);
      }
    },
    onError: () => {
      addToast({ description: "Failed to send message", color: "danger" });
    }
  });

  const sendMessage = useCallback(
    (message: string) => {
      const trimmed = message.trim();
      if (!trimmed || isPending) return;
      mutate(trimmed);
    },
    [mutate, isPending]
  );

  return { messages, isPending, sendMessage };
}
