import { cn } from "@/lib/utils";
import { Skeleton } from "@heroui/react";

type Size = "sm" | "md" | "lg";

// HeroUI Button rendered heights
const heightMap: Record<Size, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-11",
};

type ButtonSkeletonProps = {
  size?: Size;
  width?: string;
  isIconOnly?: boolean;
  className?: string;
};

export default function ButtonSkeleton({ size = "sm", width, isIconOnly, className }: ButtonSkeletonProps) {
  const w = isIconOnly ? heightMap[size] : (width ?? "w-24");

  return (
    <Skeleton className={cn(heightMap[size], w, "rounded-sm", className)} />
  );
}
