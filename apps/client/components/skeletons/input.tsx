import { cn } from "@/lib/utils";
import { Skeleton } from "@heroui/react";

type Size = "sm" | "md" | "lg";

// HeroUI Input rendered heights
const heightMap: Record<Size, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-11",
};

type InputSkeletonProps = {
  size?: Size;
  width?: string;
  className?: string;
};

export default function InputSkeleton({ size = "sm", width = "w-full", className }: InputSkeletonProps) {
  return (
    <Skeleton className={cn(heightMap[size], width, "rounded-sm", className)} />
  );
}
