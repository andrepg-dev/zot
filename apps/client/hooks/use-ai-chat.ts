"use client";

import { type AiMessage, getAiConversation, sendMessageToAi } from "@/actions/ai/ai-email.actions";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseAiChatOptions {
  conversationId?: string;
  onCodeReceived?: (code: string) => void;
}

export function useAiChat({
  conversationId: initialConversationId,
  onCodeReceived
}: UseAiChatOptions = {}) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const conversationIdRef = useRef<string | null>(initialConversationId ?? null);

  const router = useRouter();

  const { data, isFetching: isLoadingConversation } = useQuery({
    queryKey: ["ai-conversation", initialConversationId],
    queryFn: async () => {
      return await getAiConversation(initialConversationId!);
    },
    enabled: !!initialConversationId
  });

  useEffect(() => {
    const messages = data?.messages;
    if (messages) {
      setMessages(data.messages);
      conversationIdRef.current = data._id;

      if (messages.some((message) => message.operation_type == "code")) {
        const lastCodeMessage = messages.findLast((value) => value.code != null);

        if (lastCodeMessage?.code && onCodeReceived) {
          onCodeReceived(lastCodeMessage.code);
        }
      }
    }
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (message: string) => sendMessageToAi(message, conversationIdRef.current),
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

      // set windows query
      router.replace(`?conversationId=${data.conversationId}`);

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

  return { messages, isPending, isLoadingConversation, sendMessage };
}
