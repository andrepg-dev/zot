export type StreamEmailEvent =
  | { type: "meta"; model?: string; attempt?: number; maxAttempts?: number; warning?: string }
  | { type: "subject"; value: string }
  | { type: "conversation_title"; value: string }
  | { type: "thinking-chunk"; value: string }
  | { type: "assistant-chunk"; value: string }
  | { type: "code-chunk"; value: string }
  | { type: "step"; message: string }
  | {
      type: "token_usage";
      input_tokens?: number;
      output_tokens?: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
    }
  | {
      type: "brand_context";
      url?: string;
      brandName?: string | null;
      colors?: string[];
      imageCount?: number;
    }
  | { type: "image_search"; query?: string; imageCount?: number }
  | {
      type: "tool_call";
      id: string;
      name: string;
      status: "running" | "done";
      title: string;
      detail?: string;
      summary?: string;
      images?: string[];
    }
  | { type: "preview_url"; value: string }
  | {
      type: "done";
      variantId?: string;
      subject?: string;
      conversationTitle?: string;
      compiledHtml?: string;
      seq?: number;
      chatOnly?: boolean;
    }
  | { type: "error"; message: string };

/**
 * A streamed generation that goes silent (backend hang, stalled proxy, dropped
 * upstream) would otherwise leave `reader.read()` pending forever, so the
 * caller's loading flag never resets and the UI looks frozen. Abort when no
 * bytes arrive for this long and surface it as a normal error.
 */
const STREAM_IDLE_TIMEOUT_MS = 120_000;

/**
 * Consume one generation SSE stream from the API.
 *
 * Called from the browser rather than a server action: the stream has to reach
 * the UI event by event, which a server action's single return value cannot do.
 * Cookies ride along via `credentials: "include"` — the API whitelists the app
 * origin with credentials, and the auth cookie is same-site with it.
 */
export async function consumeEmailSseStream(
  path: string,
  onEvent: (ev: StreamEmailEvent) => void,
  signal?: AbortSignal,
  body?: unknown,
): Promise<void> {
  // Internal controller so the idle watchdog can abort; chained to the caller's
  // signal so an external abort still tears the request down.
  const controller = new AbortController();
  const onExternalAbort = () => controller.abort(signal?.reason);
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener("abort", onExternalAbort, { once: true });
  }

  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  const armIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      controller.abort(new Error("Generation stalled with no response, please retry."));
    }, STREAM_IDLE_TIMEOUT_MS);
  };
  const clearIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = undefined;
  };

  try {
    armIdleTimer();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "text/event-stream",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body ?? {}),
    });

    if (!res.ok) {
      throw new Error(await readErrorMessage(res));
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      // Reset the silence watchdog every time bytes (or a close) arrive.
      armIdleTimer();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split(/\r?\n\r?\n/);
      buffer = parts.pop() ?? "";

      for (const chunk of parts) {
        for (const line of chunk.split(/\r?\n/).filter(Boolean)) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trimStart();
          if (!payload) continue;
          try {
            onEvent(JSON.parse(payload) as StreamEmailEvent);
          } catch {
            // Ignore incomplete SSE chunks.
          }
        }
      }
    }
  } finally {
    clearIdleTimer();
    signal?.removeEventListener("abort", onExternalAbort);
  }
}

/** Pull the most useful message out of a failed stream response. */
async function readErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get("Content-Type") ?? "";
  const raw = await res.text().catch(() => "");

  if (contentType.includes("application/json")) {
    try {
      const parsed = JSON.parse(raw) as { message?: unknown };
      if (typeof parsed.message === "string" && parsed.message.trim()) {
        return parsed.message.trim();
      }
    } catch {
      // Fall through to text cleanup.
    }
  }

  const cleaned = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned) return cleaned;

  return res.status === 502
    ? "Upstream gateway error (502). Check backend logs and retry."
    : `Stream failed (${res.status})`;
}
