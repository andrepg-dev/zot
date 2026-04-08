"use client";

import ChatInput from "@/components/ai-chat/chat-input";
import ChatMessageList from "@/components/ai-chat/chat-message-list";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import { useAiChat } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { SlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
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

  const navigationItems = [
    {
      label: "Emails",
      pathname: "/app/waitlist/emails"
    },
    {
      label: messages?.[0]?.message ?? "Create template",
      pathname: ""
    }
  ];

  return (
    <>
      <HeaderNavigation
        navigationItems={[
          { label: "Emails", pathname: "/app/waitlist/emails" },
          {
            label: messages?.[0]?.message ?? "Create template",
            pathname: ""
          }
        ]}
        hidden={isCode}
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
              "p-4 pt-0 pb-0 flex flex-col h-full flex-1 text-sm gap-7 mx-auto min-w-0",
              isCode ? "w-full max-w-[755px]" : "w-3xl"
            )}
          >
            <div
              className={cn(
                isCode ? "flex items-center sticky top-0 left-0 bg-black pb-2" : "hidden"
              )}
            >
              <Link href={"/app/dashboard"}>
                <span className="font-bold text-2xl">zot</span>
              </Link>

              {navigationItems &&
                navigationItems?.map((value, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-sm font-semibold gap-2 mt-1 text-muted-foreground hover:text-foreground ml-2"
                  >
                    <span className="text-muted-foreground">
                      <SlashIcon className="size-4 text-default-100" />
                    </span>

                    <Link
                      href={value.pathname}
                      className={cn(
                        "hover:underline-2 hover:underline decoration-2 rounded-md !text-[13px] max-w-[16ch] truncate",
                        "transition-all"
                      )}
                    >
                      {value.label}
                    </Link>
                  </div>
                ))}
            </div>

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
