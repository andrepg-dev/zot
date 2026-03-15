import { cn } from "@/lib/utils";
import { Skeleton } from "@heroui/react";

type TextareaSkeletonProps = {
  height?: string;
  width?: string;
  className?: string;
};

export default function TextareaSkeleton({ height = "h-20", width = "w-full", className }: TextareaSkeletonProps) {
  return (
    <Skeleton className={cn(height, width, "rounded-sm", className)} />
  );
}
