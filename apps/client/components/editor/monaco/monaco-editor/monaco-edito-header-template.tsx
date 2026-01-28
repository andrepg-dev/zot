import { cn } from "@/lib/utils";
import React from "react";

export default function MonacoEditorTemplate({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-b px-4 py-2 z-50 relative flex items-center justify-between overflow-hidden bg-background text-xs h-[49px] max-h-[49px]",
        className
      )}
    >
      {children}
    </div>
  );
}
