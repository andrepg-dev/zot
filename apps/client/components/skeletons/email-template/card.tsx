import TypeSkeleton from "@/components/skeletons/type";
import { Skeleton } from "@heroui/react";

export default function EmailTemplateCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="relative col-span-full grid grid-cols-subgrid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="bg-default-50/70 border w-full aspect-video flex justify-center relative">
            <Skeleton className="w-3/4 h-3/4 absolute bottom-0 rounded-sm" />
          </div>

          <div className="flex flex-col gap-1">
            <TypeSkeleton variant="h6" width="w-28" />
            <TypeSkeleton variant="base" width="w-40" />
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
}
