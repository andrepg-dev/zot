import { cn } from "@/lib/utils";
import React from "react";

export default function PageComponent({
  children,
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div {...props} className={cn("p-6 text-sm", className)}>
      {children}
    </div>
  );
}
