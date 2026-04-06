"use client";

import { cn } from "@/lib/utils";
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Link from "next/link";

export interface PageActionsProps {
  searchPlaceholder?: string;
  showFilter?: boolean;
  actionButton: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    endContent?: React.ReactNode;
  };
  onSearchChange?: (value: string) => void;
  className?: string;
}

export default function PageActions({
  searchPlaceholder = "Search by name...",
  showFilter = true,
  actionButton,
  onSearchChange,
  className
}: PageActionsProps) {
  return (
    <div className={cn("flex justify-between my-6", className)}>
      <div className="flex gap-2">
        <Input
          placeholder={searchPlaceholder}
          variant="bordered"
          startContent={<MagnifyingGlassIcon className="text-default-300 size-5" />}
          size="sm"
          isClearable
          classNames={{
            base: "max-w-sm",
            inputWrapper: "border-1"
          }}
          onValueChange={onSearchChange}
        />

        {showFilter && (
          <Button size="sm" variant="light" className="min-w-max border border-dashed">
            <FunnelIcon className="size-4" />
          </Button>
        )}
      </div>

      <Button
        as={Link}
        href={actionButton.href}
        className="bg-primary border-transparent border transition-none"
        startContent={actionButton.icon || <PlusIcon className="size-5" />}
        endContent={actionButton.endContent}
        size="sm"
        variant="shadow"
        type="button"
      >
        {actionButton.label}
      </Button>
    </div>
  );
}
