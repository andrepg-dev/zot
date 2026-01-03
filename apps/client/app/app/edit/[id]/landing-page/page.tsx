"use client";

import Header from "@/components/app/landing-page/header";
import PageComponent from "@/components/layouts/page-component";
import HeaderNavigation from "@/components/navigation/header.navigation";
import SidebarNavigation from "@/components/navigation/sidebar.navigation";
import { useLandingPageState } from "@/store/landing-page/landing-page.action";
import {
  ChevronRightIcon,
  PaintBrushIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import Editor, { Monaco } from "@monaco-editor/react";
import {
  MonacoJsxSyntaxHighlight,
  getWorker,
} from "monaco-jsx-syntax-highlight";
import React, { useCallback, useState } from "react";
import OneDarkPro from "../../../../../theme/one-dark-pro.json";

export default function EditLandingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { editionType, visualizationType } = useLandingPageState();
  const [editorData, setEditorData] = useState(`const test = () => {
  const num: number = 123

  return (
    <div className='test'>
      {num}
      <div render={<div style={'background: red;'}/>}/>
      <div props={num}></div>
    </div>
  )
}`);

  const convertThemeToMonaco = (theme: any) => {
    const tokenColors = (theme.tokenColors || []).filter(
      (token: any) => token && token.settings,
    );

    const rules = tokenColors.flatMap((token: any) => {
      const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
      return scopes.map((scope: string) => ({
        token: scope,
        foreground: token.settings?.foreground,
        background: token.settings?.background,
        fontStyle: token.settings?.fontStyle,
      }));
    });

    return {
      base: "vs-dark",
      inherit: true,
      colors: theme.colors || {},
      rules: rules,
      semanticHighlighting: theme.semanticHighlighting,
      semanticTokenColors: theme.semanticTokenColors || {},
    };
  };

  const handleEditorBeforeMount = useCallback((monaco: Monaco) => {
    // Handle theme
    monaco.editor.defineTheme("OneDarkPro", convertThemeToMonaco(OneDarkPro));
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    // Configure compiler options for TypeScript
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
    });
  }, []);

  const handleEditorMount = useCallback((editor: any, monaco: any) => {
    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(
      getWorker(),
      monaco,
    );

    const { highlighter, dispose } =
      monacoJsxSyntaxHighlight.highlighterBuilder({
        editor: editor,
      });
    highlighter();

    editor.onDidChangeModelContent(() => {
      highlighter();
    });

    return dispose;
  }, []);

  return (
    <PageComponent className="flex flex-1 h-full p-0">
      <HeaderNavigation
        navigationItems={[
          { label: "Landing Page", pathname: "/app/landing-page" },
          { label: id, pathname: id },
        ]}
        postNavigationItems={
          <div>
            <Button
              size="sm"
              className="px-3 py-2 bg-foreground text-white dark:text-black h-max"
            >
              Publish
            </Button>
          </div>
        }
      />
      <SidebarNavigation
        className="w-[620px] overflow-y-auto z-50"
        children={
          <div className="p-4 pb-0 flex flex-col h-full flex-1 text-sm gap-2 w-[435px]">
            <div className="flex flex-col gap-2.5 flex-1 min-h-0 pb-52">
              <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>
              <div className="p-2 rounded-lg max-w-4/5">Hola</div>
              <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>
              <div className="p-2 rounded-lg max-w-4/5">Hola</div>
              <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>
              <div className="p-2 rounded-lg max-w-4/5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>

              <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>
              <div className="p-2 rounded-lg max-w-4/5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>

              <div className="bg-default-100 p-2 border rounded-lg max-w-4/5 ml-auto ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                nostrum sequi perferendis tempora! Vero optio labore pariatur
                officia eaque porro quae deserunt non, totam dolores dicta,
                neque assumenda tenetur voluptate?
              </div>
            </div>

            <footer className="bg-sidebar flex-shrink-0 sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.80)]">
              <div className="bg-default-50 mb-4 rounded-lg border">
                <textarea
                  className="w-full p-4 text-sm resize-none outline-none "
                  placeholder="Describe your business here"
                />

                <div className="flex px-3 pb-2 pt-1 items-center justify-between">
                  <button className="p-1.5 rounded-full cursor-pointer hover:ring-2 ring-default/30">
                    <PlusIcon className="size-4" />
                  </button>

                  <button
                    disabled
                    className="disabled:opacity-60 bg-primary p-1.5 rounded-full cursor-pointer hover:ring-2 ring-primary/30"
                  >
                    <ChevronRightIcon className="size-4" />
                  </button>
                </div>
              </div>
            </footer>
          </div>
        }
      />

      <div className="h-full flex-1 w-full relative">
        <Header />

        {/* CONTENT */}
        {editionType === "ai" && visualizationType !== "code" && (
          <div className="flex flex-col text-muted-foreground absolute w-full h-full justify-center items-center gap-2 bottom-0 -z-0 bg-default-50">
            <PaintBrushIcon className="size-5" />

            <footer className="absolute bottom-4 mx-auto flex gap-4 text-muted-foreground/40">
              Let's explore
            </footer>
          </div>
        )}

        {visualizationType === "code" && (
          <>
            <Editor
              height={"94%"}
              onMount={handleEditorMount}
              beforeMount={handleEditorBeforeMount}
              language="typescript"
              theme="OneDarkPro"
              path="file:///index.tsx"
              value={editorData}
              onChange={(value) => {
                setEditorData(value ?? "");
              }}
              options={{
                fontSize: 13,
                minimap: {
                  enabled: false,
                },
                tabSize: 2,
                hover: {
                  enabled: false,
                },
              }}
            />
          </>
        )}
      </div>
    </PageComponent>
  );
}
