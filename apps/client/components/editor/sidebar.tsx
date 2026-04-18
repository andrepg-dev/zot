"use client";

import { editAiConversation } from "@/actions/ai/ai-email.actions";
import ChatInput from "@/components/ai-chat/chat-input";
import ChatMessageList from "@/components/ai-chat/chat-message-list";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import { useAiChat } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { PencilSquareIcon, SlashIcon } from "@heroicons/react/24/outline";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRef, useState } from "react";
import HeaderNavigation from "../navigation/header.navigation";

interface EditorSidebarProps {
  onCodeReceived?: (code: string) => void;
  conversationId?: string;
}

export default function EditorSidebar({
  onCodeReceived,
  conversationId,
}: EditorSidebarProps) {
  const { editionType } = useLandingPageState();
  const {
    messages,
    isPending,
    sendMessage,
    isLoadingConversation,
    title,
    conversationId: currentConversationId
  } = useAiChat({
    conversationId,
    onCodeReceived
  });

  const queryClient = useQueryClient();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const editMutation = useMutation({
    mutationFn: (newTitle: string) =>
      editAiConversation(currentConversationId!, { title: newTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversation", currentConversationId] });
      addToast({ description: "Conversation renamed", color: "success" });
    },
    onError: (err) => addToast({ title: "Error", description: err.message, color: "danger" })
  });

  function handleTitleSubmit() {
    const newTitle = inputRef.current?.value.trim();

    if (newTitle && newTitle.length >= 4 && newTitle !== displayTitle) {
      editMutation.mutate(newTitle);
    }

    setIsEditingTitle(false);
  }

  const isCode = messages.some((message) => message.operation_type == "code");
  const displayTitle = title ?? messages?.[0]?.message ?? "Create template";

  const navigationItems = [
    {
      label: "Emails",
      pathname: "/app/emails/templates"
    },
    {
      label: "AI Conversations",
      pathname: "/app/emails/chats"
    },
    {
      label: displayTitle,
      pathname: ""
    }
  ];

  return (
    <>
      <HeaderNavigation
        navigationItems={[
          { label: "Emails", pathname: "/app/emails/templates" },
          {
            label: "AI Conversations",
            pathname: "/app/emails/chats"
          },
          {
            label: displayTitle,
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
          "overflow-y-auto z-50 duration-0",
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
                isCode ? "flex items-center sticky top-0 left-0 bg-black pb-2 z-50" : "hidden"
              )}
            >
              <Link href={"/app/dashboard"}>
                <span className="font-bold text-2xl">zot</span>
              </Link>

              {navigationItems &&
                navigationItems?.map((value, idx) => {
                  const isLastItem = idx === navigationItems.length - 1;
                  const isEditable = isLastItem && !!currentConversationId;

                  return (
                    <div
                      key={idx}
                      className="flex items-center text-sm font-semibold gap-2 mt-1 text-muted-foreground hover:text-foreground ml-2"
                    >
                      <span className="text-muted-foreground">
                        <SlashIcon className="size-4 text-default-100" />
                      </span>

                      {isEditable && isEditingTitle ? (
                        <input
                          ref={inputRef}
                          defaultValue={displayTitle}
                          autoFocus
                          onBlur={handleTitleSubmit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleTitleSubmit();
                            if (e.key === "Escape") setIsEditingTitle(false);
                          }}
                          className="bg-transparent outline-none border-b border-muted-foreground !text-[13px] w-40"
                        />
                      ) : isEditable ? (
                        <span
                          className="flex items-center gap-1.5 cursor-pointer group"
                          onClick={() => setIsEditingTitle(true)}
                        >
                          <span className={cn("!text-[13px] max-w-[16ch] truncate")}>
                            {value.label}
                          </span>
                          <PencilSquareIcon className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      ) : (
                        <Link
                          href={value.pathname}
                          className={cn(
                            "hover:underline-2 hover:underline decoration-2 rounded-md !text-[13px] max-w-[16ch] truncate",
                            "transition-all"
                          )}
                        >
                          {value.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
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
