"use client";

import Type from "@/components/type";
import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Spinner } from "@heroui/react";

export interface ToolCallEntry {
  id: string;
  name: string;
  status: "running" | "done";
  title: string;
  detail?: string;
  summary?: string;
  images?: string[];
}

/**
 * Live tool activity for a turn. The model narrates what it is doing (brand
 * inspection, image search, font choice) and each call lands here so the wait
 * is legible instead of a blank spinner.
 */
export default function ToolCalls({ calls }: { calls: ToolCallEntry[] }) {
  if (calls.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 border-l-2 border-default-200 pl-3">
      {calls.map((call) => (
        <div key={call.id} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {call.status === "running" ? (
              <Spinner size="sm" variant="dots" />
            ) : (
              <CheckCircleIcon className="size-4 text-success shrink-0" />
            )}
            <Type
              className={cn(
                "text-muted-foreground",
                call.status === "running" && "text-foreground",
              )}
            >
              {call.title}
            </Type>
          </div>

          {call.detail ? (
            <Type variant="sm" className="text-muted-foreground pl-6 truncate">
              {call.detail}
            </Type>
          ) : null}

          {call.summary ? (
            <Type variant="sm" className="text-muted-foreground pl-6">
              {call.summary}
            </Type>
          ) : null}

          {call.images?.length ? (
            <div className="flex flex-wrap gap-1.5 pl-6 pt-1">
              {call.images.slice(0, 6).map((src) => (
                // Model-supplied hosts vary per search, so use a plain img here
                // rather than next/image with a remote-pattern allowlist.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="size-12 object-cover border border-default-200"
                />
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
