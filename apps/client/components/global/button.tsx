"use client";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@heroui/button";

export interface GlobalButtonProps extends ButtonProps {
  className?: string;
}

export default function GlobalButton({
  className,
  disableRipple = false,
  children,
  ...props
}: GlobalButtonProps) {
  return (
    <Button
      className={cn(props.color === "primary" && "border", className)}
      disableRipple={disableRipple}
      {...props}
      size="sm"
      radius="sm"
    >
      {children}
    </Button>
  );
}
