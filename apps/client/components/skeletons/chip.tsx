import { cn } from "@/lib/utils";
import { Skeleton } from "@heroui/react";

type ChipSkeletonProps = {
  width?: string;
  className?: string;
};

export default function ChipSkeleton({ width = "w-14", className }: ChipSkeletonProps) {
  return (
    <Skeleton className={cn("h-[18px] rounded-full", width, className)} />
  );
}
