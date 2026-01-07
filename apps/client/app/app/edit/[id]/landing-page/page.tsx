"use client";

import MonacoEditorHeader from "@/components/app/landing-page/monaco-editor-header";
import EditorHeader from "@/components/editor/header/header";
import MonacoEditor from "@/components/editor/monaco-editor/monaco-editor";
import EditorSidebar from "@/components/editor/sidebar/sidebar";
import PageComponent from "@/components/layouts/page-component";
import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import React from "react";

export default function EditLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { visualizationType } = useLandingPageState();

  return (
    <PageComponent className="flex flex-1 h-full p-0">
      <EditorHeader id={id} />
      <EditorSidebar />

      <div className="h-full flex-1 w-full relative">
        <MonacoEditorHeader />

        {/* CONTENT */}
        {/* {visualizationType === "web" && (
          <div className="flex flex-col text-muted-foreground absolute w-full h-full justify-center items-center gap-2 bottom-0 -z-0 bg-default-50">
            <PaintBrushIcon className="size-5" />

            <footer className="absolute bottom-4 mx-auto flex gap-4 text-muted-foreground/40">
              Let's explore
            </footer>
          </div>
        )} */}

        {visualizationType === "code" && <MonacoEditor />}
      </div>
    </PageComponent>
  );
}
