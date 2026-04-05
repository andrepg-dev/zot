"use client";

import ChatInput from "@/components/ai-chat/chat-input";
import ChatMessageList from "@/components/ai-chat/chat-message-list";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import { useAiChat } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";

interface EditorSidebarProps {
  onCodeReceived?: (code: string) => void;
}

export default function EditorSidebar({ onCodeReceived }: EditorSidebarProps) {
  const { editionType } = useLandingPageState();
  const { messages, isPending, sendMessage } = useAiChat({ onCodeReceived });

  return (
    <SidebarNavigation
      className={cn(
        "overflow-y-auto z-50 duration-400 transition-all",
        editionType === "ai" ? "min-w-[435px] w-[435px]" : "min-w-0 w-0"
      )}
      children={
        <div className="p-4 pb-0 flex flex-col h-full flex-1 text-sm gap-2 min-w-[435px]">
          <ChatMessageList messages={messages} isPending={isPending} />
          <ChatInput isPending={isPending} onSend={sendMessage} />
        </div>
      }
    />
  );
}
