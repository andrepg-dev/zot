"use client";

import ChatInput from "@/components/ai-chat/chat-input";
import ChatMessageList from "@/components/ai-chat/chat-message-list";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import { useAiChat } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";

interface EditorSidebarProps {
  onCodeReceived?: (code: string) => void;
  conversationId?: string;
}

export default function EditorSidebar({ onCodeReceived, conversationId }: EditorSidebarProps) {
  const { editionType } = useLandingPageState();
  const { messages, isPending, sendMessage } = useAiChat({ conversationId, onCodeReceived });

  const isCode = messages.some((message) => message.operation_type == "code");

  return (
    <SidebarNavigation
      className={cn(
        "overflow-y-auto z-50 duration-400 transition-all",
        editionType === "ai" ? (isCode ? "min-w-[455px] w-[455px]" : "min-w-full") : "min-w-0 w-0"
      )}
      children={
        <div
          className={cn(
            "p-4 pb-0 flex flex-col h-full flex-1 text-sm gap-2 mx-auto",
            isCode ? "w-full" : "w-3xl"
          )}
        >
          <ChatMessageList messages={messages} isPending={isPending} />
          <ChatInput isPending={isPending} onSend={sendMessage} />
        </div>
      }
    />
  );
}
