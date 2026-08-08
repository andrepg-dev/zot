"use client";

import type { ToolCallEntry } from "@/components/email-generation/tool-calls";
import { consumeEmailSseStream, type StreamEmailEvent } from "@/lib/api/email-stream";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

export interface GenerationRunState {
  /** Latest progress line from the backend, shown under the composer. */
  step: string | null;
  assistantText: string;
  toolCalls: ToolCallEntry[];
  compiledHtml: string | null;
  subject: string | null;
  previewUrl: string | null;
  seq: number | null;
}

const EMPTY_RUN: GenerationRunState = {
  step: null,
  assistantText: "",
  toolCalls: [],
  compiledHtml: null,
  subject: null,
  previewUrl: null,
  seq: null,
};

/**
 * Drives one generation turn over SSE and exposes the pieces the editor renders
 * while it runs. Chat history and versions are refetched on completion, so the
 * persisted state stays the source of truth once the stream ends.
 */
export function useEmailGeneration(emailId: string) {
  const [isRunning, setIsRunning] = useState(false);
  const [run, setRun] = useState<GenerationRunState>(EMPTY_RUN);
  const abortRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  const applyEvent = useCallback((event: StreamEmailEvent) => {
    setRun((prev) => {
      switch (event.type) {
        case "step":
          return { ...prev, step: event.message };
        case "assistant-chunk":
          return { ...prev, assistantText: prev.assistantText + event.value };
        case "subject":
          return { ...prev, subject: event.value };
        case "preview_url":
          return { ...prev, previewUrl: event.value };
        case "tool_call": {
          const existing = prev.toolCalls.findIndex((call) => call.id === event.id);
          const entry: ToolCallEntry = {
            id: event.id,
            name: event.name,
            status: event.status,
            title: event.title,
            detail: event.detail,
            summary: event.summary,
            images: event.images,
          };
          const toolCalls =
            existing >= 0
              ? prev.toolCalls.map((call, i) => (i === existing ? entry : call))
              : [...prev.toolCalls, entry];
          return { ...prev, toolCalls };
        }
        case "done":
          return {
            ...prev,
            step: null,
            compiledHtml: event.compiledHtml ?? prev.compiledHtml,
            subject: event.subject ?? prev.subject,
            seq: event.seq ?? prev.seq,
          };
        default:
          return prev;
      }
    });
  }, []);

  const start = useCallback(
    async (path: string, body?: unknown) => {
      if (isRunning) return;

      const controller = new AbortController();
      abortRef.current = controller;
      setIsRunning(true);
      setRun({ ...EMPTY_RUN, step: "Preparing generation..." });

      try {
        let streamError: string | null = null;

        await consumeEmailSseStream(
          path,
          (event) => {
            if (event.type === "error") streamError = event.message;
            applyEvent(event);
          },
          controller.signal,
          body,
        );

        if (streamError) throw new Error(streamError);

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["generation-email", emailId] }),
          queryClient.invalidateQueries({ queryKey: ["generation-chat", emailId] }),
          queryClient.invalidateQueries({ queryKey: ["generation-versions", emailId] }),
        ]);
      } catch (err) {
        // A user-initiated stop is not a failure worth a toast.
        if (controller.signal.aborted && !(controller.signal.reason instanceof Error)) return;

        const message =
          controller.signal.reason instanceof Error
            ? controller.signal.reason.message
            : err instanceof Error
              ? err.message
              : "Generation failed";

        addToast({ title: "Generation failed", description: message, color: "danger" });
        setRun((prev) => ({ ...prev, step: null }));
      } finally {
        setIsRunning(false);
        abortRef.current = null;
      }
    },
    [applyEvent, emailId, isRunning, queryClient],
  );

  const generate = useCallback(
    (body?: { prompt?: string; skills?: string[] }) =>
      start(`/ai/generation/emails/${emailId}/generate`, body ?? {}),
    [emailId, start],
  );

  const edit = useCallback(
    (body: { instruction: string; skills?: string[] }) =>
      start(`/ai/generation/emails/${emailId}/edit`, body),
    [emailId, start],
  );

  const regenerate = useCallback(
    () => start(`/ai/generation/emails/${emailId}/regenerate`),
    [emailId, start],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { isRunning, run, generate, edit, regenerate, stop };
}
