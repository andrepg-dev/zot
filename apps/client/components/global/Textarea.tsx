"use client";

import { cn } from "@/lib/utils";
import { Textarea, type TextAreaProps } from "@heroui/input";

export interface GlobalTextareaProps extends TextAreaProps {
  className?: string;
}

export default function GlobalTextarea({
  className,
  radius = "sm",
  ...props
}: GlobalTextareaProps) {
  return (
    <Textarea
      className={cn(className)}
      radius={radius}
      disableAnimation
      {...props}
    />
  );
}
