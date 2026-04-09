"use client";

import CopyButton from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  displayCode?: string;
  lang?: string;
  className?: string;
}

export default function CodeBlock({
  code,
  displayCode,
  lang = "typescript",
  className
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [revealed, setRevealed] = useState(false);

  const visibleCode = revealed || !displayCode ? code : displayCode;

  useEffect(() => {
    codeToHtml(visibleCode, {
      lang,
      theme: "github-dark-default"
    }).then(setHtml);
  }, [visibleCode, lang]);

  return (
    <div className={cn("relative group rounded-sm border overflow-hidden", className)}>
      <div className="absolute right-2 top-2 transition-opacity">
        <CopyButton text={code} size="sm" children={<>Copy code</>} />
      </div>
      {html ? (
        <div
          className={cn(
            "text-xs leading-relaxed overflow-x-auto [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-zinc-950! ",
            displayCode && !revealed && "cursor-pointer"
          )}
          onClick={displayCode && !revealed ? () => setRevealed(true) : undefined}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="bg-zinc-950 p-4 text-xs leading-relaxed">
          <code>{visibleCode}</code>
        </pre>
      )}
    </div>
  );
}
