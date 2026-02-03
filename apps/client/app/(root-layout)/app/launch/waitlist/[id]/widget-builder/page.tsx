"use client";

import MonacoEditor from "@/components/editor/monaco/monaco-editor/monaco-editor";
import Title from "@/components/global/title";
import GlobalTooltip from "@/components/global/tooltip";
import PageComponent from "@/components/layouts/page-component";
import WidgetBuilderForm from "@/components/wait-list/widget-builder/widget-builder-form";
import { cn } from "@/lib/utils";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [type, setType] = useState<"editor" | "web">("web");

  return (
    <div className="flex h-full">
      <PageComponent className="border-r h-full">
        <Title description="Build and customize your widget">Widget Builder</Title>
        <WidgetBuilderForm id={id} />
      </PageComponent>

      <div className="w-full flex flex-col ">
        {/* HEADER */}
        <div className="w-full p-2 px-6 border-b">
          <div className="border rounded-md w-max h-max flex bg-default-100 overflow-hidden text-xs">
            <GlobalTooltip content="Vista previa web">
              <button
                onClick={() => setType("web")}
                className={cn(
                  "p-1 px-2 rounded !cursor-pointer text-xs transition-colors",
                  type === "web" && "bg-default-50"
                )}
              >
                <EyeIcon className="size-4" />
              </button>
            </GlobalTooltip>
            <GlobalTooltip content="Vista de código">
              <button
                onClick={() => setType("editor")}
                className={cn(
                  "p-1 px-2 rounded !cursor-pointer text-xs transition-colors",
                  type === "editor" && "bg-default-50"
                )}
              >
                <CodeBracketIcon className="size-4" />
              </button>
            </GlobalTooltip>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {type === "editor" ? (
            <MonacoEditor value="Hola" language="html" height="100%" />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="border rounded-lg p-8 bg-default-50">
                <p className="text-sm text-default-500">Vista previa del widget</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
