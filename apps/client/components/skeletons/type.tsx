import { cn } from "@/lib/utils";
import { Skeleton } from "@heroui/react";

type VariantKey = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "base" | "sm" | "link";

const heightMap: Record<VariantKey, string> = {
  h1: "h-7",
  h2: "h-7",
  h3: "h-7",
  h4: "h-6",
  h5: "h-6",
  h6: "h-5",
  base: "h-5",
  sm: "h-4",
  link: "h-5"
};

type TypeSkeletonProps = {
  variant?: VariantKey;
  width: string;
  className?: string;
};

export default function TypeSkeleton({ variant = "base", width, className }: TypeSkeletonProps) {
  return <Skeleton className={cn(heightMap[variant], width, "rounded-md", className)} />;
}
