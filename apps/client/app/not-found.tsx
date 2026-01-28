"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-3.5rem)] px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Error Code */}
        <div className="relative mb-8">
          <span className="text-[150px] font-bold leading-none text-foreground/5 select-none">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-foreground">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="text-xl font-medium text-foreground mb-2">Page not found</h1>
        <p className="text-muted-foreground text-sm mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            as={Link}
            href="/app/dashboard"
            variant="bordered"
            size="sm"
            startContent={<ArrowLeftIcon className="size-4" />}
            className="text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
          >
            Back to dashboard
          </Button>
        </div>

        {/* Subtle decoration */}
        <div className="mt-16 flex items-center gap-2 text-muted-foreground/50 text-xs">
          <span className="w-8 h-px bg-muted-foreground/20" />
          <span>zot</span>
          <span className="w-8 h-px bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
}
