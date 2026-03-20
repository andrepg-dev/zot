"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Drawer, DrawerContent, type DrawerProps } from "@heroui/react";
import React, { useState } from "react";

interface GlobalDrawerProps extends Omit<DrawerProps, "size" | "radius" | "children"> {
  size?: DrawerProps["size"];
  expandedSize?: DrawerProps["size"];
  children: React.ReactNode;
}

function ResizeHandle({
  expanded,
  onToggle
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  const ArrowIcon = expanded ? ChevronRightIcon : ChevronLeftIcon;

  return (
    <div
      className="group absolute left-0 top-0 z-[9999] flex h-full w-4 cursor-col-resize items-center justify-center"
      onClick={onToggle}
    >
      <div className="absolute inset-y-0 left-0 w-px bg-border opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="flex size-6 min-w-4 min-h-6 ml-2 items-center justify-center rounded border bg-default-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <ArrowIcon className="size-3" />
      </div>
    </div>
  );
}

export default function GlobalDrawer({
  size = "2xl",
  expandedSize,
  isOpen,
  onOpenChange,
  children,
  classNames,
  ...props
}: GlobalDrawerProps) {
  const [expanded, setExpanded] = useState(false);

  function handleOpenChange(open: boolean) {
    if (!open) setExpanded(false);
    onOpenChange?.(open);
  }

  const currentSize = expanded && expandedSize ? expandedSize : size;

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      size={currentSize}
      radius="sm"
      classNames={{
        ...classNames,
        base: `transition-all duration-300 ${classNames?.base ?? ""}`
      }}
      {...props}
    >
      <DrawerContent>
        <>
          {expandedSize && (
            <ResizeHandle
              expanded={expanded}
              onToggle={() => setExpanded((prev) => !prev)}
            />
          )}
          {children}
        </>
      </DrawerContent>
    </Drawer>
  );
}
