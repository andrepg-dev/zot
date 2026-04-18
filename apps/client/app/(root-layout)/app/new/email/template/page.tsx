"use client";

import { createEmailTemplate } from "@/actions/email-templates/email-templates.actions";
import MonacoEditorTemplate from "@/components/editor/monaco/monaco-editor/monaco-edito-header-template";
import MonacoEditor from "@/components/editor/monaco/monaco-editor/monaco-editor";
import HeaderTabulation from "@/components/editor/monaco/tabulation/header-tab";
import EditorSidebar from "@/components/editor/sidebar";
import PrimaryActionButton from "@/components/global/primary-action-button";
import GlobalTooltip from "@/components/global/tooltip";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import Chip from "@/components/ui/chip";
import InputComponent from "@/components/ui/input";
import { useHotkey } from "@/hooks/use-hotkey";
import { analyzeTemplateCode } from "@/lib/extract-template-variables";
import { cn } from "@/lib/utils";
import useReactCodeEditorStore from "@/store/emails/react-code-editor-email.store";
import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  Bars3Icon,
  CodeBracketIcon,
  DocumentIcon,
  EnvelopeIcon,
  EyeIcon,
  FolderPlusIcon,
  SlashIcon,
  VariableIcon
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Radio, RadioGroup } from "@heroui/radio";
import { Kbd } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmailTemplateSchema,
  type CreateEmailTemplateValues
} from "@repo/packages/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type VisualizationType = "code" | "preview";

export default function CreateEmailPage() {
  return (
    <Suspense fallback={null}>
      <CreateEmailPageContent />
    </Suspense>
  );
}

