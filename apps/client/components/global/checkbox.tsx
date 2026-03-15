"use client";

import { cn } from "@/lib/utils";
import { Checkbox, type CheckboxProps } from "@heroui/checkbox";

export interface GlobalCheckboxProps extends CheckboxProps {}

export default function GlobalCheckbox({ classNames, ...props }: GlobalCheckboxProps) {
  return (
    <Checkbox
      size="sm"
      classNames={{
        ...classNames,
        wrapper: cn("before:border-1", classNames?.wrapper)
      }}
      {...props}
    />
  );
}
