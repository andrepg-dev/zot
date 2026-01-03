"use client";

import { useLandingPageState } from "@/store/landing-page/landing-page.store";
import { Editor, Monaco } from "@monaco-editor/react";
import {
  MonacoJsxSyntaxHighlight,
  getWorker,
} from "monaco-jsx-syntax-highlight";
import { useCallback, useState } from "react";
import OneDarkPro from "../../../../theme/one-dark-pro.json";
import { initialValue } from "./monaco.constants";

export default function MonacoEditor() {
  const [editorData, setEditorData] = useState(initialValue);
  const { editionType } = useLandingPageState();

  const convertThemeToMonaco = (theme: any) => {
    const tokenColors = (theme.tokenColors || []).filter(
      (token: any) => token && token.settings
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
    const theme = convertThemeToMonaco(OneDarkPro);

    // Add semantic token colors for React hooks
    theme.semanticTokenColors = {
      ...theme.semanticTokenColors,
      "function.defaultLibrary": "#c678dd",
      function: "#61afef",
    };

    monaco.editor.defineTheme("OneDarkPro", theme);
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  }, []);

  const handleEditorMount = useCallback((editor: any, monaco: any) => {
    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(
      getWorker(),
      monaco
    );

    const { highlighter, dispose } =
      monacoJsxSyntaxHighlight.highlighterBuilder({
        editor: editor,
      });
    highlighter();

    let hookDecorations: string[] = [];
    let componentDecorations: string[] = [];

    const htmlTags = new Set([
      "div",
      "span",
      "button",
      "p",
      "section",
      "article",
      "header",
      "footer",
      "nav",
      "main",
      "aside",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "input",
      "textarea",
      "select",
      "option",
      "form",
      "label",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
      "br",
      "hr",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "code",
      "pre",
      "blockquote",
      "dl",
      "dt",
      "dd",
      "iframe",
      "canvas",
      "svg",
      "path",
      "circle",
      "rect",
      "line",
      "polyline",
      "polygon",
    ]);

    const highlightHooks = () => {
      const model = editor.getModel();
      if (!model) return;

      const content = model.getValue();
      const lines = content.split("\n");
      const newDecorations: any[] = [];

      lines.forEach((line: string, lineIndex: number) => {
        const hookRegex = /\b(use[A-Z][a-zA-Z]*)\b/g;
        let match;

        while ((match = hookRegex.exec(line)) !== null) {
          const hookName = match[1];
          const startColumn = match.index + 1;
          const endColumn = startColumn + hookName.length;

          newDecorations.push({
            range: new monaco.Range(
              lineIndex + 1,
              startColumn,
              lineIndex + 1,
              endColumn
            ),
            options: {
              inlineClassName: "react-hook",
            },
          });
        }
      });

      hookDecorations = editor.deltaDecorations(
        hookDecorations,
        newDecorations
      );
    };

    const highlightComponents = () => {
      const model = editor.getModel();
      if (!model) return;

      const content = model.getValue();
      const lines = content.split("\n");
      const newDecorations: any[] = [];

      lines.forEach((line: string, lineIndex: number) => {
        // Match JSX tags: <TagName or </TagName
        const tagRegex = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)/g;
        let match;

        while ((match = tagRegex.exec(line)) !== null) {
          const tagName = match[2];
          const startColumn = match.index + match[1].length + 2; // +2 for </ or <
          const endColumn = startColumn + tagName.length;

          // Check if it's an HTML tag (lowercase) or custom component (PascalCase)
          const isHtmlTag = htmlTags.has(tagName.toLowerCase());
          const isCustomComponent = /^[A-Z]/.test(tagName) && !isHtmlTag;

          if (isHtmlTag) {
            newDecorations.push({
              range: new monaco.Range(
                lineIndex + 1,
                startColumn,
                lineIndex + 1,
                endColumn
              ),
              options: {
                inlineClassName: "jsx-tag-name-html",
              },
            });
          } else if (isCustomComponent) {
            newDecorations.push({
              range: new monaco.Range(
                lineIndex + 1,
                startColumn,
                lineIndex + 1,
                endColumn
              ),
              options: {
                inlineClassName: "jsx-tag-name-custom",
              },
            });
          }
        }
      });

      componentDecorations = editor.deltaDecorations(
        componentDecorations,
        newDecorations
      );
    };

    editor.onDidChangeModelContent(() => {
      highlighter();
      setTimeout(() => {
        highlightHooks();
        highlightComponents();
      }, 100);
    });

    setTimeout(() => {
      highlightHooks();
      highlightComponents();
    }, 100);

    return () => {
      dispose();
      if (hookDecorations.length > 0) {
        editor.deltaDecorations(hookDecorations, []);
      }
      if (componentDecorations.length > 0) {
        editor.deltaDecorations(componentDecorations, []);
      }
    };
  }, []);

  return (
    <Editor
      height={editionType === "manually" ? "95.2%" : "95%"}
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
        fontFamily: "Geist Mono",
      }}
    />
  );
}
