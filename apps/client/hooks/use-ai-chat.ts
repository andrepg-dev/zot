"use client";

import type { AiMessage } from "@/actions/ai/ai-email.actions";

import { addToast } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { consumeEmailSseStream } from "@/lib/api/email-stream";
import useReactCodeEditorStore from "@/store/emails/react-code-editor-email.store";
import {
  createGenerationEmail,
  getGenerationChat,
  getGenerationEmail
} from "@/actions/ai/generation.actions";

interface UseAiChatOptions {
  conversationId?: string;
  onCodeReceived?: (code: string) => void;
}

/**
 * Chat behind the email template editor.
 *
 * Backed by the generation pipeline (/ai/generation/*), which streams a turn
 * over SSE. The public shape is unchanged from the old AI_URL_SERVICE proxy so
 * the editor page and sidebar keep working: a conversation id is a generated
 * email id, and each assistant turn carries the TSX as `code`.
 */
export function useAiChat({
  conversationId: initialConversationId,
  onCodeReceived
}: UseAiChatOptions = {}) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isPending, setIsPending] = useState(false);
  const conversationIdRef = useRef<string | null>(initialConversationId ?? null);
  // Editing needs a saved draft to work from. Until one exists the turn has to
  // keep going through generate, since the model may spend the first turns
  // asking clarifying questions before it emits anything.
  const hasDraftRef = useRef(false);

  const router = useRouter();

  const { setLastCodeMessageHtmlCode } = useReactCodeEditorStore();

  const { data, isFetching: isLoadingConversation } = useQuery({
    queryKey: ["generation-email", initialConversationId],
    queryFn: async () => {
      const [email, chat] = await Promise.all([
        getGenerationEmail(initialConversationId!),
        getGenerationChat(initialConversationId!)
      ]);

      return { email, chat };
    },
    enabled: !!initialConversationId
  });

  // Restore an existing conversation: replay the stored turns and load the
  // newest variant into the editor and preview.
  useEffect(() => {
    if (!data) return;

    conversationIdRef.current = data.email._id;
    setMessages(
      data.chat
        .filter((row) => row.kind === "TEXT")
        .map((row) => ({
          _id: row._id,
          role: row.role === "USER" ? ("user" as const) : ("assistant" as const),
          message: row.role === "USER" ? row.content : undefined,
          response: row.role === "ASSISTANT" ? row.content : undefined,
          operation_type: "text" as const,
          created_at: row.createdAt ?? new Date().toISOString()
        }))
    );

    const variant = data.email.variant;

    if (variant) {
      hasDraftRef.current = true;
      onCodeReceived?.(variant.componentCode);
      setLastCodeMessageHtmlCode({ html: variant.compiledHtml });
    }
    // onCodeReceived is redefined on every render by the page, so keying on it
    // here would replay the conversation continuously.
  }, [data]);

  const appendMessage = useCallback((message: AiMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim();

      if (!trimmed || isPending) return;

      setIsPending(true);
      appendMessage({
        _id: crypto.randomUUID(),
        role: "user",
        message: trimmed,
        created_at: new Date().toISOString()
      });

      // Placeholder assistant row that fills in as the stream reports progress.
      const assistantId = crypto.randomUUID();

      appendMessage({
        _id: assistantId,
        role: "assistant",
        response: "Starting generation...",
        operation_type: "text",
        created_at: new Date().toISOString()
      });

      const patchAssistant = (patch: Partial<AiMessage>) => {
        setMessages((prev) =>
          prev.map((row) => (row._id === assistantId ? { ...row, ...patch } : row))
        );
      };

      try {
        let emailId = conversationIdRef.current;

        if (!emailId) {
          const created = await createGenerationEmail({ prompt: trimmed });

          emailId = created._id;
          conversationIdRef.current = emailId;
          router.replace(`?conversationId=${emailId}`);
        }

        const isEdit = hasDraftRef.current;

        let assistantText = "";
        let streamError: string | null = null;

        await consumeEmailSseStream(
          `/ai/generation/emails/${emailId}/${isEdit ? "edit" : "generate"}`,
          (event) => {
            switch (event.type) {
              case "step":
                patchAssistant({ response: event.message });
                break;
              case "tool_call":
                patchAssistant({ response: event.title });
                break;
              case "assistant-chunk":
                assistantText += event.value;
                patchAssistant({ response: assistantText });
                break;
              case "error":
                streamError = event.message;
                break;
              default:
                break;
            }
          },
          undefined,
          isEdit ? { instruction: trimmed } : { prompt: trimmed }
        );

        if (streamError) throw new Error(streamError);

        // The done event carries the compiled HTML but not the TSX, so read the
        // saved variant for the editor.
        const detail = await getGenerationEmail(emailId);
        const variant = detail.variant;

        patchAssistant({
          response:
            assistantText.trim() ||
            (variant
              ? "I drafted your email. Review the preview and tell me what to adjust."
              : "I need a bit more detail before drafting."),
          code: variant?.componentCode ?? null,
          operation_type: variant ? "code" : "text"
        });

        if (variant) {
          hasDraftRef.current = true;
          onCodeReceived?.(variant.componentCode);
          setLastCodeMessageHtmlCode({ html: variant.compiledHtml });
        }
      } catch (err) {
        const description = err instanceof Error ? err.message : "Failed to send message";

        patchAssistant({ response: description });
        addToast({ description, color: "danger" });
      } finally {
        setIsPending(false);
      }
    },
    [appendMessage, isPending, onCodeReceived, router, setLastCodeMessageHtmlCode]
  );

  return {
    messages,
    isPending,
    isLoadingConversation,
    sendMessage,
    title: data?.email.title,
    conversationId: conversationIdRef.current
  };
}
