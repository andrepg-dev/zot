"use client";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@heroui/button";

export default function PrimaryActionButton({
  className,
  children,
  size = "sm",
  ...props
}: ButtonProps) {
  return (
    <Button
      size={size}
      className={cn("px-3 py-2 bg-foreground text-white dark:text-black h-max border", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

