import { cn } from "@/lib/utils";
import { Skeleton } from "@heroui/react";

type Size = "sm" | "md" | "lg";

// HeroUI Checkbox box dimensions
const sizeMap: Record<Size, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

type CheckboxSkeletonProps = {
  size?: Size;
  labelWidth?: string;
  className?: string;
};

export default function CheckboxSkeleton({ size = "sm", labelWidth, className }: CheckboxSkeletonProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Skeleton className={cn(sizeMap[size], "rounded-sm")} />
      {labelWidth && <Skeleton className={cn("h-4 rounded-md", labelWidth)} />}
    </div>
  );
}
