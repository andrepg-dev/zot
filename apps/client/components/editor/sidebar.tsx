"use client";

import { createEmailTemplate } from "@/actions/email-templates/email-templates.actions";
import ChatInput from "@/components/ai-chat/chat-input";
import ChatMessageList from "@/components/ai-chat/chat-message-list";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import Type from "@/components/type";
import InputComponent from "@/components/ui/input";
import { useAiChat } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Radio, RadioGroup } from "@heroui/radio";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmailTemplateSchema,
  type CreateEmailTemplateValues
} from "@repo/packages/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

  const [isSaveOpen, setIsSaveOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Omit<CreateEmailTemplateValues, "code">>({
    resolver: zodResolver(createEmailTemplateSchema.omit({ code: true })),
    defaultValues: {
      alias: "",
      subject: "",
      status: "published"
    }
  });

  const { mutate: createEmailTemplateMutate, isPending: isSaving } = useMutation({
    mutationFn: (data: CreateEmailTemplateValues) => createEmailTemplate(data),
    onSuccess: () => {
      addToast({ description: "Template saved", color: "success" });
      setIsSaveOpen(false);
      reset();
    },
    onError: (err: Error) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  const onSaveSubmit = (values: Omit<CreateEmailTemplateValues, "code">) => {
    const lastCode = messages.findLast((m) => m.code != null)?.code;

    if (!lastCode) {
      addToast({ description: "No code to save yet", color: "danger" });
      return;
    }
    createEmailTemplateMutate({ ...values, code: lastCode });
  };

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
        hidden={isCode}
        postNavigationItems={
          isCode && (
            <Popover
              radius="sm"
              placement="bottom-end"
              size="lg"
              isOpen={isSaveOpen}
              onOpenChange={setIsSaveOpen}
            >
              <PopoverTrigger>
                <PrimaryActionButton
                  startContent={<FolderPlusIcon className="size-4" strokeWidth={2} />}
                >
                  Save template
                </PrimaryActionButton>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-80">
                <form
                  onSubmit={handleSubmit(onSaveSubmit)}
                  className="flex flex-col gap-3 p-4 w-full"
                >
                  <div className="flex flex-col gap-1">
                    <Type className="font-medium">Save template</Type>
                    <Type variant="sm" className="text-muted-foreground font-normal">
                      Store this email so you can reuse it later.
                    </Type>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Type variant="sm">Template name</Type>
                    <Controller
                      name="alias"
                      control={control}
                      render={({ field }) => (
                        <InputComponent
                          size="sm"
                          placeholder="e.g. Welcome email"
                          maxLength={60}
                          isInvalid={!!errors.alias}
                          errorMessage={errors.alias?.message}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          autoFocus
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Type variant="sm">Email Subject</Type>
                    <Controller
                      name="subject"
                      control={control}
                      render={({ field }) => (
                        <InputComponent
                          size="sm"
                          placeholder="Welcome to my platform"
                          maxLength={120}
                          isInvalid={!!errors.subject}
                          errorMessage={errors.subject?.message}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Type variant="sm">Status</Type>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          orientation="horizontal"
                          size="sm"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <Radio value="draft">Draft</Radio>
                          <Radio value="published">Published</Radio>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <PrimaryActionButton type="submit" isLoading={isSaving} className="w-full">
                      Save template
                    </PrimaryActionButton>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
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