function CreateEmailPageContent() {
  const [visualizationType, setVisualizationType] = useState<VisualizationType>("preview");
  const [editorCode, setEditorCode] = useState("");
  const [iframeHeight, setIframeHeight] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow?.document?.body) return;
    const doc = iframe.contentWindow.document;
    const update = () => {
      const height = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
      setIframeHeight(height);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(doc.body);
  };

  const searchParams = useSearchParams();
  const router = useRouter();

  const conversationId = searchParams.get("conversationId") ?? "";
  const isEdition = searchParams.get("isEdition") ?? false;

  const handleCodeReceived = (code: string) => {
    setEditorCode(code);
  };

  const { lastCodeMessageHtmlCode } = useReactCodeEditorStore();

  const templateAnalysis = useMemo(() => analyzeTemplateCode(editorCode), [editorCode]);
  const templateVariables = templateAnalysis.declared;
  const missingVariables = templateAnalysis.missing;

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
      router.push("/app/emails/templates");
    },
    onError: (err: Error) => {
      addToast({ title: "Error", description: err.message, color: "danger" });
    }
  });

  useHotkey({
    key: "Enter",
    modifiers: ["meta"],
    onPress: () => {
      if (isSaveOpen) {
        handleSubmit(onSaveSubmit)();
      } else {
        setIsSaveOpen(true);
      }
    }
  });

  const onSaveSubmit = (values: Omit<CreateEmailTemplateValues, "code">) => {
    if (!editorCode) {
      addToast({ description: "No code to save yet", color: "danger" });
      return;
    }
    createEmailTemplateMutate({ ...values, code: editorCode });
  };

  return (
    <PageComponent className="flex flex-1 h-full p-0">
      {/* Header Navigation */}

      {/* Sidebar */}
      <EditorSidebar
        onCodeReceived={handleCodeReceived}
        conversationId={conversationId}
      />

      {/* Main Content */}
      <div className="flex flex-col w-full">
        <MonacoEditorTemplate>
          <div className="flex items-center font-medium font-sans">
            <Type variant="sm" className="flex items-center gap-2 text-muted-foreground">
              <DocumentIcon className="size-4" />
              Templates
            </Type>
            <SlashIcon className="size-4 text-muted-foreground" />

            <Controller
              name="alias"
              control={control}
              render={({ field }) => (
                <input
                  className="text-xs font-semibold tracking-wide bg-transparent outline-0 px-1 w-[115px]"
                  placeholder="Untitled template"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              )}
            />

            <Chip status="neutral" className="ml-1.5 mt-0.5 bg-default-300 border rounded-sm">
              Draft
            </Chip>
          </div>

          {/* Toggle Code/Preview */}
          <div className="border rounded-md w-max flex bg-default-100 overflow-hidden text-xs">
            <GlobalTooltip content="Vista de código">
              <button
                onClick={() => setVisualizationType("code")}
                className={cn(
                  "p-1 px-2 rounded !cursor-pointer text-xs",
                  visualizationType === "code" && "bg-default-50"
                )}
              >
                <CodeBracketIcon className="size-4" />
              </button>
            </GlobalTooltip>
            <GlobalTooltip content="Vista previa del email">
              <button
                onClick={() => setVisualizationType("preview")}
                className={cn(
                  "p-1 px-2 rounded !cursor-pointer text-xs",
                  visualizationType === "preview" && "bg-default-50"
                )}
              >
                <EyeIcon className="size-4" />
              </button>
            </GlobalTooltip>
          </div>

          <div className="flex items-center gap-2">
            <Dropdown className="border p-0" disableAnimation>
              <DropdownTrigger>
                <Button size="sm" variant="faded" isIconOnly disableAnimation>
                  <Bars3Icon className="size-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Menu de acciones"
                variant="flat"
                onAction={(key) => {
                  if (key === "download_zip") {
                    console.log("Download Zip");
                  }
                }}
              >
                <DropdownItem
                  key="download_source_code"
                  startContent={<ArrowDownTrayIcon className="size-4" />}
                >
                  Download file
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown className="border p-0" disableAnimation>
              <DropdownTrigger>
                <Button
                  size="sm"
                  variant="faded"
                  startContent={<VariableIcon className="size-4" />}
                  disableAnimation
                >
                  Variables
                  {templateVariables.length > 0 && (
                    <Chip status="neutral" className="ml-1 bg-default-300 border rounded-sm">
                      {templateVariables.length}
                    </Chip>
                  )}
                  {missingVariables.length > 0 && (
                    <Chip status="warning" className="ml-1 border rounded-sm">
                      {missingVariables.length} missing
                    </Chip>
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Detected template variables" variant="flat">
                {[
                  ...(templateVariables.length === 0 && missingVariables.length === 0
                    ? [
                      <DropdownItem key="empty" textValue="No variables" isDisabled>
                        <Type variant="sm" className="text-muted-foreground font-normal">
                          No variables detected yet.
                        </Type>
                      </DropdownItem>
                    ]
                    : []),
                  ...templateVariables.map((variable) => (
                    <DropdownItem key={`declared-${variable.name}`} textValue={variable.name}>
                      <div className="flex items-center justify-between gap-4">
                        <Type variant="sm" className="font-mono">
                          {variable.name}
                        </Type>
                        {variable.defaultValue ? (
                          <Type
                            variant="sm"
                            className="font-mono text-muted-foreground truncate max-w-[180px]"
                          >
                            {variable.defaultValue}
                          </Type>
                        ) : (
                          <Type variant="sm" className="text-muted-foreground">
                            —
                          </Type>
                        )}
                      </div>
                    </DropdownItem>
                  )),
                  ...missingVariables.map((name) => (
                    <DropdownItem
                      key={`missing-${name}`}
                      textValue={name}
                      description="Used in JSX but not declared in props. Add it to the destructured props or the template will crash."
                      className="data-[hover=true]:bg-warning-50"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <Type variant="sm" className="font-mono text-warning">
                          {name}
                        </Type>
                        <Chip status="warning" className="rounded-sm">
                          missing
                        </Chip>
                      </div>
                    </DropdownItem>
                  ))
                ]}
              </DropdownMenu>
            </Dropdown>

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
                  endContent={
                    <Kbd keys={["command"]} className="text-xs">
                      <ArrowUturnLeftIcon className="size-3" />
                    </Kbd>
                  }
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
                    <PrimaryActionButton
                      type="submit"
                      isLoading={isSaving}
                      className="w-full max-h-7 min-h-7 h-7"
                    >
                      Publish template
                    </PrimaryActionButton>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          </div>
        </MonacoEditorTemplate>

        {/* Content based on visualization type */}
        <div className="flex flex-1 flex-col min-h-0">
          {/* Code Panel */}
          {visualizationType === "code" && (
            <div className="flex flex-col flex-1 min-w-0">
              <HeaderTabulation tabs={[{ title: "EmailComponent.tsx", isActive: true }]} />
              <div className="flex-1 min-h-0">
                <MonacoEditor
                  height="100%"
                  value={editorCode}
                  onChange={(value) => setEditorCode(value ?? "")}
                />
              </div>
            </div>
          )}

          {/* Preview Panel */}
          {visualizationType === "preview" &&
            (!lastCodeMessageHtmlCode ? (
              <div className="flex-1 w-full relative bg-default-50">
                <div className="flex flex-col text-muted-foreground w-full h-full justify-center items-center gap-2 bg-default-50">
                  <EnvelopeIcon className="size-5" />
                  <span className="text-xs">Email preview will appear here</span>

                  <footer className="absolute bottom-4 mx-auto flex gap-4 text-muted-foreground/40 text-xs">
                    Start editing to see the preview
                  </footer>
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full h-full bg-white overflow-y-auto">
                <div className="flex flex-col mx-auto w-4/5 font-sans my-4 mb-24">
                  <div className="flex flex-col my-4 text-black/80">
                    <div>
                      <div className="flex border-b items-center h-[40px] !border-muted-foreground/30">
                        <Type className="w-[60px]">From</Type>
                        <input
                          className="w-full h-full outline-0 disabled:opacity-70 cursor-not-allowed"
                          placeholder="Company <x@example.com>"
                          value={"info@zot.so"}
                          disabled
                        />
                        <Type style={{ textWrap: "nowrap" }} className="text-black/50 font-medium">
                          Require domain configuration
                        </Type>
                      </div>
                      <div className="flex border-b items-center h-[40px] !border-muted-foreground/30">
                        <Controller
                          name="subject"
                          control={control}
                          render={({ field }) => (
                            <input
                              className="w-full h-full outline-0"
                              placeholder="Subject"
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              ref={field.ref}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <iframe
                    ref={iframeRef}
                    srcDoc={lastCodeMessageHtmlCode.html}
                    onLoad={handleIframeLoad}
                    style={{ height: iframeHeight ? `${iframeHeight}px` : undefined }}
                    className="w-full block border-0"
                    scrolling="no"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </PageComponent>
  );
}
