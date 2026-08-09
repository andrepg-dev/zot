"use client";

import {
  ArrowLeftIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  StopIcon
} from "@heroicons/react/24/outline";
import { Spinner, Textarea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editGenerationEmailSchema,
  type EditGenerationEmailValues,
  type GenerationVersion
} from "@repo/packages/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useEmailGeneration } from "@/hooks/use-email-generation";
import Type from "@/components/type";
import VersionsDropdown from "@/components/email-generation/versions-dropdown";
import SkillsPicker from "@/components/email-generation/skills-picker";
import GlobalButton from "@/components/global/button";
import ChatTimeline from "@/components/email-generation/chat-timeline";
import {
  getGenerationChat,
  getGenerationEmail,
  getGenerationVersion,
  getGenerationVersions
} from "@/actions/ai/generation.actions";

export default function GeneratedEmailEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [skills, setSkills] = useState<string[]>([]);
  const [previewVersion, setPreviewVersion] = useState<GenerationVersion | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoStarted = useRef(false);

  const { isRunning, run, generate, edit, regenerate, stop } = useEmailGeneration(id);

  const { data: email, isPending } = useQuery({
    queryKey: ["generation-email", id],
    queryFn: () => getGenerationEmail(id)
  });

  const { data: chat } = useQuery({
    queryKey: ["generation-chat", id],
    queryFn: () => getGenerationChat(id)
  });

  const { data: versions } = useQuery({
    queryKey: ["generation-versions", id],
    queryFn: () => getGenerationVersions(id)
  });

  // Only fetched when the user picks an older version out of the dropdown; the
  // list rows carry no HTML, so the full variant has to be loaded to preview it.
  const { data: pinnedVariant, isFetching: isLoadingVersion } = useQuery({
    queryKey: ["generation-version", id, previewVersion?.seq],
    queryFn: () => getGenerationVersion(id, previewVersion!.seq),
    enabled: previewVersion !== null
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EditGenerationEmailValues>({
    resolver: zodResolver(editGenerationEmailSchema),
    defaultValues: { instruction: "" }
  });

  // A freshly created project has a brief but no draft yet, so kick off the
  // first generation automatically instead of making the user ask twice.
  useEffect(() => {
    if (!email || autoStarted.current) return;
    if (email.variant === null && email.status === "draft") {
      autoStarted.current = true;
      void generate({});
    }
  }, [email, generate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, run.toolCalls, run.assistantText, run.step]);

  const onSubmit = (values: EditGenerationEmailValues) => {
    // Editing always applies to the latest variant, so drop any pinned older
    // version rather than leaving the preview showing something stale.
    setPreviewVersion(null);
    void edit({ instruction: values.instruction, skills });
    reset({ instruction: "" });
    setSkills([]);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Spinner variant="dots" />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Type className="text-muted-foreground">Email not found</Type>
      </div>
    );
  }

  // A pinned older version wins, then the live stream while a turn runs, then
  // the saved latest variant.
  const html =
    pinnedVariant?.compiledHtml ?? run.compiledHtml ?? email.variant?.compiledHtml ?? null;
  const subject = pinnedVariant?.subject ?? run.subject ?? email.variant?.subject ?? null;
  const activeSeq = previewVersion?.seq ?? run.seq ?? email.variant?.seq;

  return (
    <div className="flex h-[calc(100vh-4rem)] divide-x divide-default-200">
      <section className="flex flex-col w-full max-w-md">
        <header className="flex items-center gap-2 px-4 py-3 border-b border-default-200">
          <GlobalButton
            isIconOnly
            aria-label="Back to generated emails"
            as={Link}
            href="/app/emails/generate"
            variant="light"
          >
            <ArrowLeftIcon className="size-4" />
          </GlobalButton>

          <div className="flex flex-col min-w-0 flex-1">
            <Type className="truncate" variant="h6">
              {email.title}
            </Type>
            {subject ? (
              <Type className="text-muted-foreground truncate" variant="sm">
                {subject}
              </Type>
            ) : null}
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
          <ChatTimeline
            liveAssistantText={run.assistantText}
            liveToolCalls={run.toolCalls}
            messages={chat ?? []}
            step={run.step}
          />
        </div>

        <form
          className="flex flex-col gap-2 border-t border-default-200 p-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            control={control}
            name="instruction"
            render={({ field }) => (
              <Textarea
                {...field}
                errorMessage={errors.instruction?.message}
                isDisabled={isRunning}
                isInvalid={!!errors.instruction}
                maxRows={6}
                minRows={2}
                placeholder="Describe a change, e.g. make the header dark and add a hero image"
                radius="sm"
              />
            )}
          />

          <div className="flex items-center justify-between gap-2">
            <SkillsPicker isDisabled={isRunning} selected={skills} onChange={setSkills} />

            <div className="flex items-center gap-1.5">
              <GlobalButton
                isIconOnly
                aria-label="Regenerate last turn"
                isDisabled={isRunning || !email.variant}
                variant="light"
                onPress={() => void regenerate()}
              >
                <ArrowPathIcon className="size-4" />
              </GlobalButton>

              {isRunning ? (
                <GlobalButton
                  color="danger"
                  startContent={<StopIcon className="size-4" />}
                  variant="flat"
                  onPress={stop}
                >
                  Stop
                </GlobalButton>
              ) : (
                <GlobalButton
                  color="primary"
                  startContent={<PaperAirplaneIcon className="size-4" />}
                  type="submit"
                >
                  Send
                </GlobalButton>
              )}
            </div>
          </div>
        </form>
      </section>

      <section className="flex-1 flex flex-col bg-default-50">
        <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-default-200">
          <Type variant="h6">Preview</Type>
          <VersionsDropdown
            activeSeq={activeSeq}
            isDisabled={isRunning}
            versions={versions ?? []}
            onSelect={setPreviewVersion}
          />
        </header>

        <div className="flex-1 overflow-auto p-6">
          {html ? (
            <iframe
              className="w-full h-full bg-white border border-default-200"
              sandbox=""
              srcDoc={html}
              title="Email preview"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              {isRunning || isLoadingVersion ? (
                <>
                  <Spinner variant="dots" />
                  <Type className="text-muted-foreground">{run.step ?? "Generating..."}</Type>
                </>
              ) : (
                <Type className="text-muted-foreground">No draft yet</Type>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
