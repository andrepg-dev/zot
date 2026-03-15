import { cn } from "@/lib/utils";
import { Skeleton } from "@heroui/react";

type Size = "sm" | "md" | "lg";

// HeroUI Switch track dimensions
const sizeMap: Record<Size, { width: string; height: string }> = {
  sm: { width: "w-10", height: "h-5" },
  md: { width: "w-12", height: "h-6" },
  lg: { width: "w-14", height: "h-7" },
};

type SwitchSkeletonProps = {
  size?: Size;
  className?: string;
};

export default function SwitchSkeleton({ size = "sm", className }: SwitchSkeletonProps) {
  const { width, height } = sizeMap[size];

  return (
    <Skeleton className={cn(height, width, "rounded-full", className)} />
  );
}
