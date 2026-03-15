import { Card, CardBody } from "@heroui/react";
import ChipSkeleton from "@/components/skeletons/chip";
import TypeSkeleton from "@/components/skeletons/type";

export default function WaitListCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="relative col-span-full grid grid-cols-subgrid">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border" radius="sm">
          <CardBody className="p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1 flex-1">
                  <TypeSkeleton variant="link" width="w-32" />
                  <TypeSkeleton variant="sm" width="w-48" />
                </div>
                <ChipSkeleton />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <TypeSkeleton variant="sm" width="w-20" />
                  <TypeSkeleton variant="sm" width="w-8" />
                </div>
                <div className="flex justify-between items-center">
                  <TypeSkeleton variant="sm" width="w-20" />
                  <TypeSkeleton variant="sm" width="w-8" />
                </div>
                <div className="flex justify-between items-center">
                  <TypeSkeleton variant="sm" width="w-24" />
                  <TypeSkeleton variant="sm" width="w-8" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
}
