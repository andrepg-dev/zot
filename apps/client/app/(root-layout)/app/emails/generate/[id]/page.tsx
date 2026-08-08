"use client";

import {
  getGenerationChat,
  getGenerationEmail,
  getGenerationVersion,
  getGenerationVersions,
} from "@/actions/ai/generation.actions";
import ChatTimeline from "@/components/email-generation/chat-timeline";
import SkillsPicker from "@/components/email-generation/skills-picker";
import VersionsDropdown from "@/components/email-generation/versions-dropdown";
import Type from "@/components/type";
import { useEmailGeneration } from "@/hooks/use-email-generation";
import { ArrowLeftIcon, ArrowPathIcon, PaperAirplaneIcon, StopIcon } from "@heroicons/react/24/outline";
import { Button, Spinner, Textarea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editGenerationEmailSchema,
  type EditGenerationEmailValues,
  type GenerationVersion,
} from "@repo/packages/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function GeneratedEmailEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [skills, setSkills] = useState<string[]>([]);
  const [previewVersion, setPreviewVersion] = useState<GenerationVersion | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoStarted = useRef(false);

  const { isRunning, run, generate, edit, regenerate, stop } = useEmailGeneration(id);

  const { data: email, isPending } = useQuery({
    queryKey: ["generation-email", id],
    queryFn: () => getGenerationEmail(id),
  });

  const { data: chat } = useQuery({
    queryKey: ["generation-chat", id],
    queryFn: () => getGenerationChat(id),
  });

  const { data: versions } = useQuery({
    queryKey: ["generation-versions", id],
    queryFn: () => getGenerationVersions(id),
  });

  // Only fetched when the user picks an older version out of the dropdown; the
  // list rows carry no HTML, so the full variant has to be loaded to preview it.
  const { data: pinnedVariant, isFetching: isLoadingVersion } = useQuery({
    queryKey: ["generation-version", id, previewVersion?.seq],
    queryFn: () => getGenerationVersion(id, previewVersion!.seq),
    enabled: previewVersion !== null,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditGenerationEmailValues>({
    resolver: zodResolver(editGenerationEmailSchema),
    defaultValues: { instruction: "" },
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
  const html = pinnedVariant?.compiledHtml ?? run.compiledHtml ?? email.variant?.compiledHtml ?? null;
  const subject = pinnedVariant?.subject ?? run.subject ?? email.variant?.subject ?? null;
  const activeSeq = previewVersion?.seq ?? run.seq ?? email.variant?.seq;

  return (
    <div className="flex h-[calc(100vh-4rem)] divide-x divide-default-200">
      <section className="flex flex-col w-full max-w-md">
        <header className="flex items-center gap-2 px-4 py-3 border-b border-default-200">
          <Button
            as={Link}
            href="/app/emails/generate"
            size="sm"
            radius="sm"
            variant="light"
            isIconOnly
            aria-label="Back to generated emails"
          >
            <ArrowLeftIcon className="size-4" />
          </Button>

          <div className="flex flex-col min-w-0 flex-1">
            <Type variant="h6" className="truncate">
              {email.title}
            </Type>
            {subject ? (
              <Type variant="sm" className="text-muted-foreground truncate">
                {subject}
              </Type>
            ) : null}
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
          <ChatTimeline
            messages={chat ?? []}
            liveToolCalls={run.toolCalls}
            liveAssistantText={run.assistantText}
            step={run.step}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 border-t border-default-200 p-3"
        >
          <Controller
            name="instruction"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                radius="sm"
                minRows={2}
                maxRows={6}
                placeholder="Describe a change, e.g. make the header dark and add a hero image"
                isDisabled={isRunning}
                isInvalid={!!errors.instruction}
                errorMessage={errors.instruction?.message}
              />
            )}
          />

          <div className="flex items-center justify-between gap-2">
            <SkillsPicker selected={skills} onChange={setSkills} isDisabled={isRunning} />

            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                radius="sm"
                variant="light"
                isIconOnly
                aria-label="Regenerate last turn"
                isDisabled={isRunning || !email.variant}
                onPress={() => void regenerate()}
              >
                <ArrowPathIcon className="size-4" />
              </Button>

              {isRunning ? (
                <Button
                  size="sm"
                  radius="sm"
                  color="danger"
                  variant="flat"
                  startContent={<StopIcon className="size-4" />}
                  onPress={stop}
                >
                  Stop
                </Button>
              ) : (
                <Button
                  size="sm"
                  radius="sm"
                  color="primary"
                  type="submit"
                  startContent={<PaperAirplaneIcon className="size-4" />}
                >
                  Send
                </Button>
              )}
            </div>
          </div>
        </form>
      </section>

      <section className="flex-1 flex flex-col bg-default-50">
        <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-default-200">
          <Type variant="h6">Preview</Type>
          <VersionsDropdown
            versions={versions ?? []}
            activeSeq={activeSeq}
            onSelect={setPreviewVersion}
            isDisabled={isRunning}
          />
        </header>

        <div className="flex-1 overflow-auto p-6">
          {html ? (
            <iframe
              title="Email preview"
              srcDoc={html}
              className="w-full h-full bg-white border border-default-200"
              sandbox=""
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
