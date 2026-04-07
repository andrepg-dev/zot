"use client";

import MonacoEditorTemplate from "@/components/editor/monaco/monaco-editor/monaco-edito-header-template";
import MonacoEditor from "@/components/editor/monaco/monaco-editor/monaco-editor";
import HeaderTabulation from "@/components/editor/monaco/tabulation/header-tab";
import EditorSidebar from "@/components/editor/sidebar";
import GlobalTooltip from "@/components/global/tooltip";
import PageComponent from "@/components/layouts/page-component";
import Type from "@/components/type";
import { cn } from "@/lib/utils";
import useReactCodeEditorStore from "@/store/emails/react-code-editor-email.store";
import {
  ArrowDownTrayIcon,
  Bars3Icon,
  CodeBracketIcon,
  DocumentIcon,
  EnvelopeIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

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

  const searchParams = useSearchParams();

  const conversationId = searchParams.get("conversationId") ?? "";
  const isEdition = searchParams.get("isEdition") ?? false;

  const handleCodeReceived = (code: string) => {
    setEditorCode(code);
  };

  const { lastCodeMessageHtmlCode } = useReactCodeEditorStore();

  return (
    <PageComponent className="flex flex-1 h-full p-0">
      {/* Header Navigation */}

      {/* Sidebar */}
      <EditorSidebar
        onCodeReceived={handleCodeReceived}
        conversationId={conversationId}
        isEdition={isEdition}
      />

      {/* Main Content */}
      <div className="flex flex-col w-full">
        <MonacoEditorTemplate>
          <div className="flex items-center gap-2">
            <Type variant="sm" className="flex items-center gap-2">
              <DocumentIcon className="size-4" />
              Templates
            </Type>
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

          <div className="flex items-center gap-4">
            <Link
              href="https://react.email/docs/introduction"
              title="React email documentation"
              target="_blank"
              className="hover:underline"
            >
              <Type variant="link">See documentation</Type>
            </Link>

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
              <div className="flex flex-col w-full h-full bg-white">
                <div className="flex flex-col mx-auto w-4/5 h-full font-sans">
                  <div className="flex flex-col my-4 text-black/80">
                    <div>
                      <div className="flex border-b items-center h-[40px] !border-muted-foreground/30">
                        <Type className="w-[60px]">From</Type>
                        <input
                          className="w-full h-full outline-0 disabled:opacity-70"
                          placeholder="Company <x@example.com>"
                          value={"info@zot.so"}
                          disabled
                        />
                        <Type style={{ textWrap: "nowrap" }} className="text-black/70">
                          Feature for premium users
                        </Type>
                      </div>
                      <div className="flex border-b items-center h-[40px] !border-muted-foreground/30">
                        <input className="w-full h-full outline-0" placeholder="Subject" />
                      </div>
                    </div>
                  </div>
                  <iframe srcDoc={lastCodeMessageHtmlCode.html} className="h-full w-full" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </PageComponent>
  );
}
