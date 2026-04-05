"use client";

import { ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

interface ChatInputProps {
  isPending: boolean;
  onSend: (message: string) => void;
}

export default function ChatInput({ isPending, onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <footer className="bg-sidebar flex-shrink-0 sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.80)]">
      <div className="bg-default-50 mb-4 rounded-lg border">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-4 text-sm resize-none outline-none"
          placeholder="Describe your email..."
          rows={2}
          disabled={isPending}
        />

        <div className="flex px-3 pb-2 pt-1 items-center justify-between">
          <button className="p-1.5 rounded-full cursor-pointer hover:ring-2 ring-default/30">
            <PlusIcon className="size-4" />
          </button>

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isPending}
            className="disabled:opacity-60 bg-primary p-1.5 rounded-full cursor-pointer hover:ring-2 ring-primary/30"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
