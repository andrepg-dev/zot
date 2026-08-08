"use client";

import ToolCalls, { type ToolCallEntry } from "@/components/email-generation/tool-calls";
import Type from "@/components/type";
import { cn } from "@/lib/utils";
import type { GenerationChatMessage } from "@repo/packages/shared/schemas";

/**
 * Persisted chat history plus whatever the in-flight turn has produced so far.
 * TOOL_CALL rows hold a JSON payload rather than prose, so they render through
 * ToolCalls instead of as text.
 */
export default function ChatTimeline({
  messages,
  liveToolCalls,
  liveAssistantText,
  step,
}: {
  messages: GenerationChatMessage[];
  liveToolCalls: ToolCallEntry[];
  liveAssistantText: string;
  step: string | null;
}) {
  return (
    <div className="flex flex-col gap-5">
      {messages.map((message) => (
        <ChatRow key={message._id} message={message} />
      ))}

      {liveToolCalls.length > 0 ? <ToolCalls calls={liveToolCalls} /> : null}

      {liveAssistantText ? (
        <Type className="whitespace-pre-wrap">{liveAssistantText}</Type>
      ) : null}

      {step ? (
        <Type className="text-muted-foreground animate-pulse">{step}</Type>
      ) : null}
    </div>
  );
}

function ChatRow({ message }: { message: GenerationChatMessage }) {
  if (message.kind === "TOOL_CALL") {
    const call = parseToolCall(message);
    return call ? <ToolCalls calls={[call]} /> : null;
  }

  // Thinking rows are stored for context but are noise in the timeline.
  if (message.kind === "THINKING") return null;

  if (message.role === "USER") {
    return (
      <div className="flex flex-col gap-1.5 items-end">
        <div className="bg-default-100 px-3 py-2 max-w-[85%]">
          <Type className="whitespace-pre-wrap">{message.content}</Type>
        </div>
        {message.skills.length > 0 ? (
          <Type variant="sm" className="text-muted-foreground">
            {message.skills.length} skill{message.skills.length === 1 ? "" : "s"} applied
          </Type>
        ) : null}
      </div>
    );
  }

  return (
    <Type
      className={cn(
        "whitespace-pre-wrap",
        message.kind === "ERROR" && "text-danger",
      )}
    >
      {message.content}
    </Type>
  );
}

function parseToolCall(message: GenerationChatMessage): ToolCallEntry | null {
  try {
    const parsed = JSON.parse(message.content) as Partial<ToolCallEntry>;
    if (!parsed.name || !parsed.title) return null;
    return {
      id: parsed.id ?? message._id,
      name: parsed.name,
      status: "done",
      title: parsed.title,
      detail: parsed.detail,
      summary: parsed.summary,
      images: parsed.images,
    };
  } catch {
    return null;
  }
}
