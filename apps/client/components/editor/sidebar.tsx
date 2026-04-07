"use client";

import ChatInput from "@/components/ai-chat/chat-input";
import ChatMessageList from "@/components/ai-chat/chat-message-list";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import { useAiChat } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import PrimaryActionButton from "../global/primary-action-button";
import HeaderNavigation from "../navigation/header.navigation";

interface EditorSidebarProps {
  onCodeReceived?: (code: string) => void;
  conversationId?: string;
  isEdition: boolean | string;
}

export default function EditorSidebar({
  onCodeReceived,
  conversationId,
  isEdition
}: EditorSidebarProps) {
  const { editionType } = useLandingPageState();
  const { messages, isPending, sendMessage, isLoadingConversation } = useAiChat({
    conversationId,
    onCodeReceived
  });

  const isCode = messages.some((message) => message.operation_type == "code");

  return (
    <>
      <HeaderNavigation
        navigationItems={[
          { label: "Wait-List", pathname: "/app/waitlist/dashboard" },
          { label: "Emails", pathname: "/app/waitlist/emails" },
          {
            label: messages?.[0]?.message ?? "Create template",
            pathname: ""
          }
        ]}
        postNavigationItems={
          isCode && (
            <PrimaryActionButton
              startContent={<FolderPlusIcon className="size-4" strokeWidth={2} />}
            >
              Save template
            </PrimaryActionButton>
          )
        }
      />

      <SidebarNavigation
        resizable={isCode}
        maxWidth={900}
        storageKey="sidebar-width:email-template"
        className={cn(
          "overflow-y-auto z-50",
          editionType === "ai" ? (isCode ? "" : "min-w-full") : "min-w-0 w-0"
        )}
        children={
          <div
            className={cn(
              "p-4 pb-0 flex flex-col h-full flex-1 text-sm gap-2 mx-auto min-w-0",
              isCode ? "w-full max-w-[755px]" : "w-3xl"
            )}
          >
            <ChatMessageList
              messages={messages}
              isPending={isPending}
              isLoadingMessages={isLoadingConversation}
            />
            <ChatInput isPending={isPending} onSend={sendMessage} />
          </div>
        }
      />
    </>
  );
}
