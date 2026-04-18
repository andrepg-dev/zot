"use client";

import { getProfile } from "@/actions/auth/profile";
import { cn } from "@/lib/utils";
import { ChevronUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import BillingDrawing from "../global/billing-drawing";
import Type from "../type";

interface ChatInputProps {
  isPending: boolean;
  onSend: (message: string) => void;
}

export default function ChatInput({ isPending, onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile
  });

  const currentPlan = profile?.suscriptionPlan ?? "FREE";

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    setInput("");
    onSend(trimmed);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <footer className="bg-sidebar flex-shrink-0 sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.80)] mb-4">
      <div
        className={cn(
          "bg-default-50 border z-50",
          currentPlan == "FREE" ? "rounded-t-lg" : "rounded-lg "
        )}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-4 text-sm resize-none outline-none"
          placeholder="Describe your email..."
          rows={2}
        />

        <div className="flex px-3 pb-2 pt-1 items-center justify-between">
          <button className="p-1.5 rounded-full cursor-pointer hover:bg-default-100 hover:ring-2 ring-default-200">
            <PlusIcon className="size-4" />
          </button>

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isPending}
            className="disabled:opacity-60 flex items-center gap-1.5 bg-primary text-white px-2 py-2 rounded-sm cursor-pointer hover:ring-2 ring-primary/30"
          >
            <ChevronUpIcon className="size-3.5" />
          </button>
        </div>
      </div>

      {currentPlan == "FREE" && (
        <div className="bg-default-100 rounded-b-lg px-4 py-1 text-xs flex gap-1">
          <BillingDrawing>
            <Type
              variant="sm"
              className="text-primary-500 hover:underline decoration-2 cursor-pointer"
            >
              Upgrade your plan
            </Type>
          </BillingDrawing>{" "}
          to choose more capable models.
        </div>
      )}
    </footer>
  );
}
